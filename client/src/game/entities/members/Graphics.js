import store from "../../../store"
import { getCobrowsingState } from "../../../utils/cobrowsingUtils"
import { getHexIntFromHexString } from "../../../utils/editorUtils"
import { getThemePrimaryColor } from "../../../utils/webPageUtils"

export class Graphics {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene

    const gameModel = store.getState().gameModel.gameModel
    const entityClass = gameModel.entityClasses[entityInstance.entityClassId]
    const phaserInstance = this.entityInstance.phaserInstance

    if(entityClass.graphics.textureTint) entityInstance.setTint(entityClass.graphics.textureTint)
    entityInstance.isVisible = !entityClass.graphics.invisible
    phaserInstance.setDisplaySize(entityClass.graphics.width, entityClass.graphics.height)
    this.setSize(entityClass.graphics.width, entityClass.graphics.height)
    scene.addSpriteToTypeLayer(entityInstance.entityClassId, phaserInstance)
    // scene.addSpriteToTypeGroup(entityInstance.entityClassId, phaserInstance)

    if(entityClass.graphics.glowing) {
      this.setGlowing()
    }

    // EDITOR
    //!entityInstance.effectSpawned &&
    if(this.scene.isEditor) {
      phaserInstance.setInteractive();
      scene.input.setDraggable(phaserInstance)
      if(!phaserInstance.frame.name) {
        phaserInstance.editorHighlight = scene.add.image(phaserInstance.x,phaserInstance.y, phaserInstance.texture.key)
      } else {
        phaserInstance.editorHighlight = scene.add.image(phaserInstance.x,phaserInstance.y, phaserInstance.texture.key, phaserInstance.frame.name)
      }
      phaserInstance.editorHighlight.setTintFill(getThemePrimaryColor().hexCode)
      .setDisplaySize(this.entityInstance.width + 10, this.entityInstance.height + 10)
      .setVisible(false)
      scene.addSpriteToTypeLayer(entityInstance.entityClassId, phaserInstance.editorHighlight, -1)
    }
    if(entityClass.graphics.invisible && this.scene.isEditor) {
      this.createInvisiblilityIndicator()
      this.setInvisible()
    }

    this.createInteractBorder()
  }

  setInvisible() {
    this.entityInstance.isVisible = true
    this.entityInstance.setAlpha(0.1)
  }

  setGlowing() {
    if(this.phaserInstance.glowTask) return
    const phaserInstance = this.phaserInstance
    var pipeline = this.scene.plugins.get('rexglowfilterpipelineplugin').add(phaserInstance);
    phaserInstance.glowTask = phaserInstance.scene.tweens.add({
      targets: pipeline,
      intensity: 0.05,
      ease: 'Linear',
      duration: 500,
      repeat: -1,
      yoyo: true
    });
  }

  clearGlowing() {
    if(!this.phaserInstance.glowTask) return 
    this.phaserInstance.glowTask.destroy()
  }

  setSize(w, h) {
    const phaserInstance = this.entityInstance.phaserInstance
    const entityClassId = this.entityInstance.entityClassId

    if(phaserInstance.editorHighlight) {
      phaserInstance.editorHighlight.setDisplaySize(w + 10, h + 10)
    }

    if(this.scene.isEditor) {
      const gameModel = store.getState().gameModel.gameModel
      const entityClass = gameModel.entityClasses[entityClassId]
      if(entityClass.graphics.invisible) {
        this.createInvisiblilityIndicator()
      }
    }

    this.createInteractBorder()
  }

  createInteractBorder() {
    const phaserInstance = this.entityInstance.phaserInstance

    if(phaserInstance.interactBorder) phaserInstance.interactBorder.destroy()
    const width = phaserInstance.displayWidth
    const height = phaserInstance.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    phaserInstance.interactBorder = this.scene.add.graphics();
    phaserInstance.interactBorder.lineStyle(4, getThemePrimaryColor().hexCode, 1);
    phaserInstance.interactBorder.strokeRect(cornerX, cornerY, width, height);
    phaserInstance.interactBorder.setVisible(false)
    this.scene.uiLayer.add(phaserInstance.interactBorder)
  }

  createInvisiblilityIndicator() {
    const phaserInstance = this.entityInstance.phaserInstance

    const gameModel = store.getState().gameModel.gameModel
    const entityClass = gameModel.entityClasses[this.entityInstance.entityClassId]

    if(phaserInstance.invisibleIndicator) phaserInstance.invisibleIndicator.destroy()
    const width = phaserInstance.displayWidth
    const height = phaserInstance.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    phaserInstance.invisibleIndicator = this.scene.add.graphics();
    const colorInt = getHexIntFromHexString(entityClass.graphics.textureTint || '#FFFFFF')
    phaserInstance.invisibleIndicator.lineStyle(4, colorInt, 1);
    phaserInstance.invisibleIndicator.setAlpha(0.5)
    phaserInstance.invisibleIndicator.strokeRect(cornerX + 2, cornerY + 2, width - 4, height - 4);
    this.scene.addSpriteToTypeLayer(this.entityInstance.entityClassId, phaserInstance.invisibleIndicator, 2)
  }

  update() {
    const phaserInstance = this.entityInstance.phaserInstance

    const entityClassIdHovering = store.getState().gameViewEditor.entityClassIdHovering
    const gameModel = store.getState().gameModel.gameModel
    const entityClass = gameModel.entityClasses[this.entityInstance.entityClassId]
    const gameViewEditor = getCobrowsingState().gameViewEditor
    const layerInvisibility = gameViewEditor.layerInvisibility
    const isLayerInvisible = layerInvisibility[entityClass.classInterfaceCategory]
    if(isLayerInvisible) {
      this.entityInstance.setVisible(false)
    } else {
      this.entityInstance.setVisible(this.entityInstance.isVisible)
    }

    if(phaserInstance.invisibleIndicator) {
      if(this.scene.isPlaythrough) {
        phaserInstance.invisibleIndicator.setVisible(false)
        this.entityInstance.isVisible = false
      } else {
        phaserInstance.invisibleIndicator.setPosition(phaserInstance.x, phaserInstance.y)
        phaserInstance.invisibleIndicator.setRotation(phaserInstance.rotation)
        phaserInstance.invisibleIndicator.setVisible(!isLayerInvisible)
        this.setInvisible()
      }
    }

    phaserInstance.interactBorder.setPosition(phaserInstance.x, phaserInstance.y)
    phaserInstance.interactBorder.setRotation(phaserInstance.rotation)

    if(phaserInstance.editorHighlight) {
      phaserInstance.editorHighlight.setPosition(phaserInstance.x, phaserInstance.y)
      phaserInstance.editorHighlight.setRotation(phaserInstance.rotation)
      if(this.entityInstance.entityClassId === entityClassIdHovering || phaserInstance.isHoveringOver) {
        phaserInstance.editorHighlight.setVisible(true)
      } else {
        phaserInstance.editorHighlight.setVisible(false)
      }
    }
  }

  destroy() {
    const phaserInstance = this.entityInstance.phaserInstance

    if(phaserInstance.invisibleIndicator) phaserInstance.invisibleIndicator.destroy()
    if(phaserInstance.editorHighlight) phaserInstance.editorHighlight.destroy()
    phaserInstance.interactBorder.destroy()
  }
}