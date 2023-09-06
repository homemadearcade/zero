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
    const matterSprite = this.entityInstance.matterSprite

    if(entityModel.entityModelId === initialStageZoneEntityId) {
      const boundaries = this.scene.getCurrentStage().boundaries
      this.entityInstance.setPosition(boundaries.x + (boundaries.width/2), boundaries.y + (boundaries.height/2))
      this.setSize(boundaries.width, boundaries.height)
      matterSprite.setDisplaySize(boundaries.width, boundaries.height)
      entityInstance.width = boundaries.width 
      entityInstance.height = boundaries.height
    }

    matterSprite.setDisplaySize(entityInstance.width, entityInstance.height)
    this.setSize(entityInstance.width, entityInstance.height)
    const isInvisble = entityModel.graphics.invisible
    if(isInvisble) {
      this.setInvisible()
    }

    // if(entityModel.editorInterface.notSelectableInStage) return

    if(entityModel.graphics.textureTint) entityInstance.setTint(entityModel.graphics.textureTint)
    this.setDepth()
    // scene.addSpriteToTypeGroup(entityInstance.entityModelId, matterSprite)

    if(entityModel.graphics.glowing) {
      this.setGlowing()
    }

    // EDITOR
    //!entityInstance.effectSpawned &&
    if(this.scene.isEditor) {
      entityInstance.setInteractive();
      scene.input.setDraggable(matterSprite)
      if(!matterSprite.frame.name) {
        matterSprite.editorHighlight = scene.add.image(matterSprite.x,matterSprite.y, matterSprite.texture.key)
      } else {
        matterSprite.editorHighlight = scene.add.image(matterSprite.x,matterSprite.y, matterSprite.texture.key, matterSprite.frame.name)
      }
      matterSprite.editorHighlight.setTintFill(getThemePrimaryColor().hexCode)
      .setDisplaySize(this.entityInstance.width + 10, this.entityInstance.height + 10)
      .setVisible(false)

      const depth = this.scene.getEntityModelDepth(entityInstance.entityModelId)
      matterSprite.editorHighlight.setDepth(depth + editorHighlightDepthModifier)
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
    this.entityInstance.matterSprite.setDepth(depth)
    this.entityInstance.matterSprite.editorHighlight?.setDepth(depth + editorHighlightDepthModifier)
    this.entityInstance.matterSprite.invisibleIndicator?.setDepth(depth + invisibleIndicatorDepthModifer)
  }

  setGlowing() {
    if(this.entityInstance.matterSprite.glowTask) return
    const matterSprite = this.entityInstance.matterSprite
    var pipeline = this.scene.plugins.get('rexglowfilterpipelineplugin').add(matterSprite);
    matterSprite.glowTask = matterSprite.scene.tweens.add({
      targets: pipeline,
      intensity: 0.05,
      ease: 'Linear',
      duration: 500,
      repeat: -1,
      yoyo: true
    });
  }

  clearGlowing() {
    if(!this.entityInstance.matterSprite.glowTask) return 
    this.entityInstance.matterSprite.glowTask.destroy()
  }

  setSize(w, h) {
    const matterSprite = this.entityInstance.matterSprite
    const entityModelId = this.entityInstance.entityModelId

    if(matterSprite.editorHighlight) {
      matterSprite.editorHighlight.setDisplaySize(w + 10, h + 10)
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
    const matterSprite = this.entityInstance.matterSprite

    if(matterSprite.interactBorder) matterSprite.interactBorder.destroy()
    const width = matterSprite.displayWidth
    const height = matterSprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    matterSprite.interactBorder = this.scene.add.graphics();
    matterSprite.interactBorder.lineStyle(4, getThemePrimaryColor().hexCode, 1);
    matterSprite.interactBorder.strokeRect(cornerX, cornerY, width, height);
    matterSprite.interactBorder.setVisible(false)
    this.scene.uiLayer.add(matterSprite.interactBorder)
  }

  setEditorHighlightVisibility(isMouseOver) {
    const matterSprite = this.entityInstance.matterSprite

    if(isMouseOver === this.lastIsMouseOver) return 
    
    this.lastIsMouseOver = isMouseOver
    if(isMouseOver) {
      if(matterSprite.invisibleIndicator) {
        this.createInvisiblilityIndicator(getThemePrimaryColor().hexString)
      } else {
        matterSprite.editorHighlight.setVisible(true)
      }
    } else {
      if(matterSprite.invisibleIndicator) {
        this.createInvisiblilityIndicator()
      } else {
        matterSprite.editorHighlight.setVisible(false)
      }
    }
  }

  createInvisiblilityIndicator(hexString) {
    const matterSprite = this.entityInstance.matterSprite

    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]

    if(matterSprite.invisibleIndicator) matterSprite.invisibleIndicator.destroy()

    const width = matterSprite.displayWidth
    const height = matterSprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    matterSprite.invisibleIndicator = this.scene.add.graphics();
    const colorInt = getHexIntFromHexString(hexString || entityModel.graphics.textureTint || '#FFFFFF')
    matterSprite.invisibleIndicator.lineStyle(4, colorInt, 1);
    matterSprite.invisibleIndicator.setAlpha(0.5)
    matterSprite.invisibleIndicator.strokeRect(cornerX + 2, cornerY + 2, width - 4, height - 4);
    const depth = this.scene.getEntityModelDepth(this.entityInstance.entityModelId)
    matterSprite.invisibleIndicator.setDepth(depth + invisibleIndicatorDepthModifer)
  }

  update() {
    const matterSprite = this.entityInstance.matterSprite
    const entityModelIdHovering = store.getState().gameViewEditor.entityModelIdHovering
    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]
    
    // if the instance can be hovered over and then selected
    matterSprite.isSelectable = false
    
    const isInvisible = entityModel.graphics.invisible
    // if(entityModel.editorInterface.notSelectableInStage) {
    //   matterSprite.invisibleIndicator?.setVisible(false)
    //   matterSprite.interactBorder?.setVisible(false)
    //   matterSprite.editorHighlight?.setVisible(false)
    //   matterSprite.setVisible(false)
    //   return
    // }

    if(matterSprite.isPlayerInstance) {
      const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
      if(isGridViewOn) {
        if(!this.arrowKeyIcon) {
          this.arrowKeyIcon = this.scene.add.image(0, 0, 'arrowkeys').setOrigin(0.5, 0.5)
          const size = gameModel.size.nodeSize * 1.5
          this.arrowKeyIcon.setDisplaySize(size, size * 0.7)
          this.arrowKeyIcon.setAlpha(0.5)
          this.arrowKeyIcon.setDepth(UI_LAYER_DEPTH)
        }
        this.arrowKeyIcon.setPosition(matterSprite.x, matterSprite.y)
        matterSprite.setAlpha(0.5)
      } else {
        if(this.arrowKeyIcon) {
          this.arrowKeyIcon.destroy()
          this.arrowKeyIcon = null
        }
        if(isInvisible) {
          this.setInvisible()
        } else {
          matterSprite.setAlpha(1)
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
    } else if(matterSprite.invisibleOverride) {
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
      matterSprite.isSelectable = true
      this.setInvisible()
    } else if(!isLayerInvisible && this.entityInstance.isVisible) {
      this.entityInstance.setVisible(true)
      matterSprite.isSelectable = true
    } else {
      this.entityInstance.setVisible(false)
    }

    if(matterSprite.editorHighlight) {
      matterSprite.editorHighlight.setPosition(matterSprite.x, matterSprite.y)
      matterSprite.editorHighlight.setRotation(matterSprite.rotation)
      this.setEditorHighlightVisibility(
        this.entityInstance.entityModelId === entityModelIdHovering ||
         matterSprite.isMouseOver
      )
    }

    // if an invisibility indicator is set on an entity -  we want to show/update the invisible indicator
    if(matterSprite.invisibleIndicator) {
      if(this.scene.isPlaythrough) {
        matterSprite.invisibleIndicator.setVisible(false)
      } else {
        matterSprite.invisibleIndicator.setPosition(matterSprite.x, matterSprite.y)
        matterSprite.invisibleIndicator.setRotation(matterSprite.rotation)

        // for invisible entity instances, we want to show the invisible indicator when they are being resized
        // if theres no special action like resizing, we will show the indicator if the layer is visible
        const isResizing = store.getState().gameViewEditor.resizingEntityInstanceId === this.entityInstance.entityInstanceId
        const isIndicatorVisible = isResizing || !isLayerInvisible
        matterSprite.invisibleIndicator.setVisible(isIndicatorVisible)
      }
    }

    matterSprite.interactBorder.setPosition(matterSprite.x, matterSprite.y)
    matterSprite.interactBorder.setRotation(matterSprite.rotation)

    if(entityModel.editorInterface.notSelectableInStage) {
      this.entityInstance.setVisible(false)
      matterSprite.isSelectable = false 
    }
  }

  destroy() {
    const matterSprite = this.entityInstance.matterSprite

    if(matterSprite.invisibleIndicator) matterSprite.invisibleIndicator.destroy()
    if(matterSprite.editorHighlight) matterSprite.editorHighlight.destroy()
    if(matterSprite.interactBorder) matterSprite.interactBorder.destroy()
    if(this.arrowKeyIcon) this.arrowKeyIcon.destroy()
  }
}