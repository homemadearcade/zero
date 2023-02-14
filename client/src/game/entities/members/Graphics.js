import store from "../../../store"
import { getCobrowsingState } from "../../../utils/cobrowsingUtils"
import { getHexIntFromHexString } from "../../../utils/editorUtils"
import { getLayerIdFromClass } from "../../../utils/gameUtils"
import { getThemePrimaryColor } from "../../../utils/webPageUtils"

export class Graphics {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.scene = scene

    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[objectInstance.classId]
    const sprite = this.objectInstance.sprite

    if(objectClass.graphics.tint) objectInstance.setTint(objectClass.graphics.tint)
    objectInstance.isVisible = !objectClass.graphics.invisible
    sprite.setDisplaySize(objectClass.graphics.width, objectClass.graphics.height)
    this.setSize(objectClass.graphics.width, objectClass.graphics.height)
    scene.addSpriteToTypeLayer(objectInstance.classId, sprite)
    // scene.addSpriteToTypeGroup(objectInstance.classId, sprite)

    if(objectClass.graphics.glowing) {
      this.setGlowing()
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
      sprite.editorHighlight.setTintFill(getThemePrimaryColor().hexCode)
      .setDisplaySize(this.objectInstance.width + 10, this.objectInstance.height + 10)
      .setVisible(false)
      scene.addSpriteToTypeLayer(objectInstance.classId, sprite.editorHighlight, -1)
    }
    if(objectClass.graphics.invisible && this.scene.isEditor) {
      this.createInvisiblilityIndicator()
      this.setInvisible()
    }

    this.createInteractBorder()
  }

  setInvisible() {
    this.objectInstance.isVisible = true
    this.objectInstance.setAlpha(0.1)
  }

  setGlowing() {
    if(this.sprite.glowTask) return
    const sprite = this.sprite
    var pipeline = this.scene.plugins.get('rexglowfilterpipelineplugin').add(sprite);
    sprite.glowTask = sprite.scene.tweens.add({
      targets: pipeline,
      intensity: 0.05,
      ease: 'Linear',
      duration: 500,
      repeat: -1,
      yoyo: true
    });
  }

  clearGlowing() {
    if(!this.sprite.glowTask) return 
    this.sprite.glowTask.destroy()
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
    sprite.interactBorder.lineStyle(4, getThemePrimaryColor().hexCode, 1);
    sprite.interactBorder.strokeRect(cornerX, cornerY, width, height);
    sprite.interactBorder.setVisible(false)
    this.scene.uiLayer.add(sprite.interactBorder)
  }

  createInvisiblilityIndicator() {
    const sprite = this.objectInstance.sprite

    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.objectInstance.classId]

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
    this.scene.addSpriteToTypeLayer(this.objectInstance.classId, sprite.invisibleIndicator)
  }

  update() {
    const sprite = this.objectInstance.sprite

    if(sprite.invisibleIndicator) {
      if(this.scene.isPlaythrough) {
        sprite.invisibleIndicator.setVisible(false)
        this.objectInstance.isVisible = false
      } else {
        sprite.invisibleIndicator.setPosition(sprite.x, sprite.y)
        sprite.invisibleIndicator.setRotation(sprite.rotation)
        sprite.invisibleIndicator.setVisible(true)
        this.setInvisible()
      }
    }

    const classIdHovering = store.getState().gameViewEditor.classIdHovering
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.objectInstance.classId]
    const gameViewEditor = getCobrowsingState().gameViewEditor
    const layerVisibility = gameViewEditor.layerVisibility
    const isLayerVisible = layerVisibility[getLayerIdFromClass(objectClass)]
    if(!isLayerVisible) {
      this.objectInstance.setVisible(false)
    } else {
      this.objectInstance.setVisible(this.objectInstance.isVisible)
    }

    sprite.interactBorder.setPosition(sprite.x, sprite.y)
    sprite.interactBorder.setRotation(sprite.rotation)

    if(sprite.editorHighlight) {
      sprite.editorHighlight.setPosition(sprite.x, sprite.y)
      sprite.editorHighlight.setRotation(sprite.rotation)
      if(this.objectInstance.classId === classIdHovering || sprite.isHoveringOver) {
        sprite.editorHighlight.setVisible(true)
      } else {
        sprite.editorHighlight.setVisible(false)
      }
    }
  }

  destroy() {
    const sprite = this.objectInstance.sprite

    if(sprite.invisibleIndicator) sprite.invisibleIndicator.destroy()
    if(sprite.editorHighlight) sprite.editorHighlight.destroy()
    sprite.interactBorder.destroy()
  }
}