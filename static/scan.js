let camera
let LEDpos = []

let LEDFront = []
let LEDBack = []
let LEDLeft = []
let LEDRight = []


let testx = 0
let testy = 0
async function getled100(){
    let cords = await findLED(100)
    testx = cords.x
    testy = cords.y
}

function findLED(LED){
    camera.loadPixels()
    let picture1 = [...camera.pixels]//LED off image to compare against
    let picture2
    let pictureDiff = createImage(camera.width,camera.height)
    return new Promise(resolve => {
        //turn LED on
        httpGet("/api/v1/scanled?id=" + LED, 'text',(response) => {
            camera.loadPixels()
            picture2 = [...camera.pixels]//LED on image
            pictureDiff.loadPixels()
            //compare the 2 pictures
            for (let y = 0; y < camera.height; y++) {
                for (let x = 0; x < camera.width; x++) {
                    let index = (x + y * camera.width) * 4;
                    pictureDiff.pixels[index] = (picture2[index] - picture1[index] > 0 ? picture2[index] - picture1[index] : 0);
                    pictureDiff.pixels[index + 1] = 0;
                    pictureDiff.pixels[index + 2] = 0;
                    pictureDiff.pixels[index + 3] = 255;
                }
            }
            //apply filter
            pictureDiff.updatePixels()
            pictureDiff.filter(BLUR, 4)
            //find th brightest
            let brightest = {"value":0,"x":0,"y":0}
            pictureDiff.loadPixels()
            for (let y = 0; y < camera.height; y++) {
                for (let x = 0; x < camera.width; x++) {
                    let index = (x + y * camera.width) * 4;
                    if(pictureDiff.pixels[index] > brightest.value){
                        brightest.value = pictureDiff.pixels[index]
                        brightest.x = x
                        brightest.y = y
                    }
                }
            }
            //clear the tree ready for next time
            fetch('/api/v1/clear').then(() => resolve(brightest))
        })
    })
}


function setup() {
    createCanvas(600, 600)
    //button.position(0, 0)
    let constraints = {
        video: {
            facingMode: {
                ideal: "environment"
            }
        },
        audio: false
    }
    camera = createCapture(constraints)
    camera.hide()
}

function draw(){
    camera.loadPixels()//fix camera freezing TODO find another way to fix it
    image(camera, 0, 0, width,camera.height* camera.width/height)
    stroke(0,255,0)
    strokeWeight(10)
    point(testx * width/camera.width, testy * camera.width/height)
}