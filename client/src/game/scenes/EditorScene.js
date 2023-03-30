import Phaser from 'phaser';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/game/gameModelActions';
import { openContextMenuFromEntityInstance, openStageContextMenu } from '../../store/actions/game/contextMenuActions';
import { isBrushIdColor, isBrushIdEraser, snapObjectXY } from '../../utils/editorUtils';
import { clearBrush, clearClass } from '../../store/actions/game/gameSelectorActions';
import { closeSnapshotTaker, changeEditorCameraZoom } from '../../store/actions/game/gameViewEditorActions';
import { PLAYER_INSTANCE_ID_PREFIX, OBJECT_INSTANCE_ID_PREFIX, UI_LAYER_DEPTH, STAGE_LAYER_ID, PAUSED_STATE, EVENT_SPAWN_CLASS_DRAG_FINISH, initialCameraZoneClassId, initialStageZoneClassId, LAYER_GROUP_ID_BACKGROUND, LAYER_GROUP_ID_PLAYGROUND, LAYER_GROUP_ID_FOREGROUND } from '../constants';
import { TexturePencil } from '../drawing/TexturePencil';
import { Eraser } from '../drawing/Eraser';
import { ClassStamper } from '../drawing/ClassStamper';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { RemoteEditor } from '../entities/RemoteEditor';
import { ColorPencil } from '../drawing/ColorPencil';
import { gameSize, nodeSize } from '../constants';
import { getImageUrlFromTextureId, urlToFile } from '../../utils/utils';
import { generateUniqueId, getThemePrimaryColor, isLocalHost } from '../../utils/webPageUtils';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import { createGameSceneInstance } from '../../utils/gameUtils';
import { addSnackbar } from '../../store/actions/snackbarActions';
import { CONTEXT_MENU_INSTANCE_MOVE_IID } from '../../constants/interfaceIds';
import { addCanvasImage, uploadCanvasImageAndAddToGameModel } from '../../store/actions/media/canvasImageActions';
import { updateTheme } from '../../store/actions/themeActions';
import { ON_GAME_INSTANCE_EVENT } from '../../store/types';
import { changeInstanceHovering } from '../../store/actions/game/hoverPreviewActions';
import { IMAGE_TYPE_SNAPSHOT } from '../../constants';

export class EditorScene extends GameInstance {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance

    this.draggingEntityInstanceId = null
    this.canvas = null
    this.brush = null 
    this.stamper = null
    this.gameResetDate = Date.now()
    this.isGridViewOn = true
    this.editorCamera = null
    this.remoteEditors = []

    this.snapshotSquare = null 
    this.snapshotStartPos = null
    this.snapshotEndPos = null
    this.isEditor = true
    this.readyForNextEscapeKey = true
    this.isMouseOverGame = false
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // DRAG
  ////////////////////////////////////////////////////////////
  onDragStartContextMenu = (entityInstanceId) => {
    this.draggingEntityInstanceId = entityInstanceId
    this.isDragFromContext = true
    if(!document.body.style.cursor) document.body.style.cursor = 'grab'
  }

  onDragStart = (pointer, entitySprite, dragX, dragY) => {
    const { isObscured } = getInterfaceIdData(CONTEXT_MENU_INSTANCE_MOVE_IID)
    if(isObscured) {
      return
    }

    // if(entitySprite.effectSpawned) return

    this.isDragFromContext = false
    if(!document.body.style.cursor) document.body.style.cursor = 'grab'

    if(this.draggingEntityInstanceId) {
      this.continueDrag(entitySprite, {x: dragX, y: dragY})
    } else if(!this.brush && !this.stamper){
      this.draggingEntityInstanceId = entitySprite.entityInstanceId
    }
  }

  continueDrag(phaserInstance, {x, y}) {
    const entityClassId = this.getEntityInstance(this.draggingEntityInstanceId).entityClassId
    const entityClass= store.getState().gameModel.gameModel.entityClasses[entityClassId]
    const { clampedX, clampedY } = snapObjectXY({x, y,  entityClass})
    phaserInstance.x = clampedX;
    phaserInstance.y = clampedY;
  }

