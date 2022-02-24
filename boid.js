class Boid {
  constructor(position, color) {
    this.mass = random(2, 5);
    this.position = position;
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.r = random(3, 6);
    this.maxspeed = random(4, 6);
    this.maxforce = random(0.4, 0.6);
    this.perception = random(75, 125);
    this.color = color;
  }

  display() {
    const theta = this.velocity.heading() + PI / 2;
    fill(0);
    stroke(this.color[0], this.color[1], this.color[2]);
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

  align(proximBoids) {
    let avg = createVector(0, 0);
    let total = 0;
    for (let boids of proximBoids) {
      avg.add(boids.velocity);
      total++;
    }
    if (total > 0) {
      avg.div(total);
      avg.normalize();
      avg.mult(this.maxspeed);
      //avg.sub(this.velocity);
      let steer = p5.Vector.sub(avg, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
    return avg;
  }

  seperation(proximBoids) {
    let desiredSeperation = 25.0;
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
      avg.mult(this.maxspeed);
      avg.sub(this.velocity);
      avg.limit(this.maxforce);
    }
    return avg;
  }

  cohesion(proximBoids) {
    let avg = createVector(0, 0);
    let total = 0;
    for (let boids of proximBoids) {
      avg.add(boids.position);
      total++;
    }
    if (total > 0) {
      avg.div(total);
      let desired = p5.Vector.sub(avg, this.position);
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(0.01);
      return steer;
    }
    return avg;
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

    seperation.mult(1.5);
    alignment.mult(1.0);
    cohesion.mult(1.0);

    this.applyForce(seperation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }

  edgeForce(x, y) {
    let desired = createVector(x, y);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(0.5);
    this.applyForce(steer);
  }

  edges() {
    if (this.position.x > width - 150) {
      this.edgeForce(-5, this.velocity.y);
    } else if (this.position.x < 150.0) {
      this.edgeForce(5, this.velocity.y);
    }
    if (this.position.y > height - 150.0) {
      this.edgeForce(this.velocity.x, -5);
    } else if (this.position.y < 150.0) {
      this.edgeForce(this.velocity.x, 5);
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
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
  //   return;
  // }
}
