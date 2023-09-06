import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from "../../constants";
import store from "../../../store";
import { getHexIntFromHexString } from "../../../utils/editorUtils";
import { getCobrowsingState } from "../../../utils/cobrowsingUtils";

export class MatterSprite {
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
        this.matterSprite = scene.physics.add.sprite(spawnX, spawnY, textureId, 0)
      } else {
        this.matterSprite = scene.physics.add.sprite(spawnX, spawnY, spriteSheetName, spriteIndex)
      }
      // scene.physics.world.enable([ this.matterSprite ]);
    } else if(scene.physicsType === MATTER_PHYSICS) {
      if(!spriteSheetName) {
        this.matterSprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, textureId, 0, { plugin: stage.boundaries.loop ? plugin : {} })
      } else {
        this.matterSprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex, { plugin: stage.boundaries.loop ? plugin : {} })
      }
    }

    this.matterSprite.entityInstance = this

    this.physicsType = scene.physicsType

    // scene.physics.add.existing(this);   

    this.matterSprite.body.entityInstance = this

    return this
  }

  setActive(active) {
    this.matterSprite.setActive(active)
  }

  setAngle(angle) {
    this.matterSprite.setAngle(angle)
  }

  setAlpha(alpha) {
    this.matterSprite.setAlpha(alpha)
  }

  setAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.matterSprite.setAcceleration(acceleration)
  }

  setAccelerationX(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.matterSprite.setAccelerationX(acceleration)
  }

  setAccelerationY(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.matterSprite.setAccelerationY(acceleration)
  }

  setAngularAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular acc under matter')
      return
    }
    this.matterSprite.setAngularAcceleration(acceleration)
  }

  enableBody() {
    // if(this.matterSprite.body) {
      this.matterSprite.enableBody()
    // }
  }

  disableBody() {
    // if(this.matterSprite.body) {
      this.matterSprite.disableBody()
    // }
  }

  setAngularDrag(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular drag under matter')
      return
    }
    this.matterSprite.setAngularDrag(drag)
  }

  setAngularVelocity(velocity) {
    this.matterSprite.setAngularVelocity(velocity)
  }

  setBounce(bounciness) {
    this.matterSprite.setBounce(bounciness)
  }

  setCollideWorldBounds(collide) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.matterSprite.setCollideWorldBounds(collide)
    }
  }

  setCollideIgnoreSides(sides) {
    if(this.physicsType === MATTER_PHYSICS) {
      return 
    }
    
    this.matterSprite.body.checkCollision.down = true 
    this.matterSprite.body.checkCollision.up = true 
    this.matterSprite.body.checkCollision.left = true 
    this.matterSprite.body.checkCollision.right = true 

    sides.forEach((side) => {
      if(side === SIDE_LEFT) {
        this.matterSprite.body.checkCollision.left = false
      }
      if(side === SIDE_RIGHT) {
        this.matterSprite.body.checkCollision.right = false
      }
      if(side === SIDE_UP) {
        this.matterSprite.body.checkCollision.up = false
      }
      if(side === SIDE_DOWN) {
        this.matterSprite.body.checkCollision.down = false
      }
    })
  }

  setCollideable(collideable) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.matterSprite.body.setEnable(collideable)
      return
    }

    if(collideable) {
      this.matterSprite.setCollisionCategory(1)
    } else {
      this.matterSprite.setCollisionCategory(null)
    }
  }

  setCollisionCategory(category) {
    if(this.physicsType !== MATTER_PHYSICS) {
      console.log('setting collision category under not matter')

      return
    }
    this.matterSprite.setCollisionCategory(category)
  }

  setDepth(depth) {
    this.matterSprite.setDepth(depth)
  }

  setDensity(density) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting density under arcade')
      return
    }
    this.matterSprite.setDensity(density)
  }

  setDrag(drag) {
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.matterSprite.body.useDamping) this.matterSprite.setDrag(drag)
      else this.matterSprite.setDrag(drag * 200)
      return
    }
    this.matterSprite.setFrictionAir(drag)
  }

  setDragY(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting drag Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.matterSprite.body.useDamping) {
        this.matterSprite.setDragY(drag === 0 ? 0.00000000001 : drag)
      } else this.matterSprite.setDragY(drag * 200)
      return
    }
  }

  setDragX(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting dragX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.matterSprite.body.useDamping) {
        this.matterSprite.setDragX(drag === 0 ? 0.00000000001 : drag)
      } else this.matterSprite.setDragX(drag * 200)
      return
    }
  }

  setDamping(damping) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting damping under matter')
      return
    }
    this.matterSprite.body.setDamping(damping)
  }

  setFriction(friction) {
    this.matterSprite.setFriction(friction)
  }

  setFixedRotation(isFixed) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.matterSprite.body.setAllowRotation(!isFixed)
      return
    }
    if(isFixed) this.setFixedRotation()
  }
  
  setFrictionStatic(friction) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting friction static under arcade')
      return
    }
    this.matterSprite.setFrictionStatic(friction)
  }

  setGravityY(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravity Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.matterSprite.setGravityY(gravity)
      return
    }
  }

  setGravityX(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravityX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.matterSprite.setGravityX(gravity)
      return
    }
  }

  setInteractive(value) {
    this.matterSprite.setInteractive(value)
  }

  setIgnoreGravity(ignore) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.matterSprite.body.setAllowGravity(!ignore)
      return
    }
    this.matterSprite.setIgnoreGravity(ignore)
  }

  setImmovable(isStatic) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.matterSprite.setStatic(isStatic)
      return
    }
    this.matterSprite.setImmovable(!!isStatic)
  }

  setMass(mass) {
    this.matterSprite.setMass(mass)
  }

  setOrigin(x, y) {
    this.matterSprite.setOrigin(x, y)
  }

  setPosition(x, y) {
    this.matterSprite.setPosition(x, y)
  }

  setRandomPosition(x, y, width, height) {
    this.matterSprite.setRandomPosition(x, y, width, height)
  }

  setPushable(pushable) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting pushable under matter')
      return
    }
    this.matterSprite.setPushable(!!pushable)
  }

  setRotation(rotation) {
    this.matterSprite.setRotation(rotation)
  }

  setSize(width, height) {
    this.matterSprite.setDisplaySize(width, height)
  }

  setTint(textureTint) {
    const colorInt = getHexIntFromHexString(textureTint)
    this.matterSprite.setTint(colorInt)
  }

  setVisible(visible) {
    this.matterSprite.setVisible(visible)
  }

  setVelocity(x, y) {
    this.matterSprite.setVelocity(x, y)
  }

  setVelocityX(x) {
    this.matterSprite.setVelocityX(x)
  }

  setVelocityY(y) {
    this.matterSprite.setVelocityY(y)
  }

  setMaxVelocity(xy) {
    this.matterSprite.setMaxVelocity(xy)
  }

  thrust(thrust) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.matterSprite.thrust(thrust)
    } else {
      this.scene.physics.velocityFromRotation(this.matterSprite.rotation - Phaser.Math.DegToRad(90), thrust, this.matterSprite.body.acceleration);  
    }
  }

  // adjustVelocityForRotation() {
  //   //Math.abs(this.matterSprite.body.velocity.x) + Math.abs(this.matterSprite.body.velocity.y)
  //   const rotationalVelocity = this.scene.physics.velocityFromRotation(this.matterSprite.rotation - Phaser.Math.DegToRad(90), this.matterSprite.body.speed); 

  //   // const xVel = (this.matterSprite.body.velocity.x + rotationalVelocity.x)/2
  //   // const yVel = (this.matterSprite.body.velocity.y + rotationalVelocity.y)/2
  //   // console.log(this.matterSprite.body.speed)
  //   this.setPosition(this.matterSprite.x + (rotationalVelocity.x/10), this.matterSprite.y + (rotationalVelocity.y/10))
  // }

  eject(force) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('eject via matter')
      this.matterSprite.thrust(force)
    } else {
      this.scene.physics.velocityFromRotation(this.matterSprite.rotation, force, this.matterSprite.body.velocity);  
    }
  }

  destroy() {
    // console.log('neing destroyed', this.entityInstanceId)
    this.matterSprite.destroy()
  }
}