import Phaser from "phaser";
import { EntityInstance } from "./EntityInstance";
import { DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP, PROJECTILE_DOWN, PROJECTILE_LEFT, PROJECTILE_RANDOM_ANGLE, PROJECTILE_RANDOM_DIRECTION, PROJECTILE_RIGHT, PROJECTILE_TARGET_CLASS, PROJECTILE_TARGET_PLAYER, PROJECTILE_UP, VEHICLE_CONTROLS } from "../constants";
import store from "../../store";
import { getAngleBetweenInstances } from "../../utils/gameUtils";

const directionToRadians = {
  [DIRECTION_RIGHT]: Phaser.Math.DegToRad(0),
  [DIRECTION_DOWN]: Phaser.Math.DegToRad(90),
  [DIRECTION_LEFT]: Phaser.Math.DegToRad(180),
  [DIRECTION_UP]: Phaser.Math.DegToRad(270),
}

export class ProjectileInstance extends EntityInstance {
  constructor(scene, entityInstanceId, instanceData){
    super(scene, entityInstanceId, instanceData, true)

    const { entityClassId } = instanceData
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]
    if(!entityClass) {
      console.error('no class for id:' + entityClassId)
      return
    }

    if(!entityClass.projectile) {
      console.error('no projectile data in class id:' + entityClassId)
    }

    // scene.temporaryInstanceGroup.add(this.phaserInstance)

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

  fireAutomatic(shooter, time) {
    const shooterClass = store.getState().gameModel.gameModel.entityClasses[shooter.entityClassId]
    const projectileBehavior = shooterClass.projectile.projectileBehavior
    this.lifespan = shooterClass.projectile.lifespan;

    let rotation

    if(projectileBehavior === PROJECTILE_DOWN) {
      rotation = directionToRadians[DIRECTION_DOWN]
    } else if(projectileBehavior === PROJECTILE_UP) {
      rotation = directionToRadians[DIRECTION_UP]
    } else if(projectileBehavior === PROJECTILE_RIGHT) {
      rotation = directionToRadians[DIRECTION_RIGHT]
    } else if(projectileBehavior === PROJECTILE_LEFT) {
      rotation = directionToRadians[DIRECTION_LEFT]
    }

    if(projectileBehavior === PROJECTILE_TARGET_CLASS) {
      const entityInstances = this.scene.getAllEntityInstancesOfClassId(shooterClass.projectile.targetClassId)
      if(entityInstances.length) {
        rotation = getAngleBetweenInstances(shooter, entityInstances[0])
      }
    } else if(projectileBehavior === PROJECTILE_TARGET_PLAYER) {
      if(this.scene.playerInstance) {
        rotation = getAngleBetweenInstances(shooter, this.scene.playerInstance)
      }
    } else if(projectileBehavior === PROJECTILE_RANDOM_DIRECTION) {
      const direction = Math.random() * 4
      if(direction < 1) {
        rotation = directionToRadians[DIRECTION_DOWN]
      } else if(direction < 2) {
        rotation = directionToRadians[DIRECTION_UP]
      } else if(direction < 3) {
         rotation = directionToRadians[DIRECTION_LEFT]
      } else if(direction < 4) {
        rotation = directionToRadians[DIRECTION_RIGHT]
      }
    } else if(projectileBehavior === PROJECTILE_RANDOM_ANGLE) {
      const angle = Math.random() * 360 
      rotation = Phaser.Math.DegToRad(angle)
    }

    this.fire(shooter, shooterClass, rotation)
  }

  // update(time, delta) {
  //   super.update(time, delta) 
  // }

  fire(shooter, shooterClass, rotation) {
    this.setRotation(rotation); // angle is in degree, rotation is in radian
    var offset = new Phaser.Geom.Point(shooter.height, 0);
    Phaser.Math.Rotate(offset, rotation); // you can only rotate with radian
    this.setPosition(shooter.phaserInstance.x + offset.x, shooter.phaserInstance.y + offset.y);    
    this.eject(shooterClass.projectile.speed)

    this.isVisible = true;
    this.setActive(true)

    this.destroyTime = Date.now() + shooterClass.projectile.lifetime
  }

  fireControlled(shooter, time, cursors) {
    const shooterClass = store.getState().gameModel.gameModel.entityClasses[shooter.entityClassId]
    this.lifespan = shooterClass.projectile.lifespan;

    let rotation

    if(shooterClass.movement.movementControlsBehavior === VEHICLE_CONTROLS) {
      rotation = shooter.phaserInstance.rotation - Phaser.Math.DegToRad(90)
    } else {
      if(cursors.left.isDown) {
        rotation = directionToRadians[DIRECTION_LEFT]
        shooter.lastCursor = DIRECTION_LEFT
      } else if(cursors.right.isDown) {
        rotation = directionToRadians[DIRECTION_RIGHT]
        shooter.lastCursor = DIRECTION_RIGHT
      } else if(cursors.up.isDown) {
        rotation = directionToRadians[DIRECTION_UP]
        shooter.lastCursor = DIRECTION_UP
      } else if(cursors.down.isDown) {
        rotation = directionToRadians[DIRECTION_DOWN]
        shooter.lastCursor = DIRECTION_DOWN
      } else if(shooter.lastCursor === DIRECTION_LEFT) {
        rotation = directionToRadians[DIRECTION_LEFT]
      } else if(shooter.lastCursor === DIRECTION_RIGHT) {
        rotation = directionToRadians[DIRECTION_RIGHT]
      } else if(shooter.lastCursor === DIRECTION_UP) {
        rotation = directionToRadians[DIRECTION_UP]
      } else if(shooter.lastCursor === DIRECTION_DOWN) {
        rotation = directionToRadians[DIRECTION_DOWN]
      } else if(shooter.phaserInstance.body.facing === Phaser.Physics.Arcade.FACING_LEFT) {
        rotation = directionToRadians[DIRECTION_LEFT]
      } else if(shooter.phaserInstance.body.facing === Phaser.Physics.Arcade.FACING_RIGHT) {
        rotation = directionToRadians[DIRECTION_RIGHT]
      } else if(shooter.phaserInstance.body.facing === Phaser.Physics.Arcade.FACING_UP) {
        rotation = directionToRadians[DIRECTION_UP]
      } else if(shooter.phaserInstance.body.facing === Phaser.Physics.Arcade.FACING_DOWN) {
        rotation = directionToRadians[DIRECTION_DOWN]
      }
    }

    this.fire(shooter, shooterClass, rotation)
  }

  destroyInGame() {
    const entityInstanceId = this.entityInstanceId
    this.runDestroyEvents()
    // calls .destroy()
    this.scene.removeTemporaryInstance(entityInstanceId)

  }
}
