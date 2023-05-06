import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from "../../constants";
import store from "../../../store";
import { getHexIntFromHexString } from "../../../utils/editorUtils";
import { getCobrowsingState } from "../../../utils/cobrowsingUtils";

export class PhaserInstance {
  constructor(scene, { textureId, spriteSheetName, spriteIndex, spawnX, spawnY }){
    const state = store.getState()
    const gameModel = state.gameModel.gameModel
    const stageId = state.gameModel.currentStageId
    const stage = gameModel.stages[stageId]
    
    const plugin = { 
      wrap: {
        min: {
          x: stage.boundaries.x,
          y: stage.boundaries.y
        },
        max: {
          x: stage.boundaries.width,
          y: stage.boundaries.height
        }           
      }
  }

    if(scene.physicsType === ARCADE_PHYSICS) {
      if(!spriteSheetName) {
        this.phaserInstance = scene.physics.add.sprite(spawnX, spawnY, textureId, 0)
      } else {
        this.phaserInstance = scene.physics.add.sprite(spawnX, spawnY, spriteSheetName, spriteIndex)
      }
      // scene.physics.world.enable([ this.phaserInstance ]);
    } else if(scene.physicsType === MATTER_PHYSICS) {
      if(!spriteSheetName) {
        this.phaserInstance = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, textureId, 0, { plugin: stage.boundaries.loop ? plugin : {} })
      } else {
        this.phaserInstance = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex, { plugin: stage.boundaries.loop ? plugin : {} })
      }
    }

    this.phaserInstance.entityInstance = this

    this.physicsType = scene.physicsType

    // scene.physics.add.existing(this);   

    return this
  }

  setActive(active) {
    this.phaserInstance.setActive(active)
  }

  setAngle(angle) {
    this.phaserInstance.setAngle(angle)
  }

  setAlpha(alpha) {
    this.phaserInstance.setAlpha(alpha)
  }

  setAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.phaserInstance.setAcceleration(acceleration)
  }

  setAccelerationX(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.phaserInstance.setAccelerationX(acceleration)
  }

  setAccelerationY(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.phaserInstance.setAccelerationY(acceleration)
  }

  setAngularAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular acc under matter')
      return
    }
    this.phaserInstance.setAngularAcceleration(acceleration)
  }

  enableBody() {
    // if(this.phaserInstance.body) {
      this.phaserInstance.enableBody()
    // }
  }

  disableBody() {
    // if(this.phaserInstance.body) {
      this.phaserInstance.disableBody()
    // }
  }

  setAngularDrag(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular drag under matter')
      return
    }
    this.phaserInstance.setAngularDrag(drag)
  }

  setAngularVelocity(velocity) {
    this.phaserInstance.setAngularVelocity(velocity)
  }

  setBounce(bounciness) {
    this.phaserInstance.setBounce(bounciness)
  }

  setCollideWorldBounds(collide) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.phaserInstance.setCollideWorldBounds(collide)
    }
  }

  setCollideIgnoreSides(sides) {
    if(this.physicsType === MATTER_PHYSICS) {
      return 
    }
    
    this.phaserInstance.body.checkCollision.down = true 
    this.phaserInstance.body.checkCollision.up = true 
    this.phaserInstance.body.checkCollision.left = true 
    this.phaserInstance.body.checkCollision.right = true 

    sides.forEach((side) => {
      if(side === SIDE_LEFT) {
        this.phaserInstance.body.checkCollision.left = false
      }
      if(side === SIDE_RIGHT) {
        this.phaserInstance.body.checkCollision.right = false
      }
      if(side === SIDE_UP) {
        this.phaserInstance.body.checkCollision.up = false
      }
      if(side === SIDE_DOWN) {
        this.phaserInstance.body.checkCollision.down = false
      }
    })
  }

  setCollideable(collideable) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.phaserInstance.body.setEnable(collideable)
      return
    }

    if(collideable) {
      this.phaserInstance.setCollisionCategory(1)
    } else {
      this.phaserInstance.setCollisionCategory(null)
    }
  }

  setCollisionCategory(category) {
    if(this.physicsType !== MATTER_PHYSICS) {
      console.log('setting collision category under not matter')

      return
    }
    this.phaserInstance.setCollisionCategory(category)
  }

  setDepth(depth) {
    this.phaserInstance.setDepth(depth)
  }

  setDensity(density) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting density under arcade')
      return
    }
    this.phaserInstance.setDensity(density)
  }

  setDrag(drag) {
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.phaserInstance.body.useDamping) this.phaserInstance.setDrag(drag)
      else this.phaserInstance.setDrag(drag * 200)
      return
    }
    this.phaserInstance.setFrictionAir(drag)
  }

  setDragY(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting drag Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.phaserInstance.body.useDamping) {
        this.phaserInstance.setDragY(drag === 0 ? 0.00000000001 : drag)
      } else this.phaserInstance.setDragY(drag * 200)
      return
    }
  }

  setDragX(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting dragX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.phaserInstance.body.useDamping) {
        this.phaserInstance.setDragX(drag === 0 ? 0.00000000001 : drag)
      } else this.phaserInstance.setDragX(drag * 200)
      return
    }
  }

  setDamping(damping) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting damping under matter')
      return
    }
    this.phaserInstance.body.setDamping(damping)
  }

  setFriction(friction) {
    this.phaserInstance.setFriction(friction)
  }

  setFixedRotation(isFixed) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.phaserInstance.body.setAllowRotation(!isFixed)
      return
    }
    if(isFixed) this.setFixedRotation()
  }
  
  setFrictionStatic(friction) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting friction static under arcade')
      return
    }
    this.phaserInstance.setFrictionStatic(friction)
  }

  setGravityY(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravity Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.phaserInstance.setGravityY(gravity)
      return
    }
  }

  setGravityX(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravityX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.phaserInstance.setGravityX(gravity)
      return
    }
  }

  setInteractive(value) {
    this.phaserInstance.setInteractive(value)
  }

  setIgnoreGravity(ignore) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.phaserInstance.body.setAllowGravity(!ignore)
      return
    }
    this.phaserInstance.setIgnoreGravity(ignore)
  }

  setImmovable(isStatic) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.phaserInstance.setStatic(isStatic)
      return
    }
    this.phaserInstance.setImmovable(!!isStatic)
  }

  setMass(mass) {
    this.phaserInstance.setMass(mass)
  }

  setOrigin(x, y) {
    this.phaserInstance.setOrigin(x, y)
  }

  setPosition(x, y) {
    this.phaserInstance.setPosition(x, y)
  }

  setRandomPosition(x, y, width, height) {
    this.phaserInstance.setRandomPosition(x, y, width, height)
  }

  setPushable(pushable) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting pushable under matter')
      return
    }
    this.phaserInstance.setPushable(!!pushable)
  }

  setRotation(rotation) {
    this.phaserInstance.setRotation(rotation)
  }

  setSize(width, height) {
    this.phaserInstance.setDisplaySize(width, height)
  }

  setTint(textureTint) {
    const colorInt = getHexIntFromHexString(textureTint)
    this.phaserInstance.setTint(colorInt)
  }

  setVisible(visible) {
    this.phaserInstance.setVisible(visible)
  }

  setVelocity(x, y) {
    this.phaserInstance.setVelocity(x, y)
  }

  setVelocityX(x) {
    this.phaserInstance.setVelocityX(x)
  }

  setVelocityY(y) {
    this.phaserInstance.setVelocityY(y)
  }

  setMaxVelocity(xy) {
    this.phaserInstance.setMaxVelocity(xy)
  }

  thrust(thrust) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.phaserInstance.thrust(thrust)
    } else {
      this.scene.physics.velocityFromRotation(this.phaserInstance.rotation - Phaser.Math.DegToRad(90), thrust, this.phaserInstance.body.acceleration);  
    }
  }

  // adjustVelocityForRotation() {
  //   //Math.abs(this.phaserInstance.body.velocity.x) + Math.abs(this.phaserInstance.body.velocity.y)
  //   const rotationalVelocity = this.scene.physics.velocityFromRotation(this.phaserInstance.rotation - Phaser.Math.DegToRad(90), this.phaserInstance.body.speed); 

  //   // const xVel = (this.phaserInstance.body.velocity.x + rotationalVelocity.x)/2
  //   // const yVel = (this.phaserInstance.body.velocity.y + rotationalVelocity.y)/2
  //   // console.log(this.phaserInstance.body.speed)
  //   this.setPosition(this.phaserInstance.x + (rotationalVelocity.x/10), this.phaserInstance.y + (rotationalVelocity.y/10))
  // }

  eject(force) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('eject via matter')
      this.phaserInstance.thrust(force)
    } else {
      this.scene.physics.velocityFromRotation(this.phaserInstance.rotation, force, this.phaserInstance.body.velocity);  
    }
  }

  destroy() {
    console.log('neing destroyed', this.entityInstanceId)
    this.phaserInstance.destroy()
  }
}