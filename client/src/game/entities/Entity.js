import Phaser from "phaser";
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
      if(useEditor) this.sprite.outline = scene.add.image(spawnX, spawnY, textureId)
    } else {
      this.sprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex, { plugin: gameModel.world.boundaries.loop ? plugin : {} })
      if(useEditor) this.sprite.outline = scene.add.image(spawnX, spawnY, spriteSheetName, spriteIndex)
    }
    
    // this.scene.matter.add.rectangle(spawnX, spawnY, objectClass.width, objectClass.height, { restitution: 0.9, plugin });

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // EDITOR
    if(useEditor) {
      this.sprite.setInteractive();
      scene.input.setDraggable(this.sprite)
      scene.uiLayer.add(this.sprite.outline)
    }

    return this
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y)
  }

  setTint(tint) {
    const colorInt = getHexIntFromHexString(tint)
    this.sprite.setTint(colorInt)
  }

  setSize(width, height) {
    this.sprite.setDisplaySize(width, height)
  }

  setBounce(bounciness) {
    this.sprite.setBounce(bounciness)
  }

  setFriction(friction) {
    this.sprite.setFriction(friction)
  }

  setFrictionAir(friction) {
    this.sprite.setFrictionAir(friction)
  }

  setFrictionStatic(friction) {
    this.sprite.setFrictionStatic(friction)
  }

  setMass(mass) {
    this.sprite.setMass(mass)
  }

  setDensity(density) {
    this.sprite.setDensity(density)
  }

  setFixedRotation(isFixed) {
    if(isFixed) this.setFixedRotation()
  } 

  setIgnoreGravity(ignore) {
    this.sprite.setIgnoreGravity(ignore)
  }

  setStatic(isStatic) {
    this.sprite.setStatic(isStatic)
  }

  setActive(active) {
    this.sprite.setActive(active)
  }

  setAngle(angle) {
    this.sprite.setAngle(angle)
  }

  setRotation(rotation) {
    this.sprite.setRotation(rotation)
  }

  setVisible(visible) {
    this.sprite.setVisible(visible)
  }

  setCollisionCategory(category) {
    this.sprite.setCollisionCategory(category)
  }

  setAngularVelocity(velocity) {
    this.sprite.setAngularVelocity(velocity)
  }

  setVelocity(x, y) {
    this.sprite.setVelocity(x, y)
  }

  thrust(thrust) {
    this.sprite.thrust(thrust)
  }

  destroy() {
    this.sprite.destroy()
  }
}