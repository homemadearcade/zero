import Phaser from "phaser";
import { VEHICLE_CONTROLS } from "../constants";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";

export class ProjectileInstance extends ObjectInstance {
  constructor(scene, id, instanceData){
    super(scene, id, instanceData)

    const { classId } = instanceData
    const objectClass = store.getState().gameModel.gameModel.classes[classId]
    if(!objectClass) {
      console.error('no class for id:' + classId)
      return
    }

    if(!objectClass.projectile) {
      console.error('no projectile data in class id:' + classId)
    }

    scene.projectileInstanceGroup.add(this.sprite)

    this.scene = scene
    
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

  fire(shooter, time, cursors) {
    const shooterClass = store.getState().gameModel.gameModel.classes[shooter.classId]
    this.lifespan = shooterClass.projectile.lifespan;

    let rotation

    if(shooterClass.movement.controls === VEHICLE_CONTROLS) {
      rotation = shooter.sprite.rotation - Phaser.Math.DegToRad(90)
    } else {
      if(cursors.left.isDown) {
        rotation = Phaser.Math.DegToRad(180)
        shooter.lastCursor = 'left'
      } else if(cursors.right.isDown) {
        rotation = Phaser.Math.DegToRad(0)
        shooter.lastCursor = 'right'
      } else if(cursors.up.isDown) {
        rotation = Phaser.Math.DegToRad(270)
        shooter.lastCursor = 'up'
      } else if(cursors.down.isDown) {
        rotation = Phaser.Math.DegToRad(90)
        shooter.lastCursor = 'down'
      } else if(shooter.lastCursor === 'left') {
        rotation = Phaser.Math.DegToRad(180)
      } else if(shooter.lastCursor === 'right') {
        rotation = Phaser.Math.DegToRad(0)
      } else if(shooter.lastCursor === 'up') {
        rotation = Phaser.Math.DegToRad(270)
      } else if(shooter.lastCursor === 'down') {
        rotation = Phaser.Math.DegToRad(90)
      } else if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_LEFT) {
        rotation = Phaser.Math.DegToRad(180)
      } else if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_RIGHT) {
        rotation = Phaser.Math.DegToRad(0)
      } else if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_UP) {
        rotation = Phaser.Math.DegToRad(270)
      } else if(shooter.sprite.body.facing === Phaser.Physics.Arcade.FACING_DOWN) {
        rotation = Phaser.Math.DegToRad(90)
      }
    }

    this.setRotation(rotation); // angle is in degree, rotation is in radian
    var offset = new Phaser.Geom.Point(shooter.height, 0);
    Phaser.Math.Rotate(offset, rotation); // you can only rotate with radian
    this.setPosition(shooter.sprite.x + offset.x, shooter.sprite.y + offset.y);    
    this.eject(shooterClass.projectile.speed)

    this.setVisible(true);
    this.setActive(true)

    this.sprite.destroyTime = time + shooterClass.projectile.lifetime
  }
}
