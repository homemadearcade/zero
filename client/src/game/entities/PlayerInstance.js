import Phaser from "phaser";

import { ObjectInstance } from "./ObjectInstance";

export class PlayerInstance extends ObjectInstance {
  constructor(scene, id, instanceData){
    super(scene, id, instanceData)

    var particles = scene.add.particles('blue');

    var emitter = particles.createEmitter({
      speed: {
        onEmit: (particle, key, t, value) =>
        {
          return this.body.speed * 10;
        }
      },
      lifespan: {
        onEmit: (particle, key, t, value) =>
        {
          return Phaser.Math.Percent(this.body.speed, 0, 300) * 40000;
        }
      },
      alpha: {
        onEmit: (particle, key, t, value) =>
        {
          return Phaser.Math.Percent(this.body.speed, 0, 300) * 1000;
        }
      },
      scale: { start: 1.0, end: 0 },
      blendMode: 'ADD'
    });

    emitter.startFollow(this);

    this.cursors = scene.input.keyboard.createCursorKeys();

    scene.playerInstanceLayer.add(this)
    scene.playerInstanceGroup.add(this)

    return this
  }

  update() {  
    super.update()

    if(this.scene.paused) return

    if (this.cursors.left.isDown)
    {
        this.setAngularVelocity(-0.1);
    }
    else if (this.cursors.right.isDown)
    {
        this.setAngularVelocity(0.1);
    }

    if (this.cursors.up.isDown)
    {
        this.thrust(0.08);
    }
  }
}
