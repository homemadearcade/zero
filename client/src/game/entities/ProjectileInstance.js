import Phaser from "phaser";
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

    if(!objectClass.bulletData) {
      console.error('no projectile data in class id:' + classId)
    }

    scene.objectInstanceLayer.add(this)
    scene.projectileInstanceGroup.add(this)

    this.scene = scene

    this.setVisible(false)

    const world = this.scene.matter.world
   
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: eventData => {
        const { bodyB } = eventData;
        if(bodyB === world.walls.right || bodyB === world.walls.left || bodyB === world.walls.top || bodyB === world.walls.bottom) {
          this.destroy()
        }
      }
    });

    return this
  }

  fire(shooter) {
    this.lifespan = 2000;

    this.setActive(true);
    this.setVisible(true);
    this.setRotation(shooter.rotation); // angle is in degree, rotation is in radian
    var offset = new Phaser.Geom.Point(shooter.height, 0);
    Phaser.Math.Rotate(offset, shooter.rotation); // you can only rotate with radian
    this.setPosition(shooter.x + offset.x, shooter.y + offset.y);    
    this.thrust(10)

    this.destroyTime = this.scene.game.loop.time + this.lifespan
  }
}
