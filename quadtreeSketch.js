let qt;

function setup() {
  createCanvas(400, 400);

  let boundary = new Rectangle(200, 200, 200, 200);
  qt = new QuadTree(boundary, 4);

  for (let i = 0; i < 50; i++) {
    let p = new Point(random(width), random(height));
    qt.insert(p);
  }
  //   background(0);
  //   qt.show();
}

function draw() {
  if (mouseIsPressed) {
    m = new Point(mouseX, mouseY);
    qt.insert(m);
  }
  background(0);
  qt.show();

  stroke(0, 255, 0);
  rectMode(CENTER);
  let range = new Rectangle(250, 250, 107, 75);
  rect(range.x, range.y, range.w * 2, range.h * 2);
  let points = [];
  qt.query(range, points);
  console.log(points);
  for (let p of points) {
    strokeWeight(4);
    point(p.x, p.y);
  }
}
