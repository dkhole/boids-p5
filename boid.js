class Boid {
  constructor() {
    this.mass = 1;
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = 6.0;
    this.maxspeed = 4;
    this.maxforce = 0.1;
    this.perception = 500;
  }

  display() {
    const theta = this.velocity.heading() + PI / 2;
    fill(175);
    stroke(0);
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass); //a=f/m
    this.acceleration.add(f);
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.position);
    const distance = desired.mag();
    if (distance < this.perception) {
      desired.normalize();
      //if boid is closer than 100 pixels to target
      if (distance < 100) {
        //set the magnitude to how close we are to target
        const m = map(distance, 0, 100, 0, this.maxspeed);
        desired.mult(m);
      } else {
        desired.mult(this.maxspeed);
      }
      const steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    } else {
      //deccelerate
      this.velocity.mult(new p5.Vector(0.9, 0.9));
    }
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.acceleration.add(this.velocity);
    //clear acceleration each frame
    this.acceleration.mult(0);
  }
}
