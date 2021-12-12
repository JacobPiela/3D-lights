const fs      = require('fs')
const http    = require('http')
const https   = require('https')
const express = require('express')

const app = express()
app.set('view engine', 'ejs')


let settings        = require('./package.json')
let defaultSettings = require('./defaultSettings.json')
for (const setting in settings) {
    defaultSettings[setting] = settings[setting]
}
settings = defaultSettings


const config = {
    leds:settings.numberOfLEDS,
    gpio:settings.gpio,
    stringType:settings.LEDstripType
}
const effectsManiger = require("./effectsManiger")
const EM = new effectsManiger.effectsManiger(config)


EM.setEffect("rainbow")


const api = require('./api.v1')

app.use(express.static('static'))
api.init(app,EM)



//Start web Servers
let httpServer = http.createServer(app)
httpServer.listen(settings.port)

if(settings.ssl){
    let privateKey  = fs.readFileSync(__dirname + '/ssl/key.pem' , 'utf8')
    let certificate = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8')
    let httpsServer = https.createServer({key: privateKey, cert: certificate}, app)
    httpsServer.listen(settings.sslPort)
}