  finishDrag(entitySprite) {
    document.body.style.cursor = null
    if(entitySprite.effectSpawned) {
      window.socket.emit(ON_GAME_INSTANCE_EVENT, {
        gameRoomInstanceId: this.gameRoomInstance.id, 
        gameInstanceEventType: EVENT_SPAWN_CLASS_DRAG_FINISH,
        data: {
          x: entitySprite.x,
          y: entitySprite.y,
          entityInstanceId: entitySprite.entityInstanceId,
          hostOnly: true
        }
      })

      return
    }

    if(entitySprite.entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
      // store.dispatch(editGameModel({ 
      //   player: {
      //     spawnX: entitySprite.x,
      //     spawnY: entitySprite.y
      //   }
      // }))
    } else {
      store.dispatch(editGameModel({ 
        stages: {
          [this.stage.stageId]: {
            entityInstances: {
              [entitySprite.entityInstanceId]: {
                spawnX: entitySprite.x,
                spawnY: entitySprite.y
              }
            }
          }
        }
      }))
    }
  }

  onDragEnd = (pointer, entitySprite) => {
    this.finishDrag(entitySprite)
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
    const phaserInstance = this.resizingEntityInstance.phaserInstance
    const boundaries = store.getState().gameModel.gameModel.stages[this.stage.stageId].boundaries
    // const distance = Phaser.Math.Distance.Between(phaserInstance.x, phaserInstance.y, pointer.worldX, pointer.worldY)
    const distanceW = Phaser.Math.Snap.To(Math.abs(phaserInstance.x - pointer.worldX), nodeSize)
    const distanceH = Phaser.Math.Snap.To(Math.abs(phaserInstance.y - pointer.worldY), nodeSize)
    // const gridx = boundaries.x
    // const gridy = boundaries.y
    // const gridwidth = gridx + boundaries.width
    // const gridheight = gridy + boundaries.height

    let width;
    let height;
    if(pointer.event.shiftKey) {
      width = Phaser.Math.Clamp(distanceW, nodeSize, boundaries.width)
      height = Phaser.Math.Clamp(distanceH, nodeSize, boundaries.height)
    } else {
      width = Phaser.Math.Clamp(distanceW * 2, nodeSize, boundaries.width)
      height = Phaser.Math.Clamp(distanceH * 2, nodeSize, boundaries.height)
    }

    const entityClass = this.getEntityClass(this.resizingEntityInstance.entityClassId)
    if(entityClass.editorInterface.fixedAspectRatio) {
      height = width
    }

    this.forAllEntityInstancesMatchingClassId(phaserInstance.entityClassId, (object) => {
      object.setSize(width, height)
    })
  }

  clearResize() {
    const phaserInstance = this.resizingEntityInstance.phaserInstance
    const entityClass = store.getState().gameModel.gameModel.entityClasses[phaserInstance.entityClassId];
    this.forAllEntityInstancesMatchingClassId(phaserInstance.entityClassId, (object) => {
      object.setSize(entityClass.graphics.width, entityClass.graphics.height)
    })
    this.resizingEntityInstance = null
  }

