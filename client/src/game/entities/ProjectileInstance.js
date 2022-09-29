import Phaser from "phaser";
import { SPACESHIP_CONTROLS } from "../../constants";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";

export class ProjectileInstance extends ObjectInstance {
  constructor(scene, id, instanceData){
    super(scene, id, instanceData)

    const { classId } = instanceData
    const objectClass = store.getState().game.gameModel.classes[classId]
    if(!objectClass) {
      console.error('no class for id:' + classId)
      return
    }

    if(!objectClass.projectile) {
      console.error('no projectile data in class id:' + classId)
    }

    scene.objectInstanceLayer.add(this)
    scene.projectileInstanceGroup.add(this)

    this.scene = scene
    
    this.fireRate = objectClass.projectile.fireRate

    // const world = this.scene.matter.world
    // this.scene.matterCollision.addOnCollideStart({
    //   objectA: this,
    //   callback: eventData => {
    //     const { bodyB } = eventData;
    //     if(bodyB === world.walls.right || bodyB === world.walls.left || bodyB === world.walls.top || bodyB === world.walls.bottom) {
    //       this.destroy()
    //     }
    //   }
    // });

    return this
  }

  fire(shooter) {
    const objectClass = store.getState().game.gameModel.classes[this.classId]
    this.lifespan = objectClass.projectile.lifespan;

    let rotation

    if(objectClass.controls.type === SPACESHIP_CONTROLS) {
      rotation = shooter.rotation
    } else {
      if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_LEFT) {
        rotation = 270
      } else if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_RIGHT) {
        rotation = 90
      } else if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_UP) {
        rotation = 0
      } else if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_DOWN) {
        rotation = 180
      }
    }

    this.setRotation(rotation); // angle is in degree, rotation is in radian
    var offset = new Phaser.Geom.Point(shooter.height, 0);
    Phaser.Math.Rotate(offset, rotation); // you can only rotate with radian
    this.setPosition(shooter.x + offset.x, shooter.y + offset.y);    
    this.thrust(objectClass.projectile.velocity)

    this.setVisible(true);
    this.setActive(true)

    this.destroyTime = this.scene.game.loop.time + this.lifespan
  }
}
