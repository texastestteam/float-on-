let boxes = [];
let numBoxes = 20;
let boxSize = 50;
let minSpeed = 0.5;
let testLink = "https://www.testteam.net";
let images = [];

function preload() {
  // Load images for the first 10 boxes, pushing null if image is missing
  for (let i = 1; i <= 10; i++) {
    let img = loadImage(`img/img${i}.png`, img => images.push(img), () => images.push(null));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER); // Set image mode to center for easier positioning and scaling
  for (let i = 0; i < numBoxes; i++) {
    let img = i < images.length ? images[i] : null;
    boxes.push(new Box(random(width - boxSize), random(height - boxSize), boxSize, img));
  }
}

function draw() {
  background(0);
  for (let box of boxes) {
    box.update();
    box.checkEdges();
    box.checkCollisions(boxes);
    box.display();
  }
}

function mousePressed() {
  // Check if the first 10 boxes are clicked
  for (let i = 0; i < 10; i++) {
    if (boxes[i].isClicked(mouseX, mouseY)) {
      window.open(testLink, "_blank");
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Box {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;
    this.speedX = random(-minSpeed, minSpeed);
    this.speedY = random(-minSpeed, minSpeed);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Ensure minimum speed to prevent stopping
    if (abs(this.speedX) < minSpeed) this.speedX = minSpeed * (this.speedX < 0 ? -1 : 1);
    if (abs(this.speedY) < minSpeed) this.speedY = minSpeed * (this.speedY < 0 ? -1 : 1);
  }

  checkEdges() {
    if (this.x <= 0 || this.x + this.size >= width) this.speedX *= -1;
    if (this.y <= 0 || this.y + this.size >= height) this.speedY *= -1;
  }

  checkCollisions(otherBoxes) {
    for (let other of otherBoxes) {
      if (other !== this) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance < this.size) {
          let angle = atan2(dy, dx);
          let targetX = this.x + cos(angle) * this.size;
          let targetY = this.y + sin(angle) * this.size;
          let ax = (targetX - other.x) * 0.5;
          let ay = (targetY - other.y) * 0.5;

          this.x -= ax;
          this.y -= ay;
          other.x += ax;
          other.y += ay;

          let tempSpeedX = this.speedX;
          let tempSpeedY = this.speedY;
          this.speedX = other.speedX;
          this.speedY = other.speedY;
          other.speedX = tempSpeedX;
          other.speedY = tempSpeedY;

          if (abs(this.speedX) < minSpeed) this.speedX = minSpeed * (this.speedX < 0 ? -1 : 1);
          if (abs(this.speedY) < minSpeed) this.speedY = minSpeed * (this.speedY < 0 ? -1 : 1);
          if (abs(other.speedX) < minSpeed) other.speedX = minSpeed * (other.speedX < 0 ? -1 : 1);
          if (abs(other.speedY) < minSpeed) other.speedY = minSpeed * (other.speedY < 0 ? -1 : 1);
        }
      }
    }
  }

  isClicked(px, py) {
    return px > this.x && px < this.x + this.size && py > this.y && py < this.y + this.size;
  }

  display() {
    if (this.img) {
      // Display image centered and scaled to fit box size
      image(this.img, this.x + this.size / 2, this.y + this.size / 2, this.size, this.size);
    } else {
      fill(255, 0, 0);
      noStroke();
      rect(this.x, this.y, this.size, this.size);
    }
  }
}

