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
    const physicsSprite = this.entityInstance.physicsSprite

    if(entityModel.entityModelId === initialStageZoneEntityId) {
      const boundaries = this.scene.getStage().boundaries
      this.entityInstance.setPosition(boundaries.x + (boundaries.width/2), boundaries.y + (boundaries.height/2))
      this.setSize(boundaries.width, boundaries.height)
      physicsSprite.setDisplaySize(boundaries.width, boundaries.height)
      entityInstance.width = boundaries.width 
      entityInstance.height = boundaries.height
    }

    physicsSprite.setDisplaySize(entityInstance.width, entityInstance.height)
    this.setSize(entityInstance.width, entityInstance.height)
    const isInvisble = entityModel.graphics.invisible
    if(isInvisble) {
      this.setInvisible()
    }

    // if(entityModel.editorInterface.notSelectableInStage) return

    if(entityModel.graphics.textureTint) entityInstance.setTint(entityModel.graphics.textureTint)
    this.setDepth()
    // scene.addSpriteToTypeGroup(entityInstance.entityModelId, physicsSprite)

    if(entityModel.graphics.glowing) {
      this.setGlowing()
    }

    // EDITOR
    //!entityInstance.effectSpawned &&
    if(this.scene.isEditor) {
      entityInstance.setInteractive();
      scene.input.setDraggable(physicsSprite)
      if(!physicsSprite.frame.name) {
        physicsSprite.editorHighlight = scene.add.image(physicsSprite.x,physicsSprite.y, physicsSprite.texture.key)
      } else {
        physicsSprite.editorHighlight = scene.add.image(physicsSprite.x,physicsSprite.y, physicsSprite.texture.key, physicsSprite.frame.name)
      }
      physicsSprite.editorHighlight.setTintFill(getThemePrimaryColor().hexCode)
      .setDisplaySize(this.entityInstance.width + 10, this.entityInstance.height + 10)
      .setVisible(false)

      const depth = this.scene.getEntityModelDepth(entityInstance.entityModelId)
      physicsSprite.editorHighlight.setDepth(depth + editorHighlightDepthModifier)
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
    this.entityInstance.physicsSprite.setDepth(depth)
    this.entityInstance.physicsSprite.editorHighlight?.setDepth(depth + editorHighlightDepthModifier)
    this.entityInstance.physicsSprite.invisibleIndicator?.setDepth(depth + invisibleIndicatorDepthModifer)
  }

  setGlowing() {
    if(this.entityInstance.physicsSprite.glowTask) return
    const physicsSprite = this.entityInstance.physicsSprite
    var pipeline = this.scene.plugins.get('rexglowfilterpipelineplugin').add(physicsSprite);
    physicsSprite.glowTask = physicsSprite.scene.tweens.add({
      targets: pipeline,
      intensity: 0.05,
      ease: 'Linear',
      duration: 500,
      repeat: -1,
      yoyo: true
    });
  }

  clearGlowing() {
    if(!this.entityInstance.physicsSprite.glowTask) return 
    this.entityInstance.physicsSprite.glowTask.destroy()
  }

  setSize(w, h) {
    const physicsSprite = this.entityInstance.physicsSprite
    const entityModelId = this.entityInstance.entityModelId

    if(physicsSprite.editorHighlight) {
      physicsSprite.editorHighlight.setDisplaySize(w + 10, h + 10)
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
    const physicsSprite = this.entityInstance.physicsSprite

    if(physicsSprite.interactBorder) physicsSprite.interactBorder.destroy()
    const width = physicsSprite.displayWidth
    const height = physicsSprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    physicsSprite.interactBorder = this.scene.add.graphics();
    physicsSprite.interactBorder.lineStyle(4, getThemePrimaryColor().hexCode, 1);
    physicsSprite.interactBorder.strokeRect(cornerX, cornerY, width, height);
    physicsSprite.interactBorder.setVisible(false)
    this.scene.uiLayer.add(physicsSprite.interactBorder)
  }

  setEditorHighlightVisibility(isMouseOver) {
    const physicsSprite = this.entityInstance.physicsSprite

    if(isMouseOver === this.lastIsMouseOver) return 
    
    this.lastIsMouseOver = isMouseOver
    if(isMouseOver) {
      if(physicsSprite.invisibleIndicator) {
        this.createInvisiblilityIndicator(getThemePrimaryColor().hexString)
      } else {
        physicsSprite.editorHighlight.setVisible(true)
      }
    } else {
      if(physicsSprite.invisibleIndicator) {
        this.createInvisiblilityIndicator()
      } else {
        physicsSprite.editorHighlight.setVisible(false)
      }
    }
  }

  createInvisiblilityIndicator(hexString) {
    const physicsSprite = this.entityInstance.physicsSprite

    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]

    if(physicsSprite.invisibleIndicator) physicsSprite.invisibleIndicator.destroy()

    const width = physicsSprite.displayWidth
    const height = physicsSprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    physicsSprite.invisibleIndicator = this.scene.add.graphics();
    const colorInt = getHexIntFromHexString(hexString || entityModel.graphics.textureTint || '#FFFFFF')
    physicsSprite.invisibleIndicator.lineStyle(4, colorInt, 1);
    physicsSprite.invisibleIndicator.setAlpha(0.5)
    physicsSprite.invisibleIndicator.strokeRect(cornerX + 2, cornerY + 2, width - 4, height - 4);
    const depth = this.scene.getEntityModelDepth(this.entityInstance.entityModelId)
    physicsSprite.invisibleIndicator.setDepth(depth + invisibleIndicatorDepthModifer)
  }

  update() {
    const physicsSprite = this.entityInstance.physicsSprite
    const entityModelIdHovering = store.getState().gameViewEditor.entityModelIdHovering
    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]
    
    // if the instance can be hovered over and then selected
    physicsSprite.isSelectable = false
    
    const isInvisible = entityModel.graphics.invisible
    // if(entityModel.editorInterface.notSelectableInStage) {
    //   physicsSprite.invisibleIndicator?.setVisible(false)
    //   physicsSprite.interactBorder?.setVisible(false)
    //   physicsSprite.editorHighlight?.setVisible(false)
    //   physicsSprite.setVisible(false)
    //   return
    // }

    if(physicsSprite.isPlayerInstance) {
      const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
      if(isGridViewOn) {
        if(!this.arrowKeyIcon) {
          this.arrowKeyIcon = this.scene.add.image(0, 0, 'arrowkeys').setOrigin(0.5, 0.5)
          const size = gameModel.size.nodeSize * 1.5
          this.arrowKeyIcon.setDisplaySize(size, size * 0.7)
          this.arrowKeyIcon.setAlpha(0.5)
          this.arrowKeyIcon.setDepth(UI_LAYER_DEPTH)
        }
        this.arrowKeyIcon.setPosition(physicsSprite.x, physicsSprite.y)
        physicsSprite.setAlpha(0.5)
      } else {
        if(this.arrowKeyIcon) {
          this.arrowKeyIcon.destroy()
          this.arrowKeyIcon = null
        }
        if(isInvisible) {
          this.setInvisible()
        } else {
          physicsSprite.setAlpha(1)
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
    } else if(physicsSprite.invisibleOverride) {
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
      physicsSprite.isSelectable = true
      this.setInvisible()
    } else if(!isLayerInvisible && this.entityInstance.isVisible) {
      this.entityInstance.setVisible(true)
      physicsSprite.isSelectable = true
    } else {
      this.entityInstance.setVisible(false)
    }

    if(physicsSprite.editorHighlight) {
      physicsSprite.editorHighlight.setPosition(physicsSprite.x, physicsSprite.y)
      physicsSprite.editorHighlight.setRotation(physicsSprite.rotation)
      this.setEditorHighlightVisibility(
        this.entityInstance.entityModelId === entityModelIdHovering ||
         physicsSprite.isMouseOver
      )
    }

    // if an invisibility indicator is set on an entity -  we want to show/update the invisible indicator
    if(physicsSprite.invisibleIndicator) {
      if(this.scene.isPlaythrough) {
        physicsSprite.invisibleIndicator.setVisible(false)
      } else {
        physicsSprite.invisibleIndicator.setPosition(physicsSprite.x, physicsSprite.y)
        physicsSprite.invisibleIndicator.setRotation(physicsSprite.rotation)

        // for invisible entity instances, we want to show the invisible indicator when they are being resized
        // if theres no special action like resizing, we will show the indicator if the layer is visible
        const isResizing = store.getState().gameViewEditor.resizingEntityInstanceId === this.entityInstance.entityInstanceId
        const isIndicatorVisible = isResizing || !isLayerInvisible
        physicsSprite.invisibleIndicator.setVisible(isIndicatorVisible)
      }
    }

    physicsSprite.interactBorder.setPosition(physicsSprite.x, physicsSprite.y)
    physicsSprite.interactBorder.setRotation(physicsSprite.rotation)

    if(entityModel.editorInterface.notSelectableInStage) {
      this.entityInstance.setVisible(false)
      physicsSprite.isSelectable = false 
    }
  }

  destroy() {
    const physicsSprite = this.entityInstance.physicsSprite

    if(physicsSprite.invisibleIndicator) physicsSprite.invisibleIndicator.destroy()
    if(physicsSprite.editorHighlight) physicsSprite.editorHighlight.destroy()
    if(physicsSprite.interactBorder) physicsSprite.interactBorder.destroy()
    if(this.arrowKeyIcon) this.arrowKeyIcon.destroy()
  }
}