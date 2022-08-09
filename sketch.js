/* eslint-disable no-undef, no-unused-vars */

let capture;
let capture1;
let capture2;
let capture3;
let capture4;
let capture5;
let capture6;
let and;
let threshold;
let R, G, B;
let max, min;
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  // Put setup code here
  background(255);
  capture = createCapture(VIDEO);
  capture.size(300, 300);
  capture.hide();
  capture1 = createImage(capture.width, capture.height / 2);
  capture2 = createImage(capture.width, capture.height / 2);
  capture3 = createImage(capture.width, capture.height / 2);
  capture4 = createImage(capture.width, capture.height / 2);
  capture5 = createImage(capture.width, capture.height / 2);
  capture6 = createImage(capture.width, capture.height / 2);
  and = createSlider(0, 255, 100, 1);
  and.position(680, 200);

  threshold = createSlider(0, 255, 100, 1);
  threshold.position(1000, 200);
  min = createSlider(0, 1, 0.004, 0.001);
  max = createSlider(0, 1, 0.131, 0.001);
  min.position(680, 440);
  max.position(680, 480);

  R = createSlider(0, 255, 100, 1);
  R.position(40, 400);
  G = createSlider(0, 255, 100, 1);
  G.position(40, 420);
  B = createSlider(0, 255, 100, 1);
  B.position(40, 440);
}

function draw() {
  background(255);
  // 原始图像
  fill(0);
  noStroke();
  textSize(20);
  text("原始图像", 0, 20);
  image(capture, 0, 40);

  // 灰度处理
  gray(capture, capture1);
  fill(0);
  noStroke();
  textSize(20);
  text("灰度处理", 340, 20);
  image(capture1, 340, 40);

  // 按位与操作
  bitwiseAND(capture1, capture2, and.value());

  fill(0);
  noStroke();
  textSize(20);
  text("&操作  gray & " + and.value(), 680, 20);
  image(capture2, 680, 40);

  // 阈值处理
  thresholding(capture2, capture3, threshold.value());
  fill(0);
  noStroke();
  textSize(20);
  text("阈值处理" + threshold.value(), 1000, 20);
  image(capture3, 1000, 40);

  // RGB & 操作
  RGBAnd(capture, capture4, R.value(), G.value(), B.value());

  fill(0);
  noStroke();
  textSize(20);
  text(`原图像RGB & 操作(${R.value()},${G.value()},${B.value()})`, 0, 220);
  image(capture4, 0, 240);

  // 灰度处理之后，进行RGB & 操作
  RGBAnd(capture1, capture5, R.value(), G.value(), B.value());
  fill(0);
  noStroke();
  textSize(20);
  text(`灰度处理RGB & 操作(${R.value()},${G.value()},${B.value()})`, 320, 220);
  image(capture5, 340, 240);

  // H值阈值处理
  HDouble(capture, capture6, min.value(), max.value());
  fill(0);
  noStroke();
  textSize(20);
  text(`H阈值操作(${min.value()},${max.value()})`, 680, 240);
  image(capture6, 680, 260);
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

/**
 * 根据图像1对图像进行灰度处理
 * @param {p5.Image} img1
 * @param {p5.Image} img2
 */
function gray(img1, img2) {
  img1.loadPixels();
  img2.loadPixels();
  for (let x = 0; x < img1.width; x++) {
    for (let y = 0; y < img1.height; y++) {
      let index = (x + y * img1.width) * 4;
      let r = img1.pixels[index + 0];
      let g = img1.pixels[index + 1];
      let b = img1.pixels[index + 2];
      let all = (r + g + b) / 3;
      // 绘制
      img2.pixels[index + 0] = all;
      img2.pixels[index + 1] = all;
      img2.pixels[index + 2] = all;
      img2.pixels[index + 3] = 255;
    }
  }
  img1.updatePixels();
  img2.updatePixels();
}

/**
 * 对图像进行按位与操作
 * @param {p5.Image} img1
 * @param {p5.Image} img2
 * @param {number} and
 */
function bitwiseAND(img1, img2, and) {
  img1.loadPixels();
  img2.loadPixels();
  for (let x = 0; x < img1.width; x++) {
    for (let y = 0; y < img1.height; y++) {
      let index = (x + y * img1.width) * 4;
      let r = img1.pixels[index + 0];
      // 绘制
      img2.pixels[index + 0] = r & and;
      img2.pixels[index + 1] = r & and;
      img2.pixels[index + 2] = r & and;
      img2.pixels[index + 3] = 255;
    }
  }
  img1.updatePixels();
  img2.updatePixels();
}

// 阈值处理
function thresholding(img1, img2, thresholdValue) {
  img1.loadPixels();
  img2.loadPixels();
  for (let x = 0; x < img1.width; x++) {
    for (let y = 0; y < img1.height; y++) {
      let index = (x + y * img1.width) * 4;
      let r = img1.pixels[index + 0];
      if (r < thresholdValue) {
        r = 0;
      } else {
        r = 255;
      }
      img2.pixels[index + 0] = r;
      img2.pixels[index + 1] = r;
      img2.pixels[index + 2] = r;
      img2.pixels[index + 3] = 255;
    }
  }
  img1.updatePixels();
  img2.updatePixels();
}

// 对图像进行RGB操作
function RGBAnd(img1, img2, R, G, B) {
  img1.loadPixels();
  img2.loadPixels();
  for (let x = 0; x < img1.width; x++) {
    for (let y = 0; y < img1.height; y++) {
      let index = (x + y * img1.width) * 4;
      let r = img1.pixels[index + 0];
      let g = img1.pixels[index + 1];
      let b = img1.pixels[index + 3];

      img2.pixels[index + 0] = r & R;
      img2.pixels[index + 1] = g & G;
      img2.pixels[index + 2] = b & B;
      img2.pixels[index + 3] = 255;
    }
  }
  img1.updatePixels();
  img2.updatePixels();
}

// 讲RGB色值转化为HSV，并对H值进行阈值处理
function HDouble(img1, img2, min, max) {
  img1.loadPixels();
  img2.loadPixels();
  for (let x = 0; x < img1.width; x++) {
    for (let y = 0; y < img1.height; y++) {
      let index = (x + y * img1.width) * 4;
      let r = img1.pixels[index + 0];
      let g = img1.pixels[index + 1];
      let b = img1.pixels[index + 3];
      let h = H(r, g, b);
      let value;
      if (thresholdValue(h, min, max)) {
        value = 255;
      } else {
        value = 0;
      }
      img2.pixels[index + 0] = value;
      img2.pixels[index + 1] = value;
      img2.pixels[index + 2] = value;
      img2.pixels[index + 3] = 255;
    }
  }
  img1.updatePixels();
  img2.updatePixels();
}

function H(R, G, B) {
  let max = Math.max(R, G, B);
  let min = Math.min(R, G, B);
  let H;
  switch (max) {
    case R:
      H = ((G - B) / (max - min)) * (Math.PI / 3);
      break;
    case G:
      H = ((B - R) / max - min) * (Math.PI / 3);
      break;
    case B:
      H = ((R - G) / (max - min)) * (Math.PI / 3);
      break;
    default:
      break;
  }
  return H;
}

function thresholdValue(h, min, max) {
  if (min < h && h < max) {
    return true;
  } else {
    return false;
  }
}
