import Phaser from 'phaser';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/game/gameModelActions';
import { openContextMenuFromEntityInstance, openStageContextMenu } from '../../store/actions/game/contextMenuActions';
import { isBrushIdColor, isBrushIdEraser, snapObjectXY } from '../../utils/editorUtils';
import { clearBrush, clearEntity, openEntityBehaviorLiveEditor, openGameEditDialog, openStageLiveEditor, selectEntity } from '../../store/actions/game/gameSelectorActions';
import { closeSnapshotTaker, changeEditorCameraZoom, setResizingEntityInstance, closeBoundaryEditor, setIsMouseOverGameView } from '../../store/actions/game/gameViewEditorActions';
import { PLAYER_INSTANCE_DID, ENTITY_INSTANCE_DID, UI_LAYER_DEPTH, 
  STAGE_LAYER_ID, EVENT_SPAWN_MODEL_DRAG_FINISH, STAGE_ZONE_ENTITY_RID,
 } from '../constants';
import { TexturePencil } from '../drawing/TexturePencil';
import { Eraser } from '../drawing/Eraser';
import { EntityStamper } from '../drawing/EntityStamper';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { RemoteEditor } from '../entities/RemoteEditor';
import { ColorPencil } from '../drawing/ColorPencil';
import { getImageUrlFromTextureId, urlToFile } from '../../utils/utils';
import { generateUniqueId, getThemePrimaryColor, isLocalHost } from '../../utils/webPageUtils';
import { getInterfaceIdData } from '../../utils/unlockedInterfaceUtils';
import { createGameSceneInstance, getGameModelSize } from '../../utils/gameUtils';
import { addSnackbar } from '../../store/actions/snackbarActions';
import { BACKGROUND_LAYER_GROUP_IID, ENTITY_INSTANCE_MOVE_IID, ENTITY_MODEL_OPEN_BEHAVIOR_EDIT_IID, ENTITY_MODEL_OPEN_EDIT_IID, FOREGROUND_LAYER_GROUP_IID, GAME_OPEN_EDIT_IID, PLAYER_ENTITY_IID, PLAYGROUND_LAYER_GROUP_IID, STAGE_OPEN_EDIT_IID } from '../../constants/interfaceIds';
import { addCanvasImage, uploadCanvasImageAndAddToGameModel } from '../../store/actions/media/canvasImageActions';
import { updateTheme } from '../../store/actions/themeActions';
import { changeInstanceHovering } from '../../store/actions/game/hoverPreviewActions';
import { EXPERIENCE_ROLE_PARTICIPANT, IMAGE_TYPE_SNAPSHOT } from '../../constants';
import { openEditEntityDialog } from '../../store/actions/game/gameFormEditorActions';

export class EditorScene extends GameInstance {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance

    this.draggingEntityInstanceId = null
    this.brushingCanvas = null
    this.brush = null 
    this.stamper = null
    this.gameResetVersion = props.gameRoomInstance.gameResetVersion
    this.isGridViewOn = true
    this.editorCamera = null
    this.remoteEditors = []

    this.snapshotSquare = null 
    this.snapshotStartPos = null
    this.snapshotEndPos = null
    this.isEditor = true
    this.readyForNextEscapeKey = true
    this.isMouseOverGame = false

    this.editorCameraKeys = null
    this.editorCamera = null
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // DRAG
  ////////////////////////////////////////////////////////////
  onDragStartContextMenu = (entityInstanceId) => {
    this.draggingEntityInstanceId = entityInstanceId
    this.isDragFromContext = true
  }

  onDragStart = (pointer, physicsSprite, dragX, dragY) => {
    // const { isObscured } = getInterfaceIdData(ENTITY_INSTANCE_MOVE_IID)
    // if(isObscured) {
    //   return
    // }

    // if(physicsSprite.effectSpawned) return

    this.isDragFromContext = false

    if(this.draggingEntityInstanceId && this.draggingEntityInstanceId === physicsSprite.entityInstanceId) {
      this.continueDrag(physicsSprite, {x: dragX, y: dragY})
    } else if(!this.brush && !this.stamper){
      if(physicsSprite.entityInstanceId !== this.hoveringInstanceId) {
        return 
      }
      this.draggingEntityInstanceId = physicsSprite.entityInstanceId
    }
  }

  isPixelPerfectModeOn = () => {
    return getCobrowsingState().gameViewEditor.isPixelPerfectModeOn
  }

  continueDrag(physicsSprite, {x, y}) {
    const entityModelId = this.getEntityInstance(this.draggingEntityInstanceId).entityModelId
    const entityModel= store.getState().gameModel.gameModel.entityModels[entityModelId]
    const { clampedX, clampedY, freeX, freeY } = snapObjectXY({
      x, y,  
      entityModel,
      entityInstance: physicsSprite.entityInstance
    })
    const isPixelPerfectModeOn = this.isPixelPerfectModeOn()
    if(isPixelPerfectModeOn) {
      physicsSprite.x = freeX
      physicsSprite.y = freeY
    } else {  
      physicsSprite.x = clampedX;
      physicsSprite.y = clampedY;
    }
  }

  finishDrag(physicsSprite) {
    if(physicsSprite.effectSpawned) {
      this.callGameInstanceEvent({
        gameRoomInstanceEventType: EVENT_SPAWN_MODEL_DRAG_FINISH,
        data: {
          x: physicsSprite.x,
          y: physicsSprite.y,
          entityInstanceId: physicsSprite.entityInstanceId,
          hostOnly: true
        }
      })

      return
    }

    if(physicsSprite.isPlayerInstance) {
      // store.dispatch(editGameModel({ 
      //   player: {
      //     spawnX: physicsSprite.x,
      //     spawnY: physicsSprite.y
      //   }
      // }))
    } else {
      store.dispatch(editGameModel({ 
        stages: {
          [this.stage.stageId]: {
            entityInstances: {
              [physicsSprite.entityInstanceId]: {
                spawnX: physicsSprite.x,
                spawnY: physicsSprite.y
              }
            }
          }
        }
      }))
    }
  }

