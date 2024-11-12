let boxes = [];
let numBoxes = 5;
let boxSize = 100;
let minSpeed = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numBoxes; i++) {
    boxes.push(new Box(random(width - boxSize), random(height - boxSize), boxSize));
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Box {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = random(-minSpeed, minSpeed);
    this.speedY = random(-minSpeed, minSpeed);
    this.color = color(255, random(100, 255), random(100, 255));
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

        // Check if boxes are colliding
        if (distance < this.size) {
          // Calculate angle of collision
          let angle = atan2(dy, dx);

          // Separate boxes to prevent overlap
          let targetX = this.x + cos(angle) * this.size;
          let targetY = this.y + sin(angle) * this.size;
          let ax = (targetX - other.x) * 0.5;
          let ay = (targetY - other.y) * 0.5;

          this.x -= ax;
          this.y -= ay;
          other.x += ax;
          other.y += ay;

          // Swap velocities for a simple bounce effect
          let tempSpeedX = this.speedX;
          let tempSpeedY = this.speedY;
          this.speedX = other.speedX;
          this.speedY = other.speedY;
          other.speedX = tempSpeedX;
          other.speedY = tempSpeedY;

          // Ensure minimum speed after bounce
          if (abs(this.speedX) < minSpeed) this.speedX = minSpeed * (this.speedX < 0 ? -1 : 1);
          if (abs(this.speedY) < minSpeed) this.speedY = minSpeed * (this.speedY < 0 ? -1 : 1);
          if (abs(other.speedX) < minSpeed) other.speedX = minSpeed * (other.speedX < 0 ? -1 : 1);
          if (abs(other.speedY) < minSpeed) other.speedY = minSpeed * (other.speedY < 0 ? -1 : 1);
        }
      }
    }
  }

  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}
