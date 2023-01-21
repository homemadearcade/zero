import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from "../../constants";
import store from "../../../store";
import { getHexIntFromHexString } from "../../../utils/editorUtils";
import { getCobrowsingState } from "../../../utils/cobrowsingUtils";

export class Sprite {
  constructor(scene, { textureId, spriteSheetName, spriteIndex, spawnX, spawnY }){
    const state = store.getState()
    const gameModel = state.gameModel.gameModel
    const stageId = getCobrowsingState().gameContext.currentStageId
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
        this.sprite = scene.physics.add.sprite(spawnX, spawnY, textureId, 0)
      } else {
        this.sprite = scene.physics.add.sprite(spawnX, spawnY, spriteSheetName, spriteIndex)
      }
      // scene.physics.world.enable([ this.sprite ]);
    } else if(scene.physicsType === MATTER_PHYSICS) {
      if(!spriteSheetName) {
        this.sprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, textureId, 0, { plugin: stage.boundaries.loop ? plugin : {} })
      } else {
        this.sprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex, { plugin: stage.boundaries.loop ? plugin : {} })
      }
    }

    this.physicsType = scene.physicsType

    // scene.physics.add.existing(this);   

    return this
  }

  setActive(active) {
    this.sprite.setActive(active)
  }

  setAngle(angle) {
    this.sprite.setAngle(angle)
  }

  setAlpha(alpha) {
    this.sprite.setAlpha(alpha)
  }

  setAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.sprite.setAcceleration(acceleration)
  }

  setAccelerationX(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.sprite.setAccelerationX(acceleration)
  }

  setAccelerationY(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting acc under matter')
      return
    }
    this.sprite.setAccelerationY(acceleration)
  }

  setAngularAcceleration(acceleration) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular acc under matter')
      return
    }
    this.sprite.setAngularAcceleration(acceleration)
  }

  setAngularDrag(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting angular drag under matter')
      return
    }
    this.sprite.setAngularDrag(drag)
  }

  setAngularVelocity(velocity) {
    this.sprite.setAngularVelocity(velocity)
  }

  setBounce(bounciness) {
    this.sprite.setBounce(bounciness)
  }

  setCollideWorldBounds(collide) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.sprite.setCollideWorldBounds(collide)
    }
  }

  setCollideIgnoreSides(sides) {
    if(this.physicsType === MATTER_PHYSICS) {
      return 
    }
    
    this.sprite.body.checkCollision.down = true 
    this.sprite.body.checkCollision.up = true 
    this.sprite.body.checkCollision.left = true 
    this.sprite.body.checkCollision.right = true 

    sides.forEach((side) => {
      if(side === SIDE_LEFT) {
        this.sprite.body.checkCollision.left = false
      }
      if(side === SIDE_RIGHT) {
        this.sprite.body.checkCollision.right = false
      }
      if(side === SIDE_UP) {
        this.sprite.body.checkCollision.up = false
      }
      if(side === SIDE_DOWN) {
        this.sprite.body.checkCollision.down = false
      }
    })
  }

  setCollideable(collideable) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.sprite.body.setEnable(collideable)
      return
    }

    if(collideable) {
      this.sprite.setCollisionCategory(1)
    } else {
      this.sprite.setCollisionCategory(null)
    }
  }

  setCollisionCategory(category) {
    if(this.physicsType !== MATTER_PHYSICS) {
      console.log('setting collision category under not matter')

      return
    }
    this.sprite.setCollisionCategory(category)
  }

  setDepth(depth) {
    this.sprite.setDepth(depth)
  }

  setDensity(density) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting density under arcade')
      return
    }
    this.sprite.setDensity(density)
  }

  setDrag(drag) {
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.sprite.body.useDamping) this.sprite.setDrag(drag)
      else this.sprite.setDrag(drag * 200)
      return
    }
    this.sprite.setFrictionAir(drag)
  }

  setDragY(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting drag Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.sprite.body.useDamping) {
        this.sprite.setDragY(drag === 0 ? 0.00000000001 : drag)
      } else this.sprite.setDragY(drag * 200)
      return
    }
  }

  setDragX(drag) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting dragX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      if(this.sprite.body.useDamping) {
        this.sprite.setDragX(drag === 0 ? 0.00000000001 : drag)
      } else this.sprite.setDragX(drag * 200)
      return
    }
  }

  setDamping(damping) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting damping under matter')
      return
    }
    this.sprite.body.setDamping(damping)
  }

  setFriction(friction) {
    this.sprite.setFriction(friction)
  }

  setFixedRotation(isFixed) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.sprite.body.setAllowRotation(!isFixed)
      return
    }
    if(isFixed) this.setFixedRotation()
  }
  
  setFrictionStatic(friction) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting friction static under arcade')
      return
    }
    this.sprite.setFrictionStatic(friction)
  }

  setGravityY(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravity Y under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.sprite.setGravityY(gravity)
      return
    }
  }

  setGravityX(gravity) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting gravityX under matter')
      return
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.sprite.setGravityX(gravity)
      return
    }
  }

  setIgnoreGravity(ignore) {
    if(this.physicsType === ARCADE_PHYSICS) {
      this.sprite.body.setAllowGravity(!ignore)
      return
    }
    this.sprite.setIgnoreGravity(ignore)
  }

  setImmovable(isStatic) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.sprite.setStatic(isStatic)
      return
    }
    this.sprite.setImmovable(!!isStatic)
  }

  setMass(mass) {
    this.sprite.setMass(mass)
  }

  setOrigin(x, y) {
    this.sprite.setOrigin(x, y)
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y)
  }

  setRandomPosition(x, y, width, height) {
    this.sprite.setRandomPosition(x, y, width, height)
  }

  setPushable(pushable) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting pushable under matter')
      return
    }
    this.sprite.setPushable(!!pushable)
  }

  setRotation(rotation) {
    this.sprite.setRotation(rotation)
  }

  setSize(width, height) {
    this.sprite.setDisplaySize(width, height)
  }

  setTint(tint) {
    const colorInt = getHexIntFromHexString(tint)
    this.sprite.setTint(colorInt)
  }

  setVisible(visible) {
    this.sprite.setVisible(visible)
  }

  setVelocity(x, y) {
    this.sprite.setVelocity(x, y)
  }

  setVelocityX(x) {
    this.sprite.setVelocityX(x)
  }

  setVelocityY(y) {
    this.sprite.setVelocityY(y)
  }

  setMaxVelocity(xy) {
    this.sprite.setMaxVelocity(xy)
  }

  thrust(thrust) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.sprite.thrust(thrust)
    } else {
      this.scene.physics.velocityFromRotation(this.sprite.rotation - Phaser.Math.DegToRad(90), thrust, this.sprite.body.acceleration);  
    }
  }

  // adjustVelocityForRotation() {
  //   //Math.abs(this.sprite.body.velocity.x) + Math.abs(this.sprite.body.velocity.y)
  //   const rotationalVelocity = this.scene.physics.velocityFromRotation(this.sprite.rotation - Phaser.Math.DegToRad(90), this.sprite.body.speed); 

  //   // const xVel = (this.sprite.body.velocity.x + rotationalVelocity.x)/2
  //   // const yVel = (this.sprite.body.velocity.y + rotationalVelocity.y)/2
  //   // console.log(this.sprite.body.speed)
  //   this.setPosition(this.sprite.x + (rotationalVelocity.x/10), this.sprite.y + (rotationalVelocity.y/10))
  // }

  eject(force) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('eject via matter')
      this.sprite.thrust(force)
    } else {
      this.scene.physics.velocityFromRotation(this.sprite.rotation, force, this.sprite.body.velocity);  
    }
  }

  destroy() {
    this.sprite.destroy()
  }
}