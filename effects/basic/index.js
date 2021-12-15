let config = {}


let colors = []


exports.setup = function(config1,args){
    config = config1

    colors.push(0x7B2C26)
    colors.push(0x26297B)
    colors.push(0x1F7B29)
    colors.push(0x7D480F)
    colors.push(0x7D7A17)

}

exports.draw = function(pixels,args,daltaTime){
    if(args.colors != undefined){
        try {
        colors = JSON.parse(args.colors)
        } catch(err){
            console.error("basic was unable to load now colors from args")
        }
    }

    for (var i = 0; i < config.leds; i++){
        pixels[i] = colors[(i)%colors.length];
    }
    return pixels
}