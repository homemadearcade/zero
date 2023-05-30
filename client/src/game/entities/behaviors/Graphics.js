import store from "../../../store"
import { getCobrowsingState } from "../../../utils/cobrowsingUtils"
import { getHexIntFromHexString } from "../../../utils/editorUtils"
import { getThemePrimaryColor } from "../../../utils/webPageUtils"
import { UI_LAYER_DEPTH, editorHighlightDepthModifier, initialStageZoneEntityId, invisibleIndicatorDepthModifer } from "../../constants"


export class Graphics {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene

    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[entityInstance.entityModelId]
    const phaserInstance = this.entityInstance.phaserInstance

    if(entityModel.entityModelId === initialStageZoneEntityId) {
      const boundaries = this.scene.getCurrentStage().boundaries
      this.entityInstance.setPosition(boundaries.x + (boundaries.width/2), boundaries.y + (boundaries.height/2))
      this.setSize(boundaries.width, boundaries.height)
      phaserInstance.setDisplaySize(boundaries.width, boundaries.height)
      entityInstance.width = boundaries.width 
      entityInstance.height = boundaries.height
    }

    phaserInstance.setDisplaySize(entityInstance.width, entityInstance.height)
    this.setSize(entityInstance.width, entityInstance.height)

    // if(entityModel.editorInterface.notSelectableInStage) return

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
    }

    this.createInteractBorder()
  }

  setInvisible() {
    this.entityInstance.setAlpha(0.02)
    this.entityInstance.setVisible(true)
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
    
    // if the instance can be hovered over and then selected
    phaserInstance.isSelectable = false
    
    const isInvisible = entityModel.graphics.invisible
    // if(entityModel.editorInterface.notSelectableInStage) {
    //   phaserInstance.invisibleIndicator?.setVisible(false)
    //   phaserInstance.interactBorder?.setVisible(false)
    //   phaserInstance.editorHighlight?.setVisible(false)
    //   phaserInstance.setVisible(false)
    //   return
    // }

    if(phaserInstance.isPlayerInstance) {
      const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
      if(isGridViewOn) {
        if(!this.arrowKeyIcon) {
          this.arrowKeyIcon = this.scene.add.image(0, 0, 'arrowkeys').setOrigin(0.5, 0.5)
          const size = gameModel.size.nodeSize * 1.5
          this.arrowKeyIcon.setDisplaySize(size, size * 0.7)
          this.arrowKeyIcon.setAlpha(0.5)
          this.arrowKeyIcon.setDepth(UI_LAYER_DEPTH)
        }
        this.arrowKeyIcon.setPosition(phaserInstance.x, phaserInstance.y)
        phaserInstance.setAlpha(0.5)
      } else {
        if(this.arrowKeyIcon) {
          this.arrowKeyIcon.destroy()
          this.arrowKeyIcon = null
        }
        if(isInvisible) {
          this.setInvisible()
        } else {
          phaserInstance.setAlpha(1)
        }
      }
    }

    if(isInvisible) {
      if(this.scene.isEditor) {
        this.entityInstance.isVisible = false
      } else if(this.scene.isPlaythrough) {
        this.entityInstance.isVisible = false 
      } else {
        this.entityInstance.isVisible = true
      }
    } else if(phaserInstance.invisibleOverride) {
      this.entityInstance.isVisible = false 
    } else {
      this.entityInstance.isVisible = true
    }

    const gameViewEditor = getCobrowsingState().gameViewEditor
    const layerInvisibility = gameViewEditor.layerInvisibility
    const isLayerInvisible = layerInvisibility[entityModel.entityIID]
    // sets visible to false if layer is invisible, but if the layer is visible, then visibility is determined by the entitys visibility state

    if(isInvisible && !isLayerInvisible) {
      this.entityInstance.isVisible = true
      phaserInstance.isSelectable = true
      this.setInvisible()
    } else if(!isLayerInvisible && this.entityInstance.isVisible) {
      this.entityInstance.setVisible(true)
      phaserInstance.isSelectable = true
    } else {
      this.entityInstance.setVisible(false)
    }

    if(phaserInstance.editorHighlight) {
      phaserInstance.editorHighlight.setPosition(phaserInstance.x, phaserInstance.y)
      phaserInstance.editorHighlight.setRotation(phaserInstance.rotation)
      const instanceIdHovering = store.getState().hoverPreview.entityInstanceIdHovering
      this.setEditorHighlightVisibility(
        this.entityInstance.entityModelId === entityModelIdHovering ||
        instanceIdHovering === phaserInstance.entityInstanceId
      )
    }

    // if an invisibility indicator is set on an entity -  we want to show/update the invisible indicator
    if(phaserInstance.invisibleIndicator) {
      if(this.scene.isPlaythrough) {
        phaserInstance.invisibleIndicator.setVisible(false)
      } else {
        phaserInstance.invisibleIndicator.setPosition(phaserInstance.x, phaserInstance.y)
        phaserInstance.invisibleIndicator.setRotation(phaserInstance.rotation)

        // for invisible entity instances, we want to show the invisible indicator when they are being resized
        // if theres no special action like resizing, we will show the indicator if the layer is visible
        const isResizing = store.getState().gameViewEditor.resizingEntityInstanceId === this.entityInstance.entityInstanceId
        const isIndicatorVisible = isResizing || !isLayerInvisible
        phaserInstance.invisibleIndicator.setVisible(isIndicatorVisible)
      }
    }

    phaserInstance.interactBorder.setPosition(phaserInstance.x, phaserInstance.y)
    phaserInstance.interactBorder.setRotation(phaserInstance.rotation)

    if(entityModel.editorInterface.notSelectableInStage) {
      this.entityInstance.setVisible(false)
      phaserInstance.isSelectable = false 
    }
  }

  destroy() {
    const phaserInstance = this.entityInstance.phaserInstance

    if(phaserInstance.invisibleIndicator) phaserInstance.invisibleIndicator.destroy()
    if(phaserInstance.editorHighlight) phaserInstance.editorHighlight.destroy()
    if(phaserInstance.interactBorder) phaserInstance.interactBorder.destroy()
    if(phaserInstance.arrowKeyIcon) phaserInstance.arrowKeyIcon.destroy()
  }
}