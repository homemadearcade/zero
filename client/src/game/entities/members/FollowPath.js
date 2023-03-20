// Based on this: https://phaser.discourse.group/t/riding-moving-platforms/7330/6

class Follower extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, path, x, y, image) {
    super(scene, x, y, image);
    scene.add.existing(this);
    scene.physics.add.existing(this);   
    this.scene = scene;
    this.path = path;
    this.pathOffset = new Phaser.Math.Vector2();
    this.rotateToPath = false;
    this.pathRotationOffset = 0; // this value is added to the rotation value. 
    this.target = null;
    this.speed = 100;
    this.epsilon = 4; // if too small, fast moving sprites will fly off the path to nowhere
    this.repeat = false;
    this.yoyo = false;
    this.t = 0;
    this.steps = 100; // 100 is arbitrary number of divisions
    this.t_step = 1 / this.steps;
    this.status = Follower.Status.Stopped;
  }
  
  static Status = {
    Stopped: 1,
    Forward: 2,
    Backward: 3
  }
  
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.status !== Follower.Status.Stopped) {
      this.pathUpdate();
    }
  }

  setSpeed(speed) {
    this.speed = speed;
  }
  
  updateMotion() {
    this.target = this.path.getPoint(this.t).add(this.pathOffset);
    if (this.rotateToPath) {
      this.setRotation(this.path.getTangent(this.t).angle()+this.pathRotationOffset);
    }
    this.scene.physics.moveTo(this, this.target.x, this.target.y, this.speed);
  }

  setPath(path, steps = 100) {
    this.steps = steps; // number of steps to break a path into 
    this.path = path; 
  }
  
  setAtBeginingOfPath() {
    this.t = 0;
    this.status = Follower.Status.Forward;
    this.target = this.path.getStartPoint();
    this.body.reset(this.target.x, this.target.y);
  }
  
  startFollow(config) {
    if (config === undefined) { config = {}};
    this.steps = config.steps === undefined ? this.steps : config.steps;
    this.repeat = config.repeat === undefined ? this.repeat : config.repeat;
    this.yoyo = config.yoyo === undefined ? this.yoyo : config.yoyo;
    this.speed = config.speed === undefined ? this.speed : config.speed;
    this.t_step = 1 / this.steps;
    this.rotateToPath = config.rotateToPath === undefined ? this.rotateToPath : config.rotateToPath;
    this.pathOffset = this.getCenter().subtract(this.path.getStartPoint());
    this.target = this.path.getPoint(this.t).add(this.pathOffset);
    this.status = Follower.Status.Forward;
  }
   
  stopFollow() {
    this.status = Follower.Status.Stopped;
    this.body.stop();
  }
  
  setRotateToPath(value, offset) {
    if (offset === undefined) { offset = 0; }
    this.rotateToPath = value;
    this.pathRotationOffset = offset;
    return this;  
  };
  
  pathUpdate() {      
    switch (this.status) {
      case Follower.Status.Forward:
        if (this.body.center.fuzzyEquals(this.target, this.epsilon)) {
          if (this.t >=1) {
            if (this.yoyo) {
              this.t = 1;
              this.status = Follower.Status.Backward;
            } else {
              this.checkRepeat();
            }    
          } else {
            this.t = Math.min(this.t + this.t_step, 1);
            this.updateMotion();
          }
        }
        break;
      case Follower.Status.Backward:
        if (this.body.center.fuzzyEquals(this.target, this.epsilon)) {
          if (this.t <=0) {            
            this.checkRepeat();
          } else {
            this.t = Math.max(this.t - this.t_step, 0);
            this.updateMotion();
          }
          break;
        }
    }
  }
 
  checkRepeat() {
    if (!this.repeat) {
      this.stopFollow();
    } else {
      this.t = 0;
      this.status = Follower.Status.Forward;
      this.target = this.path.getStartPoint();
    }
  }
  
}

class Dude extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'dude');
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(20, 32).setOffset(6,16);
    this.setCollideWorldBounds(true);
    this.locked = false;
    this.lockedTo = null;
    
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  } 

  handleInput() {
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-160)
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(160)
    } else {
      this.body.setVelocityX(0)
    }

    if ((this.cursors.up.isDown && this.body.touching.down) || (this.cursors.up.isDown && this.locked)) {
      this.body.setVelocityY(-330);
      this.locked = false;
      this.lockedTo = null;
      this.body.setAllowGravity(true);
    }
  }
}