  onResizeEnd = (pointer) => {
    const phaserInstance = this.resizingEntityInstance.phaserInstance
    if(phaserInstance.entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
      store.dispatch(editGameModel({ 
        // player: {
        //   spawnX: phaserInstance.x,
        //   spawnY: phaserInstance.y
        // },
        entityClasses: {
          [phaserInstance.entityClassId]: {
            graphics: {
              width: phaserInstance.displayWidth,
              height: phaserInstance.displayHeight
            }
          }
        }
      }))
    } else {
      store.dispatch(editGameModel({ 
        stages: {
          [this.stage.stageId]: {
            entityInstances: {
              [phaserInstance.entityInstanceId]: {
                spawnX: phaserInstance.x,
                spawnY: phaserInstance.y
              }
            },
          }
        },
        entityClasses: {
          [phaserInstance.entityClassId]: {
            graphics: {
              width: phaserInstance.displayWidth,
              height: phaserInstance.displayHeight
            }
          } 
        }
      }))
    }

    this.resizingEntityInstance = null
  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // POINTER
  ////////////////////////////////////////////////////////////
  onPointerMove = (pointer)  => {
    window.pointer = pointer

    const gameViewEditor = getCobrowsingState().gameViewEditor
    const gameSelector = getCobrowsingState().gameSelector
    const brushId = gameSelector.brushIdSelectedBrushList
    const entityClassId = gameSelector.entityClassIdSelectedClassList
    const gameModel = store.getState().gameModel.gameModel

    if(this.resizingEntityInstance) {
      this.onResizeMove(pointer)
      return
    }

    if(this.isDragFromContext && this.draggingEntityInstanceId) {
      const instance = this.getEntityInstance(this.draggingEntityInstanceId)
      this.continueDrag(instance.phaserInstance, {x: pointer.worldX, y: pointer.worldY})
    }
    

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // SNAPSHOT
    ////////////////////////////////////////////////////////////
    if(this.snapshotSquare && !this.snapshotSquare.finalized) {
      if(!gameViewEditor.isSnapshotTakerOpen) {
        this.clearSnapshotSquare()
       } else {
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
      this.brush.update(pointer)
    }
    if(this.canvas && pointer.isDown) {
      this.brush.stroke(pointer, this.canvas)
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // STAMPERS
    ////////////////////////////////////////////////////////////
    if((!entityClassId && this.stamper) || (this.stamper && (this.stamper.entityClassId !== entityClassId))) {
      this.destroyStamper()
    }
    if(entityClassId && !this.stamper) {
      const entityClass = gameModel.entityClasses[entityClassId]
      this.stamper = new ClassStamper(this, entityClassId, entityClass)
    }
    if(this.stamper) {
      this.stamper.update(pointer)
    }
  }

  onPointerOver = (pointer, entitySprite) => {
    if(this.draggingEntityInstanceId) return
    // const { isObscured } = getInterfaceIdData(CONTEXT_MENU_INSTANCE_MOVE_IID)
    //isObscured ||

    // if(this.brush || this.stamper || this.snapshotSquare || this.getEntityClass(entitySprite[0].entityClassId).editorInterface.notSelectableInStage) {
    //   return
    // }

    const entityInstanceIdHovering = store.getState().hoverPreview.entityInstanceIdHovering
    const phaserInstance = entitySprite[0]
    if(phaserInstance.entityInstanceId !== entityInstanceIdHovering && phaserInstance.visible) {
      store.dispatch(changeInstanceHovering(phaserInstance.entityInstanceId, phaserInstance.entityClassId, { isSpawned: phaserInstance.effectSpawned }))
    }

    phaserInstance.isMouseOver = true
    // if(entitySprite.effectSpawned) return
    // if(!document.body.style.cursor) document.body.style.cursor = 'grab'
  }

  onPointerDownOutside = (pointer) => {
    if(pointer.leftButtonDown()) {
      if(this.resizingEntityInstance) {
        this.onResizeEnd()
      }
    }
  }

  clearSnapshotSquare() {
    this.snapshotSquare.clear()
    this.snapshotSquare.destroy()
    this.snapshotSquare = null 
    this.snapshotStartPos = null
  }

  drawVisibleLayerGroupToRenderTexture(layerGroupId, renderTexture) {
    const gameViewEditor = getCobrowsingState().gameViewEditor
    this.layerInstancesByLayerGroupId[layerGroupId].forEach((layerInstance) => {
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

    this.drawVisibleLayerGroupToRenderTexture(LAYER_GROUP_ID_BACKGROUND, renderTexture)
    this.drawVisibleLayerGroupToRenderTexture(LAYER_GROUP_ID_PLAYGROUND, renderTexture)

    // if(!gameViewEditor.layerInvisibility[PLAYER_INSTANCE_CANVAS_ID] && !gameViewEditor.layerInvisibility[BASIC_CLASS] && !gameViewEditor.layerInvisibility[NPC_CLASS] ) {
      renderTexture.draw(this.entityInstanceGroup, 0,0)
    // }
    this.drawVisibleLayerGroupToRenderTexture(LAYER_GROUP_ID_FOREGROUND, renderTexture)
  }

  takeSnapshotWithSquare() {
    if(!this.snapshotSquare.finalized) return false
    const gameModel = store.getState().gameModel.gameModel
    const gameViewEditor = getCobrowsingState().gameViewEditor
    const boundaries = gameModel.stages[this.stage.stageId].boundaries
    const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, boundaries.maxWidth, boundaries.maxHeight);

    this.drawVisibleSceneToRenderTexture(snapCanvas)

    snapCanvas.snapshotArea(
      Math.floor(this.snapshotStartPos.x - 2), Math.floor(this.snapshotStartPos.y - 2), 
      Math.floor((this.snapshotEndPos.x)), 
      Math.floor((this.snapshotEndPos.y)), 
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
          userId: gameModel.owner.id,
        }))

        await store.dispatch(uploadCanvasImageAndAddToGameModel({imageFile, textureId, imageType: IMAGE_TYPE_SNAPSHOT}))

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

  onPointerDown = (pointer, phaserInstances) => {
    const clickDelay = this.time.now - this.lastClick;
    this.lastClick = this.time.now;
    if(clickDelay < 350) {
      this.onDoubleClick(pointer)
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

      const hoveringInstances = phaserInstances.filter((phaserInstance) => {
        return !!phaserInstance.visible
      })
      
      if(hoveringInstances.length) {
        store.dispatch(openContextMenuFromEntityInstance(phaserInstances, pointer.event))
      } else {
        store.dispatch(openStageContextMenu(pointer.event))
      }
    }

    if(pointer.leftButtonDown()) {

      if(this.draggingEntityInstanceId && this.isDragFromContext) {
        this.finishDrag(this.getEntityInstance(this.draggingEntityInstanceId).phaserInstance)
      }

      if(this.resizingEntityInstance) {
        this.onResizeEnd()
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
        const canvas = this.getLayerInstanceById(this.brush.getLayerId())
        this.canvas = canvas
        this.brush.stroke(pointer, this.canvas)
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
    if(this.stamper && pointer.leftButtonReleased() && !this.draggingEntityInstanceId) {
      this.stamper.stamp(pointer)
      if(!pointer.event.shiftKey) {
        this.destroyStamper()
        store.dispatch(clearClass())
      }
    }
    
    this.draggingEntityInstanceId = null

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onPointerOverGame = () => {
    this.isMouseOverGame = true
  }

  onPointerLeaveGame = () => {
    // without !this.canvas check we end up with discrepencies in codrawing
    if(this.brush && !this.canvas) this.destroyBrush()
    if(this.stamper) this.destroyStamper()
    store.dispatch(changeInstanceHovering(null, null))
    this.isMouseOverGame = false
  }

  onPointerOut = (pointer, entitySprite) => {
    const phaserInstance = entitySprite[0]
    phaserInstance.isMouseOver = false
    store.dispatch(changeInstanceHovering(null, null))
    const { isObscured } = getInterfaceIdData(CONTEXT_MENU_INSTANCE_MOVE_IID)
    if(isObscured) {
      return
    }
    // if(document.body.style.cursor === 'grab') document.body.style.cursor = null
  }

  onPointerUpOutside = (pointer)  => {
    this.draggingEntityInstanceId = null

    if(this.snapshotSquare && !this.snapshotSquare.finalized) {
      this.snapshotSquare.finalized = true 
      return
    }

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onDoubleClick = (pointer) => {
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
    if(this.canvas.createCollisionBody) this.canvas.createCollisionBody()
    this.canvas = null;
  }

  getEntityInstanceData(entityInstanceId) {
    const gameModel = store.getState().gameModel.gameModel

    if(entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
      return gameModel.player
    }
    return gameModel.stages[this.stage.stageId].entityInstances[entityInstanceId]
  }

  addEntityInstanceData(entityClassId, {spawnX, spawnY}) {
    const entityInstanceId = OBJECT_INSTANCE_ID_PREFIX+generateUniqueId()

    const entityInstanceData = {
      entityClassId,
      spawnX,
      spawnY,
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

    this.addEntityInstance(entityInstanceId, entityInstanceData)
  }

  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // NETWORK UPDATE
  ////////////////////////////////////////////////////////////
  onGameModelUpdate = (gameUpdate) => {
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
        const gameWidth = stageUpdate.boundaries.width
        const gameHeight = stageUpdate.boundaries.height
        const gameX = stageUpdate.boundaries.x
        const gameY = stageUpdate.boundaries.y
        this.cameras.main.setBounds(gameX, gameY, gameWidth, gameHeight)
        this.stage.setBoundaries(stageUpdate.boundaries)
        this.forAllEntityInstancesMatchingClassId(initialStageZoneClassId, (entityInstance) => {
          const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
          this.removeEntityInstance(entityInstance.entityInstanceId)
          this.addEntityInstance(entityInstance.entityInstanceId, entityInstanceData)
        })

        this.createGrids()
      }

      const entityInstances = stageUpdate?.entityInstances
      if(entityInstances) Object.keys(entityInstances).forEach((entityInstanceId) => {
        const objectUpdate = entityInstances[entityInstanceId]
        const entityInstance = this.getEntityInstance(entityInstanceId)
        if(!entityInstance) {
          this.addEntityInstance(entityInstanceId, objectUpdate)
          return
        }
        if(objectUpdate === null) {
          this.removeEntityInstance(entityInstanceId)
          return
        }
        
        if(typeof objectUpdate.spawnX === 'number' || typeof objectUpdate.spawnY === 'number') {
          entityInstance.phaserInstance.x = objectUpdate.spawnX
          entityInstance.phaserInstance.y = objectUpdate.spawnY
        }
      })

      if(stageUpdate?.playerClassId) {
        this.playerInstance.transformEntityClassId = stageUpdate?.playerClassId
      }
    }

    if(gameUpdate.textures) {
      Object.keys(gameUpdate.textures).forEach((textureId) => {
        const layerInstance = this.getLayerInstanceByTextureId(textureId)
        if(layerInstance) {
          layerInstance.updateTexture()
        } else {
          this.load.image(textureId, getImageUrlFromTextureId(textureId));
          this.load.once('complete', (textureIdk) => {
            console.log('loaded', textureId)
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

    if(gameUpdate.entityClasses) Object.keys(gameUpdate.entityClasses).forEach((entityClassId) => {
      const classUpdate = gameUpdate.entityClasses[entityClassId]
      const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]

      if(classUpdate.collisionResponse?.bounciness >= 0) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setBounce(classUpdate.collisionResponse.bounciness)
        })
      }

      if(classUpdate.collisionResponse?.friction >= 0) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setFriction(classUpdate.collisionResponse.friction)
        })
      }

      if(classUpdate.collisionResponse?.notPushable !== undefined) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setPushable(!classUpdate.collisionResponse.notPushable)
        })
      }


      if(classUpdate.movement?.drag >= 0) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setDrag(classUpdate.movement.drag)
        })
      }

      if(classUpdate.movement?.dragX >= 0) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setDragX(classUpdate.movement.dragX)
        })
      }

      if(classUpdate.movement?.dragAngular >= 0) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setAngularDrag(classUpdate.movement.dragAngular)
        })
      }

      if(classUpdate.movement?.dragY >= 0) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setDragY(classUpdate.movement.dragY)
        })
      }

      if(classUpdate.movement?.gravityY !== undefined) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setGravityY(classUpdate.movement?.gravityY)
        })
      }
      if(classUpdate.movement?.gravityX !== undefined) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setGravityX(classUpdate.movement?.gravityX)
        })
      }

      // if(classUpdate.frictionStatic >= 0) {
      //   this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
      //     entityInstance.setFrictionStatic(classUpdate.frictionStatic)
      //   })
      // }

      // if(entityClass.collisionResponse.useMass && classUpdate.mass >= 0) {
      //   this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
      //     entityInstance.setMass(classUpdate.mass)
      //   })
      // }
      // if(!entityClass.collisionResponse.useMass && classUpdate.density >= 0) {
      //   this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
      //     entityInstance.setDensity(classUpdate.density)
      //   })
      // }

      if(classUpdate.movement?.movementControlsBehavior) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.resetPhysics()
        })
      }

      if(classUpdate.movement?.ignoreGravity !== undefined) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setIgnoreGravity(classUpdate.movement?.ignoreGravity)
        })
      }

      if(classUpdate.collisionResponse?.ignoreSides) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setCollideIgnoreSides(classUpdate.collisionResponse?.ignoreSides)
        })
      }


      if(
        classUpdate.editor ||
        classUpdate.graphics?.invisibile !== undefined ||
        classUpdate.boundaryRelation || 
        classUpdate.graphics?.textureId ||
        classUpdate.movement?.movementBehavior !== undefined ||
        classUpdate.movement?.velocityX !== undefined ||
        classUpdate.movement?.velocityY !== undefined ||
        classUpdate.collisionResponse?.ignoreStageBoundaries !== undefined
      ) {
        // setTimeout(() => {
          this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
            if(entityInstance.entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
              this.removePlayerInstance()
              this.addPlayerInstance()
              return
            }
            const entityInstanceData = this.getEntityInstanceData(entityInstance.entityInstanceId)
            this.removeEntityInstance(entityInstance.entityInstanceId)
            this.addEntityInstance(entityInstance.entityInstanceId, entityInstanceData)
          })
        // })
      }

      if(classUpdate.graphics?.width && classUpdate.graphics?.height) {
        if(entityClassId === initialCameraZoneClassId) {
          this.setPlayerZoom({...classUpdate.graphics})
        }
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setSize(classUpdate.graphics?.width, classUpdate.graphics?.height)
        })
      } else if(classUpdate.graphics?.width) {
        if(entityClassId === initialCameraZoneClassId) {
          this.setPlayerZoom({width: classUpdate.graphics.width, height: entityClass.graphics?.height})
        }

        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setSize(classUpdate.graphics?.width, entityClass.graphics?.height)
        })
      } else if(classUpdate.graphics?.height) {
        this.forAllEntityInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setSize(entityClass.graphics?.width, classUpdate.graphics?.height)
        })
      }
      
      if(classUpdate.relationTags) {
        this.reregisterRelationships()
      }

      if(classUpdate.camera !== undefined) {
        if(this.playerInstance.entityClassId === entityClassId) {
          // if(classUpdate.camera.zoom) {
          //   this.cameras.main.setZoom(classUpdate.camera.zoom)
          //   this.playerInstance.setZoom(classUpdate.camera.zoom)
          // }
          if(classUpdate.camera.lerpX || classUpdate.camera.lerpY) {
            let lerpX = classUpdate.camera.lerpX ? classUpdate.camera.lerpX : entityClass.camera.lerpX
            let lerpY = classUpdate.camera.lerpY ? classUpdate.camera.lerpY : entityClass.camera.lerpY
            this.cameras.main.setLerp(lerpX, lerpY)
            // this.cameras.main.startFollow(this.playerInstance.phaserInstance, false, classUpdate.camera.lerpX ? classUpdate.camera.lerpX : entityClass.camera.lerpX, classUpdate.camera.lerpY ? classUpdate.camera.lerpY : entityClass.camera.lerpY);
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

    const gameWidth = boundaries.width
    const gameHeight = boundaries.height
    const gameX = boundaries.x
    const gameY = boundaries.y
    this.grid = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    this.grid2 = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    this.grid.setDepth(UI_LAYER_DEPTH)
    this.grid2.setDepth(UI_LAYER_DEPTH)
  }

  create() {
    super.create()

    this.createGrids()

    const gameModel = store.getState().gameModel.gameModel
    const boundaries = gameModel.stages[this.stage.stageId].boundaries
    const gameMaxWidth = boundaries.maxWidth
    const gameMaxHeight = boundaries.maxHeight
    
    const editorCameraJSON = {
      x: 0,
      y: 0,
      width: gameSize,
      height: gameSize,
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
    if(!isLocalHost()) this.input.mouse.disableContextMenu()
    this.escKey = this.input.keyboard.addKey('esc');  // Get key object

    const lobbyInstance = store.getState().lobbyInstance.lobbyInstance
    if(lobbyInstance.id) {
      const me = store.getState().auth.me
      lobbyInstance.members.forEach(({id}) => {
        if(id !== me.id && lobbyInstance.participantId === id) {
          this.remoteEditors.push(
            new RemoteEditor(this, { userId: id, color: 0xFF0000})
          )
        }
      })
    }
  }

  update(time, delta) {
    super.update(time, delta)

    // this.cameraControls.update(delta)

    if(this.escKey.isDown) {
      if(this.readyForNextEscapeKey) {
        this.readyForNextEscapeKey = false
        store.dispatch(clearBrush())
        store.dispatch(clearClass())
        if(this.draggingEntityInstanceId) {
          this.draggingEntityInstanceId = null
        } else if(this.brush) {
          this.destroyBrush()
        } else if(this.stamper) {
          this.destroyStamper()
        } else if(this.snapshotSquare) {
          this.clearSnapshotSquare()
        } else if(this.resizingEntityInstance) {
          this.clearResize()
        } else {
          // store.dispatch(editGameRoom(this.gameRoomInstance.id, {
          //   gameState: PAUSED_STATE
          // }))
        }
        this.canvas = null
      }
    } else {
      this.readyForNextEscapeKey = true
    }

    this.remoteEditors.forEach((remoteEditor) => {
      const phaserView = store.getState().status.phaserViews[remoteEditor.userId]
      if(!remoteEditor.cameraPreview && phaserView) {
        remoteEditor.onPhaserViewFound()
      } else if(remoteEditor.cameraPreview && phaserView) {
        if(remoteEditor.cameraPreview.zoom !== phaserView.cameraZoom) {
          remoteEditor.cameraPreview.setZoom(phaserView.cameraZoom)
        }
        remoteEditor.update()
      }
    })

    const gameRoomInstance = store.getState().gameRoomInstance.gameRoomInstance
    const gameResetDate = gameRoomInstance.gameResetDate
    if(gameResetDate > this.gameResetDate) {
      this.gameResetDate = gameResetDate
      this.reset()
    }

    const gameViewEditor = store.getState().gameViewEditor
    
    const cameraZoom = gameViewEditor.isSectionEditorOpen ? getCobrowsingState().gameViewEditor.cameraZoom : store.getState().gameViewEditor.cameraZoom
    if(cameraZoom !== this.editorCamera.zoom) {
      this.editorCamera.setZoom(cameraZoom)
      // this.editorCamera.zoomTo(cameraZoom, 100, 'Linear', true)
    }

    const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
    if(isGridViewOn) {
      this.isGridViewOn = true
    } else {
      this.isGridViewOn = false
    }

    // const gameSelector = getCobrowsingState().gameSelector
    // if(!this.isMouseOverGame && gameSelector.brushIdSelectedBrushList) {
    //   if(!isBrushIdEraser(gameSelector.brushIdSelectedBrushList)) {
    //     const brush = this.createBrushFromBrushId(gameSelector.brushIdSelectedBrushList)
    //     this.stage.colorLayer.setVisible(false)
    //     this.backgroundCanvasLayer.setVisible(false)
    //     this.playgroundCanvasLayer.setVisible(false)
    //     this.foregroundCanvasLayer.setVisible(false)
    //     const canvas = this.getLayerInstanceById(brush.getLayerId())
    //     canvas.setVisible(true)
    //     brush.destroy()
    //   }
    // }

    if(this.isGridViewOn) {
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

  unload() {
    super.unload()
    this.remoteEditors.forEach((remoteEditor) => {
      remoteEditor.destroy()
    })
  }
}

