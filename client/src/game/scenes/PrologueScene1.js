import Phaser from 'phaser';

import {
  PROLOGUE_SCENE_1
} from '../../constants';

export class PrologueScene1 extends Phaser.Scene {
  constructor(props) {
    super({
      key: PROLOGUE_SCENE_1,
    });
  }

  create() {
    var particles = this.add.particles('blue');

    this.ship = this.matter.add.image(400, 300, 'ship');

    this.ship.setFrictionAir(0.1);
    this.ship.setMass(30);
    this.ship.setFixedRotation();

    var emitter = particles.createEmitter({
        speed: {
            onEmit: function (particle, key, t, value)
            {
                return this.ship.body.speed * 10;
            }
        },
        lifespan: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(this.ship.body.speed, 0, 300) * 40000;
            }
        },
        alpha: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(this.ship.body.speed, 0, 300) * 1000;
            }
        },
        scale: { start: 1.0, end: 0 },
        blendMode: 'ADD'
    });

    emitter.startFollow(this.ship);

    this.matter.world.setBounds(0, 0, 800, 600);

    this.cursors = this.input.keyboard.createCursorKeys();
  }
  
  update() {
    if (this.cursors.left.isDown)
    {
        this.ship.setAngularVelocity(-0.1);
    }
    else if (this.cursors.right.isDown)
    {
        this.ship.setAngularVelocity(0.1);
    }

    if (this.cursors.up.isDown)
    {
        this.ship.thrust(0.08);
    }
  }

  destroy() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}