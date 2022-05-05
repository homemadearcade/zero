import Phaser from "phaser";

import { CoreObject } from "./CoreObject";

export class PlayerObject extends CoreObject {
  constructor(scene, spriteTexture, x, y){
    super(scene, spriteTexture, x, y)

    var particles = scene.add.particles('blue');
    particles.setDepth(this.depth - 1)

    this.setFrictionAir(0.1);
    this.setMass(30);
    this.setFixedRotation();

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

    return this
  }

  preUpdate() {  
    super.preUpdate()

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
