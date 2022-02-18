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
    this.perception = 50;
  }

  display() {
    const theta = this.velocity.heading() + PI / 2;
    fill(0);
    stroke(300);
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

  align(proximBoids) {
    let avg = createVector();
    let total = 0;
    for (let boids of proximBoids) {
      avg.add(boids.velocity);
      total++;
    }
    if (total > 0) {
      avg.div(total);
      avg.setMag(this.maxspeed);
      avg.sub(this.velocity);
      avg.limit(this.maxforce);
    }
    return avg;
  }

  seperation(proximBoids) {
    let desiredSeperation = 100.0;
    let avg = createVector();
    let total = 0;
    for (let boids of proximBoids) {
      if (boids.distance < desiredSeperation) {
        let diff = p5.Vector.sub(this.position, boids.position);
        diff.normalize();
        diff.div(boids.distance); //inversley proportional to distance. aka the closer it is the higher the magnitude
        avg.add(diff);
        total++;
      }
    }
    if (total > 0) {
      avg.div(total);
      avg.normalize();
      avg.setMag(this.maxspeed);
      avg.sub(this.velocity);
      avg.limit(this.maxforce);
    }
    return avg;
  }

  cohesion(proximBoids) {
    let avg = createVector();
    let total = 0;
    for (let boids of proximBoids) {
      avg.add(boids.position);
      total++;
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

  avoid(target) {
    const desired = p5.Vector.sub(this.position, target);
    const distance = desired.mag();
    if (distance < this.perception) {
      desired.normalize();
      desired.mult(this.maxspeed);
      this.applyForce(desired);
    }
  }

  getProximBoids(qtree) {
    let proximBoids = [];
    let range = new Circle(
      this.position.x,
      this.position.y,
      this.perception * 2
    );
    let points = qtree.query(range);
    for (let point of points) {
      let other = point.userData;
      let d;
      if (other != this) {
        d = dist(
          this.position.x,
          this.position.y,
          other.position.x,
          other.position.y
        );
        if (d < this.perception) {
          proximBoids.push({
            mass: other.mass,
            position: other.position,
            velocity: other.velocity,
            acceleration: other.acceleration,
            r: other.r,
            maxspeed: other.maxspeed,
            maxforce: other.maxforce,
            perception: other.perception,
            distance: d,
          });
        }
      }
    }
    return proximBoids;
  }

  flock(qtree) {
    let proximBoids = this.getProximBoids(qtree);
    let alignment = this.align(proximBoids);
    let cohesion = this.cohesion(proximBoids);
    let seperation = this.seperation(proximBoids);
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

  // seek(target) {
  //   const desired = p5.Vector.sub(target, this.position);
  //   const distance = desired.mag();
  //   if (distance < this.perception) {
  //     desired.normalize();
  //     //if boid is closer than 100 pixels to target
  //     if (distance < 100) {
  //       //set the magnitude to how close we are to target
  //       const m = map(distance, 0, 100, 0, this.maxspeed);
  //       desired.mult(m);
  //     } else {
  //       desired.mult(this.maxspeed);
  //     }
  //     const steer = p5.Vector.sub(desired, this.velocity);
  //     steer.limit(this.maxforce);
  //     this.applyForce(steer);
  //   } else {
  //     //deccelerate
  //     //this.velocity.mult(new p5.Vector(0.9, 0.9));
  //   }
  //   return
  // }
}
