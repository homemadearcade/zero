import Phaser from "phaser";
import { ARCADE_PHYSICS, DIRECTIONAL_CONTROLS, MATTER_PHYSICS, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from "../../constants";
import store from "../../../store";
import { getHexIntFromHexString } from "../../../utils/editorUtils";
import { getCobrowsingState } from "../../../utils/cobrowsingUtils";

export class PhysicsSprite {
  constructor(scene, { textureId, spriteSheetName, spriteIndex, spawnX, spawnY }){
    // const state = store.getState()
    // const gameModel = state.gameModel.gameModel
  //   const stageId = state.gameRoomInstance.gameRoomInstance.currentStageId
  //   const stage = gameModel.stages[stageId]
    
  //   const plugin = { 
  //     wrap: {
  //       min: {
  //         x: stage.boundaries.x,
  //         y: stage.boundaries.y
  //       },
  //       max: {
  //         x: stage.boundaries.width,
  //         y: stage.boundaries.height
  //       }           
  //     }
  // }

    if(scene.physicsType === ARCADE_PHYSICS) {
      if(!spriteSheetName) {
        this.physicsSprite = scene.physics.add.sprite(spawnX, spawnY, textureId, 0)
      } else {
        this.physicsSprite = scene.physics.add.sprite(spawnX, spawnY, spriteSheetName, spriteIndex)
      }
      // scene.physics.world.enable([ this.physicsSprite ]);
    } 
    
    // else
    // if(scene.physicsType === MATTER_PHYSICS) {
    //   if(!spriteSheetName) {
    //     this.physicsSprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, textureId, 0, { plugin: stage.boundaries.loop ? plugin : {} })
    //   } else {
    //     this.physicsSprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex, { plugin: stage.boundaries.loop ? plugin : {} })
    //   }
    // }

    this.physicsSprite.entityInstance = this

    this.physicsType = scene.physicsType

    // scene.physics.add.existing(this);   

    this.physicsSprite.body.entityInstance = this

    return this
  }

  setActive(active) {
    this.physicsSprite.setActive(active)
  }

  setAngle(angle) {
    this.physicsSprite.setAngle(angle)
  }

  setAlpha(alpha) {
    this.physicsSprite.setAlpha(alpha)
  }

  setMaxSpeed(speed) {
    this.physicsSprite.body.setMaxSpeed(speed)
  }

  setAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.physicsSprite.setAcceleration(acceleration)
  }

  setAccelerationX(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.physicsSprite.setAccelerationX(acceleration)
  }

  setAccelerationY(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.physicsSprite.setAccelerationY(acceleration)
  }

  setAngularAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular acc under matter')
      return
    }
    this.physicsSprite.setAngularAcceleration(acceleration)
  }

  enableBody() {
    // if(this.physicsSprite.body) {
      this.physicsSprite.enableBody()
    // }
  }

  disableBody() {
    // if(this.physicsSprite.body) {
      this.physicsSprite.disableBody()
    // }
  }

  setAngularDrag(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular drag under matter')
      return
    }
    this.physicsSprite.setAngularDrag(drag)
  }

  setAngularVelocity(velocity) {
    this.physicsSprite.setAngularVelocity(velocity)
  }

  setBounce(bounciness) {
    this.physicsSprite.setBounce(bounciness)
  }

  setCollideWorldBounds(collide) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physicsSprite.setCollideWorldBounds(collide)
    }
  }

  setCollideIgnoreSides(sides) {
    if(this.physicsType === MATTER_PHYSICS) {
      return 
    }
    
    this.physicsSprite.body.checkCollision.down = true 
    this.physicsSprite.body.checkCollision.up = true 
    this.physicsSprite.body.checkCollision.left = true 
    this.physicsSprite.body.checkCollision.right = true 

    sides.forEach((side) => {
      if(side === SIDE_LEFT) {
        this.physicsSprite.body.checkCollision.left = false
      }
      if(side === SIDE_RIGHT) {
        this.physicsSprite.body.checkCollision.right = false
      }
      if(side === SIDE_UP) {
        this.physicsSprite.body.checkCollision.up = false
      }
      if(side === SIDE_DOWN) {
        this.physicsSprite.body.checkCollision.down = false
      }
    })
  }

  setCollideable(collideable) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physicsSprite.body.setEnable(collideable)
      return
    }

    if(collideable) {
      this.physicsSprite.setCollisionCategory(1)
    } else {
      this.physicsSprite.setCollisionCategory(null)
    }
  }

  setCollisionCategory(category) {
    if(this.physicsType !== MATTER_PHYSICS) {
      console.log('setting collision category under not matter')

      return
    }
    this.physicsSprite.setCollisionCategory(category)
  }

  setDepth(depth) {
    this.physicsSprite.setDepth(depth)
  }

  setDensity(density) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting density under arcade')
      return
    }
    this.physicsSprite.setDensity(density)
  }

  setDrag(drag) {
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.physicsSprite.body.useDamping) this.physicsSprite.setDrag(drag)
      else this.physicsSprite.setDrag(drag * 200)
      return
    }
    this.physicsSprite.setFrictionAir(drag)
  }

  setDragY(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting drag Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.physicsSprite.body.useDamping) {
        this.physicsSprite.setDragY(drag === 0 ? 0.00000000001 : drag)
      } else this.physicsSprite.setDragY(drag * 200)
      return
    }
  }

  setDragX(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting dragX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.physicsSprite.body.useDamping) {
        this.physicsSprite.setDragX(drag === 0 ? 0.00000000001 : drag)
      } else this.physicsSprite.setDragX(drag * 200)
      return
    }
  }

  setDamping(damping) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting damping under matter')
      return
    }
    this.physicsSprite.body.setDamping(damping)
  }

  setFriction(friction) {
    this.physicsSprite.setFriction(friction)
  }

  setFixedRotation(isFixed) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physicsSprite.body.setAllowRotation(!isFixed)
      return
    }
    if(isFixed) this.setFixedRotation()
  }
  
  setFrictionStatic(friction) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting friction static under arcade')
      return
    }
    this.physicsSprite.setFrictionStatic(friction)
  }

  setGravityY(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravity Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physicsSprite.setGravityY(gravity)
      return
    }
  }

  setGravityX(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravityX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physicsSprite.setGravityX(gravity)
      return
    }
  }

  setInteractive(value) {
    this.physicsSprite.setInteractive(value)
  }

  setIgnoreGravity(ignore) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physicsSprite.body.setAllowGravity(!ignore)
      return
    }
    this.physicsSprite.setIgnoreGravity(ignore)
  }

  setImmovable(isStatic) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.physicsSprite.setStatic(isStatic)
      return
    }
    this.physicsSprite.setImmovable(!!isStatic)
  }

  setMass(mass) {
    this.physicsSprite.setMass(mass)
  }

  setOrigin(x, y) {
    this.physicsSprite.setOrigin(x, y)
  }

  setPosition(x, y) {
    this.physicsSprite.setPosition(x, y)
  }

  setRandomPosition(x, y, width, height) {
    this.physicsSprite.setRandomPosition(x, y, width, height)
  }

  setPushable(pushable) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting pushable under matter')
      return
    }
    this.physicsSprite.setPushable(!!pushable)
  }

  setRotation(rotation) {
    this.physicsSprite.setRotation(rotation)
  }

  setSize(width, height) {
    this.physicsSprite.setDisplaySize(width, height)
  }

  setTint(textureTint) {
    const colorInt = getHexIntFromHexString(textureTint)
    this.physicsSprite.setTint(colorInt)
  }

  setVisible(visible) {
    this.physicsSprite.setVisible(visible)
  }

  setVelocity(x, y) {
    const entityModel = this.scene.getGameModel().entityModels[this.physicsSprite.entityInstance.entityModelId]
    if(entityModel.movement.movementControlsBehavior === DIRECTIONAL_CONTROLS) {
      this.proposedVelocityX = x;
      this.proposedVelocityY = y;
    } else {
      this.physicsSprite.setVelocity(x, y)
    }
  }

  setVelocityX(x) {
    const entityModel = this.scene.getGameModel().entityModels[this.physicsSprite.entityInstance.entityModelId]    
    if(entityModel.movement.movementControlsBehavior === DIRECTIONAL_CONTROLS) {
      this.proposedVelocityX = x;
    } else {
      this.physicsSprite.setVelocityX(x)
    }
  }

  setVelocityY(y) {
    const entityModel = this.scene.getGameModel().entityModels[this.physicsSprite.entityInstance.entityModelId]
    if(entityModel.movement.movementControlsBehavior === DIRECTIONAL_CONTROLS) {
      this.proposedVelocityY = y;
    } else {
      this.physicsSprite.setVelocityY(y)
    }
  }

  setMaxVelocity(xy) {
    this.physicsSprite.setMaxVelocity(xy)
  }

  thrust(thrust) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.physicsSprite.thrust(thrust)
    } else {
      this.scene.physics.velocityFromRotation(this.physicsSprite.rotation - Phaser.Math.DegToRad(90), thrust, this.physicsSprite.body.acceleration);  
    }
  }

  // adjustVelocityForRotation() {
  //   //Math.abs(this.physicsSprite.body.velocity.x) + Math.abs(this.physicsSprite.body.velocity.y)
  //   const rotationalVelocity = this.scene.physics.velocityFromRotation(this.physicsSprite.rotation - Phaser.Math.DegToRad(90), this.physicsSprite.body.speed); 

  //   // const xVel = (this.physicsSprite.body.velocity.x + rotationalVelocity.x)/2
  //   // const yVel = (this.physicsSprite.body.velocity.y + rotationalVelocity.y)/2
  //   // console.log(this.physicsSprite.body.speed)
  //   this.setPosition(this.physicsSprite.x + (rotationalVelocity.x/10), this.physicsSprite.y + (rotationalVelocity.y/10))
  // }

  eject(force) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('eject via matter')
      this.physicsSprite.thrust(force)
    } else {
      this.scene.physics.velocityFromRotation(this.physicsSprite.rotation, force, this.physicsSprite.body.velocity);  
    }
  }

  destroy() {
    // console.log('neing destroyed', this.entityInstanceId)
    this.physicsSprite.destroy()
  }
}