import store from "../../../store"
import { getCobrowsingState } from "../../../utils/cobrowsingUtils"
import { getHexIntFromHexString } from "../../../utils/editorUtils"
import { getThemePrimaryColor } from "../../../utils/webPageUtils"
import { editorHighlightDepthModifier, initialStageZoneEntityId, invisibleIndicatorDepthModifer } from "../../constants"


export class Graphics {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene

    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[entityInstance.entityModelId]
    const phaserInstance = this.entityInstance.phaserInstance

    if(entityModel.entityModelId === initialStageZoneEntityId) {
      const boundaries = this.scene.getCurrentStage().boundaries
      this.entityInstance.setPosition(boundaries.x, boundaries.y)
      this.setSize(boundaries.width, boundaries.height)
      phaserInstance.setDisplaySize(boundaries.width, boundaries.height)
      entityModel.graphics.width = boundaries.width 
      entityModel.graphics.height = boundaries.height
    }

    entityInstance.isVisible = !entityModel.graphics.invisible
    phaserInstance.setDisplaySize(entityModel.graphics.width, entityModel.graphics.height)
    this.setSize(entityModel.graphics.width, entityModel.graphics.height)

    if(entityModel.editorInterface.notSelectableInStage) return

    if(entityModel.graphics.textureTint) entityInstance.setTint(entityModel.graphics.textureTint)
    this.setDepth()
    // scene.addSpriteToTypeGroup(entityInstance.entityModelId, phaserInstance)

    if(entityModel.graphics.glowing) {
      this.setGlowing()
    }

    // EDITOR
    //!entityInstance.effectSpawned &&
    if(this.scene.isEditor) {
      entityInstance.setInteractive();
      scene.input.setDraggable(phaserInstance)
      if(!phaserInstance.frame.name) {
        phaserInstance.editorHighlight = scene.add.image(phaserInstance.x,phaserInstance.y, phaserInstance.texture.key)
      } else {
        phaserInstance.editorHighlight = scene.add.image(phaserInstance.x,phaserInstance.y, phaserInstance.texture.key, phaserInstance.frame.name)
      }
      phaserInstance.editorHighlight.setTintFill(getThemePrimaryColor().hexCode)
      .setDisplaySize(this.entityInstance.width + 10, this.entityInstance.height + 10)
      .setVisible(false)

      const depth = this.scene.getEntityModelDepth(entityInstance.entityModelId)
      phaserInstance.editorHighlight.setDepth(depth + editorHighlightDepthModifier)
    }
    if(entityModel.graphics.invisible && this.scene.isEditor) {
      this.createInvisiblilityIndicator()
      this.setInvisible()
    }

    this.createInteractBorder()
  }

  setInvisible() {
    this.entityInstance.isVisible = true
    this.entityInstance.setAlpha(0.02)
  }

  setDepth() {
    const depth = this.scene.getEntityModelDepth(this.entityInstance.entityModelId)
    this.entityInstance.phaserInstance.setDepth(depth)
    this.entityInstance.phaserInstance.editorHighlight?.setDepth(depth + editorHighlightDepthModifier)
    this.entityInstance.phaserInstance.invisibleIndicator?.setDepth(depth + invisibleIndicatorDepthModifer)
  }

  setGlowing() {
    if(this.entityInstance.phaserInstance.glowTask) return
    const phaserInstance = this.entityInstance.phaserInstance
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
    if(!this.entityInstance.phaserInstance.glowTask) return 
    this.entityInstance.phaserInstance.glowTask.destroy()
  }

  setSize(w, h) {
    const phaserInstance = this.entityInstance.phaserInstance
    const entityModelId = this.entityInstance.entityModelId

    if(phaserInstance.editorHighlight) {
      phaserInstance.editorHighlight.setDisplaySize(w + 10, h + 10)
    }

    if(this.scene.isEditor) {
      const gameModel = store.getState().gameModel.gameModel
      const entityModel = gameModel.entityModels[entityModelId]
      if(entityModel.graphics.invisible) {
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

  setEditorHighlightVisibility(isMouseOver) {
    const phaserInstance = this.entityInstance.phaserInstance

    if(isMouseOver === this.lastIsMouseOver) return 
    
    this.lastIsMouseOver = isMouseOver
    if(isMouseOver) {
      if(phaserInstance.invisibleIndicator) {
        this.createInvisiblilityIndicator(getThemePrimaryColor().hexString)
      } else {
        phaserInstance.editorHighlight.setVisible(true)
      }
    } else {
      if(phaserInstance.invisibleIndicator) {
        this.createInvisiblilityIndicator()
      } else {
        phaserInstance.editorHighlight.setVisible(false)
      }
    }
  }

  createInvisiblilityIndicator(hexString) {
    const phaserInstance = this.entityInstance.phaserInstance

    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]

    if(phaserInstance.invisibleIndicator) phaserInstance.invisibleIndicator.destroy()
    const width = phaserInstance.displayWidth
    const height = phaserInstance.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    phaserInstance.invisibleIndicator = this.scene.add.graphics();
    const colorInt = getHexIntFromHexString(hexString || entityModel.graphics.textureTint || '#FFFFFF')
    phaserInstance.invisibleIndicator.lineStyle(4, colorInt, 1);
    phaserInstance.invisibleIndicator.setAlpha(0.5)
    phaserInstance.invisibleIndicator.strokeRect(cornerX + 2, cornerY + 2, width - 4, height - 4);
    const depth = this.scene.getEntityModelDepth(this.entityInstance.entityModelId)
    phaserInstance.invisibleIndicator.setDepth(depth + invisibleIndicatorDepthModifer)
  }

  update() {
    const phaserInstance = this.entityInstance.phaserInstance
    const entityModelIdHovering = store.getState().gameViewEditor.entityModelIdHovering
    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]

    if(entityModel.editorInterface.notSelectableInStage) {
      phaserInstance.invisibleIndicator?.setVisible(false)
      phaserInstance.interactBorder?.setVisible(false)
      phaserInstance.editorHighlight?.setVisible(false)
      phaserInstance.setVisible(false)
      return
    }

    const gameViewEditor = getCobrowsingState().gameViewEditor
    const layerInvisibility = gameViewEditor.layerInvisibility
    const isLayerInvisible = layerInvisibility[entityModel.entityIID]
    if(isLayerInvisible) {
      this.entityInstance.setVisible(false)
    } else {
      this.entityInstance.setVisible(this.entityInstance.isVisible)
    }

    if(phaserInstance.editorHighlight) {
      phaserInstance.editorHighlight.setPosition(phaserInstance.x, phaserInstance.y)
      phaserInstance.editorHighlight.setRotation(phaserInstance.rotation)
      this.setEditorHighlightVisibility(
        this.entityInstance.entityModelId === entityModelIdHovering ||
         phaserInstance.isMouseOver
      )
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
  }

  destroy() {
    const phaserInstance = this.entityInstance.phaserInstance

    if(phaserInstance.invisibleIndicator) phaserInstance.invisibleIndicator.destroy()
    if(phaserInstance.editorHighlight) phaserInstance.editorHighlight.destroy()
    if(phaserInstance.interactBorder) phaserInstance.interactBorder.destroy()
  }
}