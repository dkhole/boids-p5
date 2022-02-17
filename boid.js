class Boid {
  constructor() {
    this.mass = 1;
    this.position = createVector(random(width / 2), random(height / 2));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.r = 6.0;
    this.maxspeed = 4;
    this.maxforce = 0.2;
    this.perception = 100;
  }

  display() {
    const theta = this.velocity.heading() + PI / 2;
    fill(175);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let avg = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < this.perception) {
        avg.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      avg.div(total);
      avg.setMag(this.maxspeed);
      avg.sub(this.velocity);
      avg.limit(this.maxforce);
    }
    return avg;
  }

  seperation(boids) {
    let avg = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < this.perception) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d); //inversley proportional to distance. aka the closer it is the higher the magnitude
        avg.add(diff);
        total++;
      }
    }
    if (total > 0) {
      avg.div(total);
      avg.setMag(this.maxspeed);
      avg.sub(this.velocity);
      avg.limit(this.maxforce);
    }
    return avg;
  }

  cohesion(boids) {
    let avg = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < this.perception) {
        avg.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      avg.div(total);
      avg.sub(this.position);
      avg.setMag(this.maxspeed);
      avg.sub(this.velocity);
      avg.limit(this.maxforce);
    }
    return avg;
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

  avoid(target) {
    const desired = p5.Vector.sub(this.position, target);
    const distance = desired.mag();
    if (distance < this.perception) {
      desired.normalize();
      desired.mult(this.maxspeed);
      this.applyForce(desired);
    } else {
      //deccelerate
      //this.velocity.mult(new p5.Vector(0.9, 0.9));
    }
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let seperation = this.seperation(boids);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(seperation);
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
