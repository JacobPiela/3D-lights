let capture
let lastcapture
let LEDpos = []

function getpos(index){
  capture.loadPixels()
  let pic1 = [...capture.pixels]
  let picWidth = capture.width
  let picHeight = capture.height
  httpGet("/led?id=" + index, 'text',(response) => {
    setTimeout(100,()=>{
      capture.loadPixels()
      let pic2 = [...capture.pixels]
      for (y = 0; y < picHeight; y++) {
        for (x = 0; x < picWidth; x++) {
          let index = (x + y * picWidth) * 4;
          pic2[index]     = (pic2[index] - pic1[index] > 0 ?pic2[index] - pic1[index] : 0);
          pic2[index + 1] = 0;
          pic2[index + 2] = 0;
          pic2[index + 3] = 255;
        }
      }

    })
  })
}

function setup() {
  createCanvas(600, 600);
  let constraints = {
    video: {
      facingMode: {
        ideal: "environment"
      }
    },
    audio: false
  };
  capture = createCapture(constraints);
  capture.hide();
  capture.loadPixels()
  lastcapture = [...capture.pixels]
}

function draw(){
  capture.loadPixels()
  let tempp = [...capture.pixels]

  for (y = 0; y < capture.height; y++) {
    for (x = 0; x < capture.width; x++) {
      let index = (x + y * capture.width) * 4;
      capture.pixels[index]     = (capture.pixels[index] - lastcapture[index] > 0 ? capture.pixels[index] - lastcapture[index] : 0);
      capture.pixels[index + 1] = 0;
      capture.pixels[index + 2] = 0;
      capture.pixels[index + 3] = 255;
    }
  }
  capture.updatePixels()
  image(capture, 0, 0, width, width * capture.height / capture.width);
  lastcapture = tempp
}