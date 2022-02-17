const flock = [];

function setup() {
  createCanvas(displayWidth, displayHeight);
  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  background(240);
  for (let boid of flock) {
    //boid.seek(createVector(mouseX, mouseY));

    boid.flock(flock);
    boid.avoid(createVector(mouseX, mouseY));
    boid.update();
    boid.display();
    boid.edges();
  }
}
