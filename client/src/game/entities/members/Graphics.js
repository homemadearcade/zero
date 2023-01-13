import store from "../../../store"
import { getHexIntFromHexString } from "../../../utils/editorUtils"

export class Graphics {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.scene = scene

    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[objectInstance.classId]
    const sprite = this.objectInstance.sprite

    if(objectClass.graphics.tint) objectInstance.setTint(objectClass.graphics.tint)
    objectInstance.setVisible(!objectClass.graphics.invisible)
    sprite.setDisplaySize(objectClass.graphics.width, objectClass.graphics.height)
    this.setSize(objectClass.graphics.width, objectClass.graphics.height)
    objectInstance.addToTypeLayer(sprite)
    objectInstance.addToTypeGroup(sprite)

    if(objectClass.graphics.glowing) {
      var pipeline = scene.plugins.get('rexglowfilterpipelineplugin').add(sprite);
      sprite.glowTask = sprite.scene.tweens.add({
        targets: pipeline,
        intensity: 0.05,
        ease: 'Linear',
        duration: 500,
        repeat: -1,
        yoyo: true
      });
    }

    // EDITOR
    if(!objectInstance.effectSpawned && this.scene.isEditor) {
      sprite.setInteractive();
      scene.input.setDraggable(sprite)
      if(!sprite.frame.name) {
        sprite.editorHighlight = scene.add.image(sprite.x,sprite.y, sprite.texture.key)
      } else {
        sprite.editorHighlight = scene.add.image(sprite.x,sprite.y, sprite.texture.key, sprite.frame.name)
      }
      sprite.editorHighlight.setTintFill(0xffffff)
      .setDisplaySize(this.objectInstance.width + 10, this.objectInstance.height + 10)
      .setVisible(false)
      objectInstance.addToTypeLayer(sprite.editorHighlight, -1)
    }
    if(objectClass.graphics.invisible && this.scene.isEditor) {
      objectInstance.setVisible(true) 
      objectInstance.setAlpha(0.1)
      objectInstance.createInvisiblilityIndicator()
    }

    this.createInteractBorder()
  }

  setSize(w, h) {
    const sprite = this.objectInstance.sprite
    const classId = this.objectInstance.classId

    if(sprite.editorHighlight) {
      sprite.editorHighlight.setDisplaySize(w + 10, h + 10)
    }

    if(this.scene.isEditor) {
      const gameModel = store.getState().gameModel.gameModel
      const objectClass = gameModel.classes[classId]
      if(objectClass.graphics.invisible) {
        this.createInvisiblilityIndicator()
      }
    }

    this.createInteractBorder()
  }

  createInteractBorder() {
    const sprite = this.objectInstance.sprite

    if(sprite.interactBorder) sprite.interactBorder.destroy()
    const width = sprite.displayWidth
    const height = sprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    sprite.interactBorder = this.scene.add.graphics();
    sprite.interactBorder.lineStyle(4, 0xffffff, 1);
    sprite.interactBorder.strokeRect(cornerX, cornerY, width, height);
    sprite.interactBorder.setVisible(false)
    this.scene.uiLayer.add(sprite.interactBorder)
  }

  createInvisiblilityIndicator() {
    const sprite = this.objectInstance.sprite

    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]

    if(sprite.invisibleIndicator) sprite.invisibleIndicator.destroy()
    const width = sprite.displayWidth
    const height = sprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    sprite.invisibleIndicator = this.scene.add.graphics();
    const colorInt = getHexIntFromHexString(objectClass.graphics.tint || '#FFFFFF')
    sprite.invisibleIndicator.lineStyle(4, colorInt, 1);
    sprite.invisibleIndicator.setAlpha(0.5)
    sprite.invisibleIndicator.strokeRect(cornerX + 2, cornerY + 2, width - 4, height - 4);
    this.addToTypeLayer(sprite.invisibleIndicator)
  }

  update() {
    const sprite = this.objectInstance.sprite

    if(sprite.invisibleIndicator) {
      sprite.invisibleIndicator.setPosition(sprite.x, sprite.y)
      sprite.invisibleIndicator.setRotation(sprite.rotation)
    }

    sprite.interactBorder.setPosition(sprite.x, sprite.y)
    sprite.interactBorder.setRotation(sprite.rotation)

    if(sprite.editorHighlight) {
      sprite.editorHighlight.setPosition(sprite.x, sprite.y)
      sprite.editorHighlight.setRotation(sprite.rotation)
    }
  }

  destroy() {
    const sprite = this.objectInstance.sprite

    if(sprite.invisibleIndicator) sprite.invisibleIndicator.destroy()
    // if(sprite.unspawnedImage) sprite.unspawnedImage.destroy()
    sprite.editorHighlight.destroy()
    sprite.interactBorder.destroy()
  }
}