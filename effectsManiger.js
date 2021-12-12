const storage = require('node-persist')
const fs      = require('fs')
const LEDS    = require('rpi-ws281x')


exports.effectsManiger = function(config){
    this.config = config
    LEDS.configure(this.config)
    this.effects = {}
    this.effect = ""
    this.args = {}
    this.frameRate = 60
    this.effectTimer = 0
    this.pixels = new Uint32Array(this.config.leds)

    this.update = () => {
        if (this.effect == "error"){
            let now = new Date().getTime()
            if(Math.floor(now/1000) % 2 == 1){
                for (var i = 0; i < this.pixels.length; i++){
                    this.pixels[i] = 0x770000
                }
            } else {
                for (var i = 0; i < this.pixels.length; i++){
                    this.pixels[i] = 0x000000
                }
            }
            if(now/1000-this.effectTimer/1000 > 20){
                this.setEffect("")
            }
        } else if(this.effect != "") {
            try{
                this.effects[this.effect].draw(this.pixels,this.args,1)
            } catch(err) {
                console.error("ERROR: while running effect " + this.effect)
                console.error(err)
                this.setEffect("error")
            }
        }
        this.effectTimer++
        LEDS.render(this.pixels)
    }
    this.custom = (pixels) => {
        this.effect = ""
        this.pixels = pixels
    }
    this.clear = () => {
        this.setEffect("")
    }

    this.setEffect = (name) => {
        this.pixels = new Uint32Array(this.config.leds)
        this.effectTimer = new Date().getTime()
        if(name == "" || name == "error"){
            this.effect = name
        } else if(this.effects[name] != undefined){
            try{
                this.args = {}
                for (const arg in this.effects[name].args) {
                    this.args[arg] = this.effects[name].args[arg].default
                }
                this.effects[name].setup(this.config,this.args)
                this.effect = name
                console.log("Starting effect " + name)
            } catch(err) {
                console.error("ERROR: while starting effect " + name)
                console.error(err)
                this.setEffect("error")
            }
        } else {
            console.error("ERROR: " + name + "is not an effect")
            this.effect = "error"
        }
    }

    this.setFrameRate = (frameRate) => {
        this.frameRate = frameRate
        clearInterval(this.intervalID)
        this.intervalID = setInterval(this.update.bind(this), 1000/this.frameRate)
    }

    try{
        let directories = fs.readdirSync(__dirname + "/effects").filter(function (file) {return fs.statSync(__dirname + "/effects/"+file).isDirectory()})
        for(const dir of directories){
            console.log("Loading Effect: " + dir)
            let effectP = require("./effects/" + dir + "/package.json")
            let effectF = require("./effects/" + dir + "/" + effectP.main)
            effectP.setup = effectF.setup
            effectP.draw = effectF.draw
            this.effects[effectP.name] = effectP
        }
    } catch(err) {
        console.error("ERROR: Unable to load effects")
        console.error(err)
        this.setEffect("error")
    }



    this.setFrameRate(this.frameRate)
}