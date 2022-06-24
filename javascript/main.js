
let serial;
// data from sensors = 'temperature:humudity:lux:humuduty_groung'
let temp, hum, lux, humg
let font;

function preload() {
  font = loadFont('../assets/Gerbera.ttf');
}

function setup() {
  createCanvas(windowHeight, windowHeight, WEBGL);
  textFont(font, width / 5);

  text('FLOWER', 10, 10)

  serial = new p5.SerialPort();
  serial.list();
  serial.open('/dev/tty.usbserial-110');
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);


  colorMode(HSB);
  angleMode(DEGREES);

  stroke(71, 26, 92);
  strokeWeight(4);
  frameRate(10)
  document.getElementById('body').addEventListener('click', () => {
    saveCanvas();
  })
}

function serverConnected() {
  console.log("Connected to Server");
}

function gotList(thelist) {
  console.log("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    console.log(i + " " + thelist[i]);
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
}

function gotClose() {
  console.log("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  console.log(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  [temp, hum, lux, humg] = currentString.split(":")
}

function draw() {
  colorMode(HSL);
  // let bgColor = map(lux, 0, 10000, 250, 0, true)
  let bgLightness = map(lux, 0, 100, 0, 100, true)

  background(50, 100, bgLightness)
  colorMode(HSB);
  orbitControl(4, 4);

  fontColor = map(round(map(map(lux, 0, 50, 255, 0, true), 0, 255, 0, 1)), 0, 1, 0, 255)
  console.log(fontColor);
  fill(fontColor)
  textAlign(LEFT);
  text('FLOWER', -width / 2, -height / 2 + 120)
  textAlign(RIGHT);
  text("POWER", width / 2 - 10, height / 2 - 20)


  rotateX(-70);
  rotateY(-150);

  flower()
}


function flower() {
  let flowerColor = map(hum, 50, 65, 180, 360, true)
  let flowerOpen = map(lux, 0, 100, 3, 18, true)
  let petelsCount = map(humg, 1023, 200, 0, 30, true)

  for (let r = 0; r <= 1; r += 0.02) {
    beginShape(POINTS);
    stroke(flowerColor - r * 20, 80 - r * 40, 60 + r * 40)

    for (let theta = 0; theta <= 180 * petelsCount; theta += 1.5) {
      let phi = (180 / 2.5) * Math.exp(-theta / (flowerOpen * 180));
      let petalCut = 0.75 + abs(asin(sin(2.75 * theta)) + 80 * sin(2.75 * theta)) / 480;
      let hangDown = 1.4 * pow(r, 2) * pow(1.0 * r - 1, 2) * sin(phi);


      if (0 < petalCut * (r * sin(phi) + hangDown * cos(phi))) {
        let pX = 280 * (1 - theta / 6000) * petalCut * (r * sin(phi) + hangDown * cos(phi)) * sin(theta);
        let pY = -280 * (1 - theta / 6000) * petalCut * (r * cos(phi) - hangDown * sin(phi));
        let pZ = 280 * (1 - theta / 6000) * petalCut * (r * sin(phi) + hangDown * cos(phi)) * cos(theta);
        vertex(pX, pY, pZ)
      }

    }
    endShape();
  }
}