  onDragEnd = (pointer, physicsSprite) => {
    this.finishDrag(physicsSprite)
  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // RESIZE
  ////////////////////////////////////////////////////////////
  onResizeStart = (entityInstanceId) => {
    this.resizingEntityInstance = this.getEntityInstance(entityInstanceId)
  }

  onResizeMove = (pointer) => {
    const physicsSprite = this.resizingEntityInstance.physicsSprite
    const boundaries = store.getState().gameModel.gameModel.stages[this.stage.stageId].boundaries
    const nodeSize = store.getState().gameModel.gameModel.size.nodeSize
    // const distance = Phaser.Math.Distance.Between(physicsSprite.x, physicsSprite.y, pointer.worldX, pointer.worldY)
    const distanceW = Phaser.Math.Snap.To(Math.abs(physicsSprite.x - pointer.worldX), nodeSize)
    const distanceH = Phaser.Math.Snap.To(Math.abs(physicsSprite.y - pointer.worldY), nodeSize)
    // const gridx = boundaries.x
    // const gridy = boundaries.y
    // const gridwidth = gridx + boundaries.width
    // const gridheight = gridy + boundaries.height

    let width;
    let height;
    // if(pointer.event.shiftKey) {
    //   width = Phaser.Math.Clamp(distanceW, nodeSize, boundaries.width)
    //   height = Phaser.Math.Clamp(distanceH, nodeSize, boundaries.height)
    // } else {
      width = Phaser.Math.Clamp(distanceW * 2, nodeSize, boundaries.width)
      height = Phaser.Math.Clamp(distanceH * 2, nodeSize, boundaries.height)
    // }

    const entityModel = this.getEntityModel(this.resizingEntityInstance.entityModelId)
    if(entityModel.graphics.aspectRatio) {
      height = width/(entityModel.graphics.aspectRatio)
    }

    const resizingEntityModelId = getCobrowsingState().gameViewEditor.resizingEntityModelId
    if(resizingEntityModelId) {
      this.forAllEntityInstancesMatchingEntityId(physicsSprite.entityModelId, (entityInstance) => {
        const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
        if(entityInstanceData.width || entityInstanceData.height) {
          // dont resize this one cuz it wont be effected
        } else {
          entityInstance.setSize(width, height)
        }
      })
    } else {
      const entityInstance = this.getEntityInstance(physicsSprite.entityInstanceId)
      entityInstance.setSize(width, height)
    }

  }

  clearResize() {
    const physicsSprite = this.resizingEntityInstance.physicsSprite
    const entityModel = store.getState().gameModel.gameModel.entityModels[physicsSprite.entityModelId];

    const entityInstance = this.getEntityInstance(physicsSprite.entityInstanceId)
    if(entityInstance.onClearResize) {
      entityInstance.onClearResize()
      return
    }

    this.forAllEntityInstancesMatchingEntityId(physicsSprite.entityModelId, (entityInstance) => {
      const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
      if(entityInstanceData.width && entityInstanceData.height) {
        entityInstance.setSize(entityInstanceData.width, entityInstanceData.height)
      } else {
        entityInstance.setSize(entityModel.graphics.width, entityModel.graphics.height)
      }
    })
    this.resizingEntityInstance = null
  }

  onResizeComplete = (pointer) => {
    const physicsSprite = this.resizingEntityInstance.physicsSprite

    const width = physicsSprite.displayWidth
    const height = physicsSprite.displayHeight

    const entityInstance = this.getEntityInstance(physicsSprite.entityInstanceId)
    if(entityInstance.onResizeComplete) {
      entityInstance.onResizeComplete({width, height})
      this.resizingEntityInstance = null
      store.dispatch(setResizingEntityInstance(null))
      return
    }

    if(physicsSprite.isPlayerInstance) {
      store.dispatch(editGameModel({ 
        // player: {
        //   spawnX: physicsSprite.x,
        //   spawnY: physicsSprite.y
        // },
        entityModels: {
          [physicsSprite.entityModelId]: {
            graphics: {
              width,
              height
            }
          }
        }
      }))
    } else {
      const resizingEntityModelId = getCobrowsingState().gameViewEditor.resizingEntityModelId
      if(resizingEntityModelId) {
        store.dispatch(editGameModel({ 
          entityModels: {
            [physicsSprite.entityModelId]: {
              graphics: {
                width,
                height
              }
            } 
          },
          stages: {
            [this.stage.stageId]: {
              entityInstances: {
                [physicsSprite.entityInstanceId]: {
                  spawnX: physicsSprite.x,
                  spawnY: physicsSprite.y,
                }
              },
            }
          }
        }))
      } else {
        store.dispatch(editGameModel({ 
          stages: {
            [this.stage.stageId]: {
              entityInstances: {
                [physicsSprite.entityInstanceId]: {
                  spawnX: physicsSprite.x,
                  spawnY: physicsSprite.y,
                  width,
                  height
                }
              },
            }
          },
        }))
      }
    }

    this.resizingEntityInstance = null
    store.dispatch(setResizingEntityInstance(null))
  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // POINTER
  ////////////////////////////////////////////////////////////
  onPointerMove = (pointer, physicsSprites)  => {
    window.pointer = pointer

    const gameViewEditor = getCobrowsingState().gameViewEditor
    const gameSelector = getCobrowsingState().gameSelector
    const brushId = gameSelector.brushIdSelectedBrushList
    const entityModelId = gameSelector.entityModelIdSelectedEntityList
    const gameModel = store.getState().gameModel.gameModel

    if(this.resizingEntityInstance) {
      this.onResizeMove(pointer)
      return
    }

    if(this.isDragFromContext && this.draggingEntityInstanceId) {
      const instance = this.getEntityInstance(this.draggingEntityInstanceId)
      this.continueDrag(instance.physicsSprite, {x: pointer.worldX, y: pointer.worldY})
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // SNAPSHOT
    ////////////////////////////////////////////////////////////
    if(this.snapshotSquare) {
      if(!gameViewEditor.isSnapshotTakerOpen) {
        this.clearSnapshotSquare()
      } 
      if(!this.snapshotSquare.finalized) {
        this.snapshotSquare.clear()
        this.snapshotSquare.lineStyle(2, getThemePrimaryColor().hexCode);
        this.snapshotEndPos.x = (pointer.worldX - this.snapshotStartPos.x) + 2
        this.snapshotEndPos.y = (pointer.worldY - this.snapshotStartPos.y) + 2
        this.snapshotSquare.strokeRect(this.snapshotStartPos.x - 2, this.snapshotStartPos.y - 2, this.snapshotEndPos.x, this.snapshotEndPos.y);
      }
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // BRUSHES
    ////////////////////////////////////////////////////////////
    if((!brushId && this.brush) || (this.brush && (this.brush.brushId !== brushId))) {
      this.destroyBrush()
    }

    if(brushId && !this.brush) {
      this.brush = this.createBrushFromBrushId(brushId)
    }

    if(this.brush) {
      const brushingCanvas = this.getLayerInstanceByLayerId(this.brush.getLayerId())
      this.brush.update(pointer, brushingCanvas)
    }
    if(this.brushingCanvas && pointer.isDown) {
      this.brush.stroke(pointer, this.brushingCanvas)
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // STAMPERS
    ////////////////////////////////////////////////////////////
    if((!entityModelId && this.stamper) || (this.stamper && (this.stamper.entityModelId !== entityModelId))) {
      this.destroyStamper()
    }
    if(entityModelId && !this.stamper) {
      const entityModel = gameModel.entityModels[entityModelId]
      if(entityModel.entityClassIID !== PLAYER_ENTITY_IID) {
        const entityInstanceId = gameSelector.entityInstanceIdSelected
        if(entityInstanceId) {
          const entityInstanceData = gameModel.stages[this.stage.stageId].entityInstances[entityInstanceId]
          this.stamper = new EntityStamper(this, entityModel, entityInstanceData)
          return
        } else {
          this.stamper = new EntityStamper(this, entityModel)
        }

      }
    }
    if(this.stamper) {
      this.stamper.update(pointer)
    }
  }

  onPointerOver = (pointer, physicsSprites) => {
    if(this.draggingEntityInstanceId) return
    // const { isObscured } = getInterfaceIdData(ENTITY_INSTANCE_MOVE_IID)
    //isObscured ||

    // if(this.brush || this.stamper || this.snapshotSquare || this.getEntityModel(physicsSprite[0].entityModelId).editorInterface.notSelectableInStage) {
    //   return
    // }

    const entityInstanceIdHovering = store.getState().hoverPreview.entityInstanceIdHovering
    const physicsSprite = physicsSprites[0]

    if(physicsSprite.entityInstanceId !== entityInstanceIdHovering && physicsSprite?.isSelectable) {
      store.dispatch(changeInstanceHovering(physicsSprite.entityInstanceId, physicsSprite.entityModelId, { isSpawned: physicsSprite.effectSpawned }))
    }

    // const physicsSpritesOver = this.physics.overlapRect(
    //   pointer.worldX - 5,
    //   pointer.worldY - 5,
    //   10,
    //   10
    // )
    // if(!physicsSpritesOver.length) {
    //   store.dispatch(changeInstanceHovering(null, null))
    // }
    // console.log('physicsSpritesOver', physicsSpritesOver)
    
    // let smallestWidth = 10000
    // let smallestInstance = null
    // physicsSpritesOver.forEach((physicsSprite) => {
    //   console.log('physicsSprite', physicsSprite.entityInstanceId)
    //   const entityInstance = this.getEntityInstance(physicsSprite.entityInstanceId)

    //   console.log('physicsSprite', physicsSprite.width, entityInstance, smallestWidth)
    //   if(entityInstance.isSelectable && physicsSprite.width < smallestWidth) {
    //     smallestWidth = physicsSprite.width
    //     smallestInstance = physicsSprite
    //   }
    // })

    // console.log('smallestInstance', smallestInstance)
    // if(smallestInstance) smallestInstance.isMouseOver = true
    // if(physicsSprite.effectSpawned) return
    // if(!document.body.style.cursor) document.body.style.cursor = 'grab'

    this.hoveringInstanceId = physicsSprite.entityInstanceId
    if(physicsSprite.isSelectable) physicsSprite.isMouseOver = true
  }

  onPointerDownOutside = (pointer) => {
    if(pointer.leftButtonDown()) {
      if(this.resizingEntityInstance) {
        this.onResizeComplete()
      }
    }
  }

  clearSnapshotSquare() {
    this.snapshotSquare.clear()
    this.snapshotSquare.destroy()
    this.snapshotSquare = null 
    this.snapshotStartPos = null
  }

  drawVisibleLayerGroupToRenderTexture(layerGroupIID, renderTexture) {
    const gameViewEditor = getCobrowsingState().gameViewEditor
    this.layerInstancesByLayerGroupId[layerGroupIID].forEach((layerInstance) => {
      if(!gameViewEditor.layerInvisibility[layerInstance.layerId]) {
        renderTexture.draw(layerInstance, 0,0)
      }
    })
  }

  drawVisibleSceneToRenderTexture(renderTexture) {
    const gameViewEditor = getCobrowsingState().gameViewEditor

    if(!gameViewEditor.layerInvisibility[STAGE_LAYER_ID]) {
      renderTexture.draw(this.stage.colorLayer, 0,0)
    }

    this.drawVisibleLayerGroupToRenderTexture(BACKGROUND_LAYER_GROUP_IID, renderTexture)
    this.drawVisibleLayerGroupToRenderTexture(PLAYGROUND_LAYER_GROUP_IID, renderTexture)

    // if(!gameViewEditor.layerInvisibility[PLAYER_INSTANCE_CANVAS_ID] && !gameViewEditor.layerInvisibility[BASIC_ENTITY_IID] && !gameViewEditor.layerInvisibility[NPC_ENTITY_IID] ) {
      renderTexture.draw(this.entityInstanceGroup, 0,0)
    // }
    this.drawVisibleLayerGroupToRenderTexture(FOREGROUND_LAYER_GROUP_IID, renderTexture)
  }

  takeSnapshotWithSquare() {
    if(!this.snapshotSquare.finalized) return false
    const gameModel = store.getState().gameModel.gameModel
    const gameViewEditor = getCobrowsingState().gameViewEditor
    const boundaries = gameModel.stages[this.stage.stageId].boundaries
    const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, boundaries.maxWidth, boundaries.maxHeight);

    this.drawVisibleSceneToRenderTexture(snapCanvas)
    const x= Math.floor(this.snapshotStartPos.x - 2)
    const y= Math.floor(this.snapshotStartPos.y - 2) 
    const xEnd = Math.floor((this.snapshotEndPos.x))
    const yEnd = Math.floor((this.snapshotEndPos.y))
    snapCanvas.snapshotArea(
      x,y,xEnd,yEnd,
      async function (image) {
        const textureId = gameViewEditor.snapshotTextureId
    
        var imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");
        imgCanvas.width = image.width;
        imgCanvas.height = image.height;
        imgContext.drawImage(image, 0, 0, image.width, image.height);

        const imageFile = await urlToFile(imgCanvas.toDataURL(), textureId, 'image/png')

        const imageUrl = getImageUrlFromTextureId(textureId)
        await store.dispatch(addCanvasImage({
          textureId: textureId, 
          imageType: IMAGE_TYPE_SNAPSHOT,
          imageUrl,
          visualTags: [],
          imageData: {
            width: Math.floor(xEnd - x),
            height: Math.floor(yEnd - y)
          },
          userMongoId: gameModel.owner.id,
        }))

        const arcadeGameMongoId = gameModel.id
        await store.dispatch(uploadCanvasImageAndAddToGameModel({arcadeGameMongoId, imageFile, textureId, imageType: IMAGE_TYPE_SNAPSHOT}))

        store.dispatch(addSnackbar({
          message: 'Snapshot Saved!',
          imageUrl
        }))
      }
    );
    this.clearSnapshotSquare()
    store.dispatch(closeSnapshotTaker())
    return true
  }

  onPointerDown = (pointer, physicsSprites) => {
    const hoveringInstances = physicsSprites.filter((physicsSprite) => {
      return physicsSprite.isSelectable
    })

    const clickDelay = this.time.now - this.lastClick;
    this.lastClick = this.time.now;
    if(clickDelay < 350 && !pointer.event.shiftKey) {
      this.doubleClicked = true
      setTimeout(() => {
        this.doubleClicked = false
      }, 400)
      this.onDoubleClick(pointer, hoveringInstances)
      return
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // CONTEXT MENU
    ////////////////////////////////////////////////////////////
    if (pointer.rightButtonDown()) {
      function disableContextMenue(e) {
        e.preventDefault()
        return false
      }
      

      document.body.addEventListener('contextmenu', disableContextMenue)
      setTimeout(() => {
        document.body.removeEventListener('contextmenu', disableContextMenue)
      })

      
      if(hoveringInstances.length) {
        store.dispatch(openContextMenuFromEntityInstance(physicsSprites, pointer.event))
      } else {
        store.dispatch(openStageContextMenu(pointer.event))
      }
    }

    if(pointer.leftButtonDown()) {
      if(this.draggingEntityInstanceId && this.isDragFromContext) {
        this.finishDrag(this.getEntityInstance(this.draggingEntityInstanceId).physicsSprite)
        return
      }

      if(this.resizingEntityInstance) {
        this.onResizeComplete()
        return
      }

      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // SNAPSHOT
      ////////////////////////////////////////////////////////////
      const gameViewEditor = getCobrowsingState().gameViewEditor
      if(gameViewEditor.isSnapshotTakerOpen) {
        if(this.snapshotSquare && !this.snapshotSquare.finalized) {
          this.snapshotSquare.finalized = true 
          return
        }

        // restarting new square
        if(this.snapshotSquare?.finalized) {
          this.clearSnapshotSquare()
        }

        this.snapshotSquare = this.add.graphics().setDepth(UI_LAYER_DEPTH);
        this.snapshotStartPos = { x: pointer.worldX, y: pointer.worldY }
        this.snapshotEndPos = { x: pointer.worldX, y: pointer.worldY }

        return
      }


      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // BRUSH
      ////////////////////////////////////////////////////////////
      if(this.brush) {
        const brushingCanvas = this.getLayerInstanceByLayerId(this.brush.getLayerId())
        if(!brushingCanvas) return console.error('this is when that error happens')
        this.brushingCanvas = brushingCanvas
        this.brush.stroke(pointer, this.brushingCanvas)
        return
      }

      if(this.stamper && !this.draggingEntityInstanceId) {
        this.stamper.stamp(pointer)
        if(!pointer.event.shiftKey) {
          this.destroyStamper()
          store.dispatch(clearEntity())
        }
        return
      }

      if(!this.draggingEntityInstanceId) {
        setTimeout(() => {
          if(this.draggingEntityInstanceId || this.doubleClicked) return

          if(hoveringInstances.length) {
            // const { isObscured } = getInterfaceIdData(ENTITY_MODEL_OPEN_BEHAVIOR_EDIT_IID)
            // if(!isObscured) {
              // store.dispatch(openEntityBehaviorLiveEditor(null, hoveringInstances[0].entityModelId))
            // }
          } else {
            // const { isObscured } = getInterfaceIdData(STAGE_OPEN_EDIT_IID)
            // if(!isObscured) {
              // store.dispatch(openStageLiveEditor())
            // }
          }
        }, 400)
      }
    }
  }

  getImageOfCurrentView(fileId) {
    return new Promise((resolve, reject) => {

      try {
        const gameModel = store.getState().gameModel.gameModel
        const boundaries = gameModel.stages[this.stage.stageId].boundaries
        const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, boundaries.maxWidth, boundaries.maxHeight);
        this.drawVisibleSceneToRenderTexture(snapCanvas)
    
        snapCanvas.snapshotArea(
          Math.floor(boundaries.x), Math.floor(boundaries.y), 
          Math.floor((boundaries.width)), 
           Math.floor((boundaries.height)), async function (image) {    
          var imgCanvas = document.createElement("canvas"),
          imgContext = imgCanvas.getContext("2d");
          imgCanvas.width = image.width;
          imgCanvas.height = image.height;
          imgContext.drawImage(image, 0, 0, image.width, image.height);

          const file = await urlToFile(imgCanvas.toDataURL(), fileId, 'image/png')

          resolve({file, imgCanvas})
        });
      } catch(e) {
        reject(e)
      }
    })
  }

  onPointerUp = (pointer) => {

    
    this.draggingEntityInstanceId = null

    if(this.brushingCanvas) {
      this.onStrokeComplete()
    }
  }

  onPointerOverGame = () => {
    this.isMouseOverGame = true
    store.dispatch(setIsMouseOverGameView(true))
  }

  onPointerLeaveGame = () => {
    store.dispatch(setIsMouseOverGameView(false))

    // without !this.brushingCanvas check we end up with discrepencies in codrawing
    if(this.brush && !this.brushingCanvas) this.destroyBrush()
    if(this.stamper) this.destroyStamper()
    store.dispatch(changeInstanceHovering(null, null))
    this.isMouseOverGame = false
  }

  onPointerOut = (pointer, physicsSprites) => {
    const physicsSprite = physicsSprites[0]
    physicsSprite.isMouseOver = false

    const entityInstanceIdHovering = store.getState().hoverPreview.entityInstanceIdHovering
    if(entityInstanceIdHovering === physicsSprite.entityInstanceId) {
      store.dispatch(changeInstanceHovering(null, null))
    }
    // const { isObscured } = getInterfaceIdData(ENTITY_INSTANCE_MOVE_IID)
    // if(isObscured) {
    //   return
    // }
    // if(document.body.style.cursor === 'grab') document.body.style.cursor = null
  }

  onPointerUpOutside = (pointer)  => {
    this.draggingEntityInstanceId = null

    if(this.snapshotSquare && !this.snapshotSquare.finalized) {
      this.snapshotSquare.finalized = true 
      return
    }

    if(this.brushingCanvas) {
      this.onStrokeComplete()
    }
  }

  onDoubleClick = (pointer, hoveringInstances) => {
    if(this.draggingEntityInstanceId) return
    if(hoveringInstances.length) {
      // const { isObscured } = getInterfaceIdData(ENTITY_MODEL_OPEN_EDIT_IID)
      // if(!isObscured) {
        store.dispatch(openEditEntityDialog(this.getGameModel().entityModels[hoveringInstances[0].entityModelId]))
      // }
    } else {
      // const { isObscured } = getInterfaceIdData(GAME_OPEN_EDIT_IID)
      // if(!isObscured) {
        store.dispatch(openGameEditDialog())
      // }
    }


      // store.dispatch(selectEntity(hoveringInstances[0].entityModelId))
    // store.dispatch(changeEditorCameraZoom(5))
    // this.editorCamera.setZoom(5)
    // this.editorCamera.pan(pointer.worldX, pointer.worldY, 0)
  }

  onMouseWheel = (pointer, entityInstance, deltaX, deltaY, deltaZ) => {
    if(this.draggingEntityInstanceId) return
    if(!getCobrowsingState().gameViewEditor.isGridViewOn) return
    
    window.pointer = pointer
    const zoomUpdate = (deltaY * 0.001)
    const maxZoom = 10
    const newZoom = Phaser.Math.Clamp(this.editorCamera.zoom - zoomUpdate, 1, maxZoom)

    store.dispatch(changeEditorCameraZoom(newZoom))
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // HELPERS
  ////////////////////////////////////////////////////////////
  createBrushFromBrushId(brushId) {
    if(isBrushIdEraser(brushId)) {
      return new Eraser(this, { brushId })
    } else if(isBrushIdColor(brushId)) {
      return new ColorPencil(this, { brushId })
    } else {
      return new TexturePencil(this, { brushId })
    }
  }

  destroyStamper() {
    this.stamper.destroy()
    this.stamper = null
  }

  destroyBrush() {
    this.brush.destroy()
    this.brush = null
  }

  onStrokeComplete = async () => {
    this.brush.releaseStroke()
    if(this.brushingCanvas.createCollisionBody) this.brushingCanvas.createCollisionBody()
    this.brushingCanvas = null;
  }

  getEntityInstanceData(entityInstanceId) {
    const gameModel = store.getState().gameModel.gameModel

    if(entityInstanceId === PLAYER_INSTANCE_DID) {
      return gameModel.player
    }
    return gameModel.stages[this.stage.stageId].entityInstances[entityInstanceId]
  }

  addEntityInstanceToStageModel(entityModelId, {spawnX, spawnY}) {
    const entityInstanceId = ENTITY_INSTANCE_DID+generateUniqueId()

    const entityInstanceData = {
      entityModelId,
      spawnX,
      spawnY,
    }

    const copyingEntityInstanceId = getCobrowsingState().gameSelector.entityInstanceIdSelected
    if(copyingEntityInstanceId) {
      const copyingEntityInstanceData = this.getEntityInstanceData(copyingEntityInstanceId)
      entityInstanceData.width = copyingEntityInstanceData.width
      entityInstanceData.height = copyingEntityInstanceData.height
    }

    store.dispatch(editGameModel({
      stages: {
        [this.stage.stageId]: {
          entityInstances: {
            [entityInstanceId]: entityInstanceData
          }
        }
      }
    }))
  }

  resetEntityInstance = (entityInstance) => {
    if(entityInstance.isPlayerInstance) {
      this.removePlayerInstance()
      this.addPlayerInstance()
      return
    }
    const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
    this.removeEntityInstance(entityInstance.entityInstanceId)
    this.addEntityInstance(entityInstance.entityInstanceId, entityInstanceData)
  }

  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // NETWORK UPDATE
  ////////////////////////////////////////////////////////////
  onGameModelUpdate = (gameUpdate) => {
    if(!this.scene)  {
      return
    }
    if(!this.scene.isActive(this.scene.key)) return 

    if(gameUpdate.theme?.primaryColor) {
      store.dispatch(updateTheme({
        primaryColor: gameUpdate.theme.primaryColor
      }))
      this.reset()
    }

    if(gameUpdate.stages) {
      Object.keys(gameUpdate.stages).forEach((stageId) => {
        const sceneKeys = this.scene.manager.keys
        if(stageId && !sceneKeys[stageId]) {
          const key = stageId
          this.scene.add(key, createGameSceneInstance(key, this.gameRoomInstance));
        }
      })

      const stageUpdate = gameUpdate.stages[this.stage.stageId]

      if(stageUpdate?.gravity) {
        const gravity = stageUpdate.gravity
        const currentGravity = store.getState().gameModel.gameModel.stages[this.stage.stageId].gravity

        if(typeof gravity?.x === 'number' && typeof gravity?.y === 'number') {
          this.stage.setGravity(gravity.x, gravity.y)
        } else if(typeof gravity?.x === 'number') {
          this.stage.setGravity(gravity.x, currentGravity.y)
        } else if(typeof gravity?.y === 'number') {
          this.stage.setGravity(currentGravity.x, gravity.y)
        }
      }

      if(stageUpdate?.color) {
        this.stage.createStageColorLayer()
      }

      if(stageUpdate?.boundaries) {
        // set camera previews zoom
        // set camera bounds
        // set world bounds
        const stageWidth = stageUpdate.boundaries.width
        const stageHeight = stageUpdate.boundaries.height
        const stageX = stageUpdate.boundaries.x
        const stageY = stageUpdate.boundaries.y
        this.cameras.main.setBounds(stageX, stageY, stageWidth, stageHeight)
        this.stage.setBoundaries(stageUpdate.boundaries)
        this.stage.resetStageInstance()

        this.createGrids()
      }

      const entityInstances = stageUpdate?.entityInstances
      if(entityInstances) Object.keys(entityInstances).forEach((entityInstanceId) => {
        const objectUpdate = entityInstances[entityInstanceId]
        const entityInstance = this.getEntityInstance(entityInstanceId)

        if(objectUpdate === null && entityInstance) {
          this.removeEntityInstance(entityInstanceId)
          this._recentlyRemovedEntityInstanceId = entityInstanceId
          return
        }
        if(!entityInstance && objectUpdate) {
          this.addEntityInstance(entityInstanceId, objectUpdate)
          return
        }

        if(typeof objectUpdate.spawnX === 'number' || typeof objectUpdate.spawnY === 'number') {
          entityInstance.physicsSprite.x = objectUpdate.spawnX
          entityInstance.physicsSprite.y = objectUpdate.spawnY
        }

        if(objectUpdate.width && objectUpdate.height) {
            entityInstance.setSize(objectUpdate.width, objectUpdate.height)
        } else if(objectUpdate.width) {
            entityInstance.setSize(objectUpdate.width, entityInstance.height)
        } else if(objectUpdate.height) {
            entityInstance.setSize(entityInstance.width, objectUpdate.height)
        }

      })

      if(stageUpdate?.playerEntityModelId) {
        this.playerInstance.transformEntityModelId = stageUpdate?.playerEntityModelId
      }
    }

    if(gameUpdate.textures) {
      Object.keys(gameUpdate.textures).forEach((textureId) => {
        const layerInstance = this.getLayerInstanceByTextureId(textureId)
        if(layerInstance) {
          layerInstance.updateTexture()
        } else {
          this.load.image(textureId, getImageUrlFromTextureId(textureId));
          this.load.once('complete', () => {
            const gameModel = store.getState().gameModel.gameModel
            Object.keys(gameModel.entityModels).forEach((entityModelId) => {
              const entityModel = gameModel.entityModels[entityModelId]
              if(entityModel.graphics.textureId === textureId) {
                this.forAllEntityInstancesMatchingEntityId(entityModelId, this.resetEntityInstance)
              }
            })
            // console.log('loaded', textureId)
          });
          this.load.start();
        }
      })
    }

    if(gameUpdate.relations || gameUpdate.effects || gameUpdate.events || gameUpdate.collisions) {
      // setTimeout(() => {
        this.reregisterRelationships()
      // }, 100)
    }

    if(gameUpdate.entityModels) Object.keys(gameUpdate.entityModels).forEach((entityModelId) => {
      const entityModelUpdate = gameUpdate.entityModels[entityModelId]
      const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]

      if(entityModelUpdate.collisionResponse?.bounciness >= 0) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setBounce(entityModelUpdate.collisionResponse.bounciness)
        })
      }

      if(entityModelUpdate.collisionResponse?.friction >= 0) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setFriction(entityModelUpdate.collisionResponse.friction)
        })
      }

      if(entityModelUpdate.collisionResponse?.notPushable !== undefined) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setPushable(!entityModelUpdate.collisionResponse.notPushable)
        })
      }


      if(entityModelUpdate.movement?.drag >= 0) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setDrag(entityModelUpdate.movement.drag)
        })
      }

      if(entityModelUpdate.movement?.dragX >= 0) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setDragX(entityModelUpdate.movement.dragX)
        })
      }

      if(entityModelUpdate.movement?.dragAngular >= 0) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setAngularDrag(entityModelUpdate.movement.dragAngular)
        })
      }

      if(entityModelUpdate.movement?.dragY >= 0) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setDragY(entityModelUpdate.movement.dragY)
        })
      }

      if(entityModelUpdate.movement?.gravityY !== undefined) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setGravityY(entityModelUpdate.movement?.gravityY)
        })
      }
      if(entityModelUpdate.movement?.gravityX !== undefined) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setGravityX(entityModelUpdate.movement?.gravityX)
        })
      }

      // if(entityModelUpdate.frictionStatic >= 0) {
      //   this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
      //     entityInstance.setFrictionStatic(entityModelUpdate.frictionStatic)
      //   })
      // }

      // if(entityModel.collisionResponse.useMass && entityModelUpdate.mass >= 0) {
      //   this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
      //     entityInstance.setMass(entityModelUpdate.mass)
      //   })
      // }
      // if(!entityModel.collisionResponse.useMass && entityModelUpdate.density >= 0) {
      //   this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
      //     entityInstance.setDensity(entityModelUpdate.density)
      //   })
      // }

      if(entityModelUpdate.movement?.movementControlsBehavior) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.resetPhysics()
        })
      }

      if(entityModelUpdate.movement?.ignoreGravity !== undefined) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setIgnoreGravity(entityModelUpdate.movement?.ignoreGravity)
        })
      }

      if(entityModelUpdate.collisionResponse?.ignoreSides) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setCollideIgnoreSides(entityModelUpdate.collisionResponse?.ignoreSides)
        })
      }

      if(entityModelUpdate.graphics?.layerId) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          entityInstance.setDepth()
        })
      }

      if(
        entityModelUpdate.editorInterface ||
        entityModelUpdate.graphics?.invisibile !== undefined ||
        entityModelUpdate.boundaryRelation || 
        entityModelUpdate.graphics?.textureId ||
        entityModelUpdate.movement?.movementBehavior !== undefined ||
        entityModelUpdate.movement?.velocityX !== undefined ||
        entityModelUpdate.movement?.velocityY !== undefined ||
        entityModelUpdate.collisionResponse?.ignoreStageBoundaries !== undefined
      ) {
        // setTimeout(() => {
          this.forAllEntityInstancesMatchingEntityId(entityModelId, this.resetEntityInstance)
        // })
      }

      if(entityModelUpdate.graphics?.width && entityModelUpdate.graphics?.height) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
          const width =  entityInstanceData.width || entityModelUpdate.graphics?.width
          const height = entityInstanceData.height || entityModelUpdate.graphics?.height
          entityInstance.setSize(width, height)
        })
      } else if(entityModelUpdate.graphics?.width) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
          const width =  entityInstanceData.width || entityModelUpdate.graphics?.width
          const height = entityInstanceData.height || entityModelUpdate.graphics?.height
          entityInstance.setSize(width, height)
        })
      } else if(entityModelUpdate.graphics?.height) {
        this.forAllEntityInstancesMatchingEntityId(entityModelId, (entityInstance) => {
          const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
          const width =  entityInstanceData.width || entityModelUpdate.graphics?.width
          const height = entityInstanceData.height || entityModelUpdate.graphics?.height
          entityInstance.setSize(width, height)
        })
      }
      
      if(entityModelUpdate.relationTags) {
        this.reregisterRelationships()
      }

      if(entityModelUpdate.camera !== undefined) {
        if(this.playerInstance.entityModelId === entityModelId) {
          // if(entityModelUpdate.camera.zoom) {
          //   this.cameras.main.setZoom(entityModelUpdate.camera.zoom)
          //   this.playerInstance.setZoom(entityModelUpdate.camera.zoom)
          // }
          if(entityModelUpdate.camera.lerpX || entityModelUpdate.camera.lerpY) {
            let lerpX = entityModelUpdate.camera.lerpX ? entityModelUpdate.camera.lerpX : entityModel.camera.lerpX
            let lerpY = entityModelUpdate.camera.lerpY ? entityModelUpdate.camera.lerpY : entityModel.camera.lerpY
            this.cameras.main.setLerp(lerpX, lerpY)
            // this.cameras.main.startFollow(this.playerInstance.physicsSprite, false, entityModelUpdate.camera.lerpX ? entityModelUpdate.camera.lerpX : entityModel.camera.lerpX, entityModelUpdate.camera.lerpY ? entityModelUpdate.camera.lerpY : entityModel.camera.lerpY);
          }
          if(entityModelUpdate.camera.width) {
            this.setPlayerZoom(entityModelUpdate.camera)
          }
        } 


      }
    })
  }

  createGrids() {
    // const gameModel = store.getState().gameModel.gameModel
    // const gameMaxWidth = gameModel.stages[this.stage.stageId].boundaries.maxWidth
    // const gameMaxHeight = gameModel.stages[this.stage.stageId].boundaries.maxHeight
    // this.grid = this.add.grid(0, 0, gameMaxWidth * 4, gameMaxHeight * 4, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    // this.grid2 = this.add.grid(0, 0, gameMaxWidth * 4, gameMaxHeight * 4, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    // this.grid.setDepth(UI_LAYER_DEPTH)
    // this.grid2.setDepth(UI_LAYER_DEPTH)

    if(this.grid) this.grid.destroy()
    if(this.grid2) this.grid2.destroy()

    const boundaries = store.getState().gameModel.gameModel.stages[this.stage.stageId].boundaries
    const nodeSize = store.getState().gameModel.gameModel.size.nodeSize

    const stageWidth = boundaries.width
    const stageHeight = boundaries.height
    const stageX = boundaries.x
    const stageY = boundaries.y
    this.grid = this.add.grid(stageX + stageWidth/2, stageY + stageHeight/2, stageWidth, stageHeight, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    this.grid2 = this.add.grid(stageX + stageWidth/2, stageY + stageHeight/2, stageWidth, stageHeight, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    this.grid.setDepth(UI_LAYER_DEPTH)
    this.grid2.setDepth(UI_LAYER_DEPTH)
  }

  create() {
    if(this.gameState.initialized) {
      this.initializeWithGameState()
    }
  }

  initializeWithGameState() {
    super.initializeWithGameState()
    this.intitialized = true

    this.createGrids()

    const gameModel = store.getState().gameModel.gameModel
    const boundaries = gameModel.stages[this.stage.stageId].boundaries
    const gameMaxWidth = boundaries.maxWidth
    const gameMaxHeight = boundaries.maxHeight

    const { width, height } = getGameModelSize(gameModel)

    const editorCameraJSON = {
      x: 0,
      y: 0,
      width,
      height,
      zoom: 3,
      rotation: 0,
      scrollX: 0,
      scrollY: 0,
      roundPixels: false,
      visible: false,
      backgroundColor: false,
      bounds: {x: 0, y: 0, width: gameMaxWidth, height: gameMaxHeight},
    }

    this.cameras.fromJSON({
      name: 'editor',
      ...editorCameraJSON
    })

    this.editorCamera = this.cameras.getCamera('editor')

    if(!this.gameRoomInstance.isHost) {
      // const keys = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
      this.editorCameraKeys = this.input.keyboard.addKeys({ up: 'Up', left: 'Left', down: 'Down', right: 'Right' });
      const controlConfig = {
        camera: this.editorCamera,
        left: this.editorCameraKeys.left,
        right: this.editorCameraKeys.right,
        up: this.editorCameraKeys.up,
        down: this.editorCameraKeys.down,
        acceleration: 0.03,
        drag: 0.001,
        maxSpeed: 0.5
      };
      this.editorCameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
      this.editorCameraControls.start();

      console.log('we did do this camera thing...')
    }

    this.input.on('pointerover', this.onPointerOver);
    this.input.on('pointerout', this.onPointerOut);
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointerup', this.onPointerUp);
    this.input.on('pointerupoutside', this.onPointerUpOutside);
    this.input.on('pointerdownoutside', this.onPointerDownOutside);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('gameout', this.onPointerLeaveGame, this);
    this.input.on('gameover', this.onPointerOverGame, this);
    this.input.dragDistanceThreshold = 16;
    this.input.on('drag', this.onDragStart);
    this.input.on('dragend', this.onDragEnd);
    this.input.on('wheel', this.onMouseWheel);
    this.input.setTopOnly(false)
    if(!isLocalHost()) this.input.mouse.disableContextMenu()
    this.escKey = this.input.keyboard.addKey('esc');  // Get key object

    // const lobbyInstance = store.getState().lobbyInstance.lobbyInstance
    // if(lobbyInstance.id) {
    //   const me = store.getState().auth.me
    //   const participantRoleIds = Object.keys(lobbyInstance.roles).reduce((roleIds, key) => {
    //     if(lobbyInstance.roles[key].roleCategory  === EXPERIENCE_ROLE_PARTICIPANT) {
    //       roleIds.push(key)
    //     }
    //     return roleIds
    //   }, [])
    //   participantRoleIds.forEach((participantRoleId) => {
    //     const userMongoIds = lobbyInstance.roleIdToUserMongoIds[participantRoleId]
    //     const role = lobbyInstance.roles[participantRoleId]
    //     userMongoIds.forEach((userMongoId) => {
    //       if(userMongoId !== me.id) {
    //         this.remoteEditors.push(
    //           new RemoteEditor(this, { userMongoId, role: role, color: role.color})
    //         )
    //       }
    //     })
    //   })
    // }
  }

  update(time, delta) {
    super.update(time, delta)
    
    if(!this.initialized) return

    if(this.escKey.isDown) {
      if(this.readyForNextEscapeKey) {
        this.readyForNextEscapeKey = false
        const gameViewEditor = getCobrowsingState().gameViewEditor
        if(gameViewEditor.isSnapshotTakerOpen) {
          store.dispatch(closeSnapshotTaker())
        }
        if(gameViewEditor.isBoundaryEditorOpen) {
          store.dispatch(closeBoundaryEditor())
        }

        store.dispatch(clearBrush())
        store.dispatch(clearEntity())
        
        if(this.draggingEntityInstanceId) {
          this.draggingEntityInstanceId = null
        } else if(this.brush) {
          this.destroyBrush()
        } else if(this.stamper) {
          this.destroyStamper()
        } else if(this.snapshotSquare) {
          this.clearSnapshotSquare()
        } else if(this.resizingEntityInstance) {
          store.dispatch(setResizingEntityInstance(null))
        } else {
          // store.dispatch(editGameRoom(this.gameRoomInstance.id, {
          //   gameStatus: PAUSED_STATE
          // }))
        }

        this.brushingCanvas = null
      }
    } else {
      this.readyForNextEscapeKey = true
    }

    // this.remoteEditors.forEach((remoteEditor) => {
    //   const phaserView = store.getState().status.phaserViews[remoteEditor.userMongoId]
    //   if(!remoteEditor.cameraPreview && phaserView) {
    //     remoteEditor.onPhaserViewFound()
    //   } else if(remoteEditor.cameraPreview && phaserView) {
    //     if(remoteEditor.cameraPreview.zoom !== phaserView.cameraZoom) {
    //       remoteEditor.cameraPreview.setZoom(phaserView.cameraZoom)
    //     }
    //     remoteEditor.update()
    //   }
    // })

    const gameRoomInstance = store.getState().gameRoomInstance.gameRoomInstance
    const gameResetVersion = gameRoomInstance.gameResetVersion
    if(gameResetVersion > this.gameResetVersion) {
      this.gameResetVersion = gameResetVersion
      this.reset()
    }

    const gameViewEditor = getCobrowsingState().gameViewEditor
    
    // const cameraZoom = gameViewEditor.isBoundaryEditorOpen ? getCobrowsingState().gameViewEditor.cameraZoom : store.getState().gameViewEditor.cameraZoom
    const cameraZoom = gameViewEditor.cameraZoom
    if(cameraZoom !== this.editorCamera.zoom) {
      this.editorCamera.setZoom(cameraZoom)
      // this.editorCamera.zoomTo(cameraZoom, 100, 'Linear', true)
    }

    const resizingEntityInstanceId = getCobrowsingState().gameViewEditor.resizingEntityInstanceId
    if(resizingEntityInstanceId && !this.resizingEntityInstance) {
      this.onResizeStart(resizingEntityInstanceId)
    } else if(!resizingEntityInstanceId && this.resizingEntityInstance) {
      this.clearResize()
    }

    const entityInstanceIdHovering = getCobrowsingState().hoverPreview.entityInstanceIdHovering
    if(this.resizingEntityInstance) {
      document.body.style.cursor = 'nesw-resize'
    } else if(this.draggingEntityInstanceId) {
      document.body.style.cursor = 'grab'
    } else if(gameViewEditor.isSnapshotTakerOpen) {
      document.body.style.cursor = 'cell'
    } else if(entityInstanceIdHovering) {
      const { isObscured } = getInterfaceIdData(ENTITY_INSTANCE_MOVE_IID)
      if(!isObscured) {
        document.body.style.cursor = 'move'
      }
    } else {
      document.body.style.cursor = 'default'
    }

    // const gameSelector = getCobrowsingState().gameSelector
    // if(!this.isMouseOverGame && gameSelector.brushIdSelectedBrushList) {
    //   if(!isBrushIdEraser(gameSelector.brushIdSelectedBrushList)) {
    //     const brush = this.createBrushFromBrushId(gameSelector.brushIdSelectedBrushList)
    //     this.stage.colorLayer.setVisible(false)
    //     this.backgroundCanvasLayer.setVisible(false)
    //     this.playgroundCanvasLayer.setVisible(false)
    //     this.foregroundCanvasLayer.setVisible(false)
    //     const canvas = this.getLayerInstanceByLayerId(brush.getLayerId())
    //     canvas.setVisible(true)
    //     brush.destroy()
    //   }
    // }

    const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn

    if(isGridViewOn) {
      this.isGridViewOn = true
    } else {
      this.isGridViewOn = false
    }

    if(this.isGridViewOn) {
      if(this.gameRoomInstance.isHost) {
        this.editorCamera.startFollow(this.playerInstance.physicsSprite, false, 0.4, 0.4)
      } else {
        this.editorCameraControls.update(delta)
      }

      this.grid.setVisible(true)
      this.grid2.setVisible(true)
      this.cameras.main.setVisible(false)
      this.editorCamera.setVisible(true)
      // this.cameras.getCamera('mini').setVisible(true)
    } else {
      this.grid.setVisible(false)
      this.grid2.setVisible(false)
      this.cameras.main.setVisible(true)
      this.editorCamera.setVisible(false)
      // this.cameras.getCamera('mini').setVisible(false)
    }
  }

  unload () {
    super.unload()
    this.input.off('pointerover', this.onPointerOver);
    this.input.off('pointerout', this.onPointerOut);
    this.input.off('pointerdown', this.onPointerDown, this);
    this.input.off('pointerup', this.onPointerUp);
    this.input.off('pointerupoutside', this.onPointerUpOutside);
    this.input.off('pointerdownoutside', this.onPointerDownOutside);
    this.input.off('pointermove', this.onPointerMove, this);
    this.input.off('gameout', this.onPointerLeaveGame, this);
    this.input.off('gameover', this.onPointerOverGame, this);
    this.input.off('drag', this.onDragStart);
    this.input.off('dragend', this.onDragEnd);
    this.input.off('wheel', this.onMouseWheel);
    this.input.keyboard.disableGlobalCapture()
    
    if(this.editorCameraKeys) {
      this.input.keyboard.removeKey(this.editorCameraKeys.up)
      this.input.keyboard.removeKey(this.editorCameraKeys.down)
      this.input.keyboard.removeKey(this.editorCameraKeys.left)
      this.input.keyboard.removeKey(this.editorCameraKeys.right)
    }

    this.input.keyboard.removeKey(this.escKey)
    // this.remoteEditors.forEach((remoteEditor) => {
    //   remoteEditor.destroy()
    // })
  }
}

