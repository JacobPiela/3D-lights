
let config = {}

let index = 1
let colors = []
let counter = 1

exports.setup = function(config1,args){
    config = config1
    colors.push(0x0000FF)
    colors.push(0x000000)
    colors.push(0x000000)
}

exports.draw = function(pixels,args,daltaTime){

    for (var i = 0; i < config.leds; i++){
        pixels[i] = colors[(i+index)%colors.length];
    }
    counter++
    if(counter%30==1){index++}
    return pixels
}