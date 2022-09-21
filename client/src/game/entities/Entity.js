import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS } from "../../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";

export class Entity {
  constructor(scene, { textureId, spriteSheetName, spriteIndex, spawnX, spawnY }, { useEditor }){
    const gameModel = store.getState().game.gameModel
    
    const plugin = { 
      wrap: {
        min: {
          x: gameModel.world.boundaries.x,
          y: gameModel.world.boundaries.y
        },
        max: {
          x: gameModel.world.boundaries.width,
          y: gameModel.world.boundaries.height
        }            
      }
    }

    if(!spriteSheetName) {
      this.sprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, textureId, 0, { plugin: gameModel.world.boundaries.loop ? plugin : {} })
      if(useEditor) this.sprite.highlight = scene.add.image(spawnX, spawnY, textureId)
    } else {
      this.sprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex, { plugin: gameModel.world.boundaries.loop ? plugin : {} })
      if(useEditor) this.sprite.highlight = scene.add.image(spawnX, spawnY, spriteSheetName, spriteIndex)
    }
    
    // this.scene.matter.add.rectangle(spawnX, spawnY, objectClass.width, objectClass.height, { restitution: 0.9, plugin });

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // EDITOR
    if(useEditor) {
      this.sprite.setInteractive();
      scene.input.setDraggable(this.sprite)
      scene.uiLayer.add(this.sprite.highlight)
    }

    this.physicsType = scene.physicsType

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

  setCollideable(collideable) {
    if(this.physicsType !== MATTER_PHYSICS) {
      console.log('setting collideable under not matter')

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

  setDensity(density) {
    if(this.physicsType === ARCADE_PHYSICS) {
      console.log('setting density under arcade')
      return
    }
    this.sprite.setDensity(density)
  }

  setDrag(friction) {
    this.sprite.setFrictionAir(friction)
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
    this.sprite.setImmovable(isStatic)
  }

  setMass(mass) {
    this.sprite.setMass(mass)
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y)
  }

  setPushable(pushable) {
    if(this.physicsType === MATTER_PHYSICS) {
      console.log('setting pushable under matter')
      return
    }
    this.sprite.setPushable(pushable)
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

  thrust(thrust) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.sprite.thrust(thrust)
    } else {
      this.sprite.body.acceleration.setToPolar(this.sprite.rotation, thrust);
    }
  }

  destroy() {
    this.sprite.destroy()
  }
}