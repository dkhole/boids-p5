var w = window.innerWidth;
var h = window.innerHeight;

const flock = [];
let qt;

function setup() {
  createCanvas(w, h);
  for (let i = 0; i < 100; i++) {
    flock.push(new Boid([random(255), random(255), random(255)]));
  }
}

function draw() {
  background(0);

  let boundary = new Rectangle(w / 2, h / 2, w, h);
  qtree = new QuadTree(boundary, 4);
  //put all boids into a bintree
  //sort boids into buckets depending on position

  for (let boid of flock) {
    //boid.seek(createVector(mouseX, mouseY));
    let point = new Point(boid.position.x, boid.position.y, boid);
    qtree.insert(point);
    //qtree.show();
    boid.flock(qtree);
    boid.avoid(createVector(mouseX, mouseY));
    boid.update();
    boid.edges();
    boid.display();
  }
}

window.onresize = function () {
  // assigns new values for width and height variables
  w = window.innerWidth;
  h = window.innerHeight;
  resizeCanvas(w, h);
};
