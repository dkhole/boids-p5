const flock = [];

function setup() {
  createCanvas(displayWidth, displayHeight);
  flock.push(new Boid());
}

function draw() {
  background(240);
  for (let boid of flock) {
    boid.seek(createVector(mouseX, mouseY));
    boid.update();
    boid.display();
  }
}
