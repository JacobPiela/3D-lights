
let config = {}


//Modified from https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSVtoColor(h, s, v) {
    var r, g, b, i, f, p, q, t;
        
    s = s/256
    v = v/256
    h = h/256

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8)| Math.round(b * 255)
}

//form https://stackoverflow.com/questions/48802987/is-there-a-map-function-in-vanilla-javascript-like-p5-js
// linearly maps value from the range (a..b) to (c..d)
function mapRange (value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}



let index = 1
let colors = []


exports.setup = function(config1,args){
    config = config1
    for(let i=0; i<config.leds; i++){
        colors.push(HSVtoColor(mapRange(i,0,config.leds,0,255),250,args["Brightness"]))
    }
}

exports.draw = function(pixels,args,daltaTime){

    for (var i = 0; i < config.leds; i++){
        pixels[i] = colors[(i+index)%config.leds];
    }
    index++
    return pixels
}