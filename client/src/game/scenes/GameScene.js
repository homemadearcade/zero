import Phaser from 'phaser';

import {
  GAME_SCENE,
  PRELOADER_SCENE,
} from '../../constants';

export class GameScene extends Phaser.Scene {
  constructor(props) {
    super({
      key: GAME_SCENE,
    });
  }

  create() {
        // Install the plugin
    this.plugins.installScenePlugin(
      'WeaponPlugin',
      WeaponPlugin.WeaponPlugin,
      'weapons',
      this
    );

    this.game.scene.remove(PRELOADER_SCENE);

    //  Creates 30 bullets, using the 'bullet' graphic
    this.weapon = this.add.weapon(30, "bullet");
    //  Alternatively:
    //  this.weapon = this.make.weapon({bulletLimit: 30, key: 'bullet'});

    // Enable physics debugging for the bullets
    this.weapon.debugPhysics = true;

    //  The bullet will be automatically killed when it leaves the world bounds
    // this.weapon.bulletKillType = WeaponPlugin.consts.KillType.KILL_WORLD_BOUNDS;
    this.weapon.bulletLifespan = 500;

    //  The speed at which the bullet is fired
    this.weapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    this.weapon.fireRate = 100;

    this.sprite = this.add.sprite(400, 300, "ship");

    this.physics.add.existing(this.sprite);

    this.sprite.body.setDrag(70);
    this.sprite.body.maxVelocity.set(200);

    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    this.weapon.trackSprite(this.sprite, 0, 0, true);

    this.cursors = this.input.keyboard.createCursorKeys();
  }
  
  update() {
    if (this.cursors.up.isDown) {
      this.sprite.body.acceleration.setToPolar(this.sprite.rotation, 300);
    } else {
      this.sprite.body.acceleration.set(0);
    }

    if (this.cursors.left.isDown) {
      this.sprite.body.angularVelocity = -300;
    } else if (this.cursors.right.isDown) {
      this.sprite.body.angularVelocity = 300;
    } else {
      this.sprite.body.angularVelocity = 0;
    }

    if (this.cursors.space.isDown) {
      console.log("weapon fire");
      this.weapon.fire();
    }

    this.physics.world.wrap(this.sprite, 16);
  }

  destroy() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}