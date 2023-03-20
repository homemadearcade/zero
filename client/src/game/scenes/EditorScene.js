import Phaser from 'phaser';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/gameModelActions';
import { openContextMenuFromObjectInstance, openStageContextMenu } from '../../store/actions/contextMenuActions';
import { isBrushIdColor, isBrushIdEraser, snapObjectXY } from '../../utils/editorUtils';
import { clearBrush, clearClass } from '../../store/actions/gameSelectorActions';
import { closeSnapshotTaker, changeEditorCameraZoom } from '../../store/actions/gameViewEditorActions';
import { PLAYER_INSTANCE_ID_PREFIX, OBJECT_INSTANCE_ID_PREFIX, UI_CANVAS_DEPTH, BACKGROUND_LAYER_CANVAS_ID, STAGE_BACKGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_ID, FOREGROUND_LAYER_CANVAS_ID, PAUSED_STATE, EVENT_SPAWN_CLASS_DRAG_FINISH } from '../constants';
import { TexturePencil } from '../drawing/TexturePencil';
import { Eraser } from '../drawing/Eraser';
import { ClassStamper } from '../drawing/ClassStamper';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { RemoteEditor } from '../entities/RemoteEditor';
import { ColorPencil } from '../drawing/ColorPencil';
import { gameSize, nodeSize } from '../constants';
import { urlToFile } from '../../utils/utils';
import { generateUniqueId, getThemePrimaryColor, isLocalHost } from '../../utils/webPageUtils';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import { createGameSceneInstance } from '../../utils/gameUtils';
import { addSnackbar } from '../../store/actions/snackbarActions';
import { CONTEXT_MENU_INSTANCE_MOVE_IID } from '../../constants/interfaceIds';
import { addCanvasImage, saveCanvasImage } from '../../store/actions/canvasImageActions';
import { updateTheme } from '../../store/actions/themeActions';
import { ON_GAME_INSTANCE_EVENT } from '../../store/types';
import { changeInstanceHovering } from '../../store/actions/hoverPreviewActions';
import { IMAGE_TYPE_SNAPSHOT } from '../../constants';

export class EditorScene extends GameInstance {
  constructor(props) {
    super(props);

    this.gameRoom = props.gameRoom

    this.draggingObjectInstanceId = null
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
    this.draggingObjectInstanceId = entityInstanceId
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

    if(this.draggingObjectInstanceId) {
      this.continueDrag(entitySprite, {x: dragX, y: dragY})
    } else if(!this.brush && !this.stamper){
      this.draggingObjectInstanceId = entitySprite.entityInstanceId
    }
  }

  continueDrag(phaserInstance, {x, y}) {
    const entityClassId = this.getObjectInstance(this.draggingObjectInstanceId).entityClassId
    const entityClass= store.getState().gameModel.gameModel.entityClasses[entityClassId]
    const { clampedX, clampedY } = snapObjectXY({x, y,  entityClass})
    phaserInstance.x = clampedX;
    phaserInstance.y = clampedY;
  }

  finishDrag(entitySprite) {
    document.body.style.cursor = null
    if(entitySprite.effectSpawned) {
      window.socket.emit(ON_GAME_INSTANCE_EVENT, {
        gameRoomId: this.gameRoom.id, 
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
    this.resizingObjectInstance = this.getObjectInstance(entityInstanceId)
  }

  onResizeMove = (pointer) => {
    const phaserInstance = this.resizingObjectInstance.phaserInstance
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

    this.forAllObjectInstancesMatchingClassId(phaserInstance.entityClassId, (object) => {
      object.setSize(width, height)
    })
  }

  clearResize() {
    const phaserInstance = this.resizingObjectInstance.phaserInstance
    const entityClass = store.getState().gameModel.gameModel.entityClasses[phaserInstance.entityClassId];
    this.forAllObjectInstancesMatchingClassId(phaserInstance.entityClassId, (object) => {
      object.setSize(entityClass.graphics.width, entityClass.graphics.height)
    })
    this.resizingObjectInstance = null
  }

  onResizeEnd = (pointer) => {
    const phaserInstance = this.resizingObjectInstance.phaserInstance
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

    this.resizingObjectInstance = null
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

    if(this.resizingObjectInstance) {
      this.onResizeMove(pointer)
      return
    }

    if(this.isDragFromContext && this.draggingObjectInstanceId) {
      const instance = this.getObjectInstance(this.draggingObjectInstanceId)
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
    if(this.draggingObjectInstanceId) return
    // const { isObscured } = getInterfaceIdData(CONTEXT_MENU_INSTANCE_MOVE_IID)
    //isObscured ||
    if(this.brush || this.stamper || this.snapshotSquare) {
      return
    }

    const entityInstanceIdHovering = store.getState().hoverPreview.entityInstanceIdHovering
    const phaserInstance = entitySprite[0]
    if(phaserInstance.entityInstanceId !== entityInstanceIdHovering) {
      store.dispatch(changeInstanceHovering(phaserInstance.entityInstanceId, phaserInstance.entityClassId, { isSpawned: phaserInstance.effectSpawned }))
    }

    phaserInstance.isHoveringOver = true
    // if(entitySprite.effectSpawned) return
    // if(!document.body.style.cursor) document.body.style.cursor = 'grab'
  }

  onPointerDownOutside = (pointer) => {
    if(pointer.leftButtonDown()) {
      if(this.resizingObjectInstance) {
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

  takeSnapshotWithSquare() {
    if(!this.snapshotSquare.finalized) return false
    const gameModel = store.getState().gameModel.gameModel
    const gameViewEditor = getCobrowsingState().gameViewEditor
    const boundaries = gameModel.stages[this.stage.stageId].boundaries
    const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, boundaries.maxWidth, boundaries.maxHeight);
    
    if(!gameViewEditor.layerInvisibility[STAGE_BACKGROUND_LAYER_CANVAS_ID]) {
      snapCanvas.draw(this.stage.backgroundColorLayer, 0,0)
    }
    if(!gameViewEditor.layerInvisibility[BACKGROUND_LAYER_CANVAS_ID]) {
      snapCanvas.draw(this.backgroundCanvasLayer, 0,0)
    }
    if(!gameViewEditor.layerInvisibility[PLAYGROUND_LAYER_CANVAS_ID]) {
      snapCanvas.draw(this.playgroundCanvasLayer, 0,0)
    }
    // if(!gameViewEditor.layerInvisibility[PLAYER_INSTANCE_CANVAS_ID] && !gameViewEditor.layerInvisibility[BASIC_CLASS] && !gameViewEditor.layerInvisibility[NPC_CLASS] ) {
      snapCanvas.draw(this.entityInstanceGroup, 0,0)
    // }
    if(!gameViewEditor.layerInvisibility[FOREGROUND_LAYER_CANVAS_ID]) {
      snapCanvas.draw(this.foregroundCanvasLayer, 0,0)
    }
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

        await store.dispatch(addCanvasImage({
          textureId: textureId, 
          imageType: IMAGE_TYPE_SNAPSHOT,
          userId: store.getState().auth.me.id,
          arcadeGame: store.getState().gameModel.gameModel?.id
        }))

        await store.dispatch(saveCanvasImage({imageFile, textureId, imageType: IMAGE_TYPE_SNAPSHOT}))

        store.dispatch(addSnackbar({
          message: 'Snapshot Saved!',
          imageUrl: window.awsUrl + textureId
        }))
      }
    );
    this.clearSnapshotSquare()
    store.dispatch(closeSnapshotTaker())
    return true
  }

  onPointerDown = (pointer, entityInstances) => {
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

      if(entityInstances.length) {
        store.dispatch(openContextMenuFromObjectInstance(entityInstances, pointer.event))
      } else {
        store.dispatch(openStageContextMenu(pointer.event))
      }
    }

    if(pointer.leftButtonDown()) {

      if(this.draggingObjectInstanceId && this.isDragFromContext) {
        this.finishDrag(this.getObjectInstance(this.draggingObjectInstanceId).phaserInstance)
      }

      if(this.resizingObjectInstance) {
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

        this.snapshotSquare = this.add.graphics().setDepth(UI_CANVAS_DEPTH);
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
        const canvas = this.getLayerCanvasInstanceById(this.brush.getCanvasId())
        this.canvas = canvas
        this.brush.stroke(pointer, this.canvas)
      }
    }
  }

  getImageFromGame(fileId) {
    return new Promise((resolve, reject) => {

      try {
        const gameModel = store.getState().gameModel.gameModel
        const boundaries = gameModel.stages[this.stage.stageId].boundaries
        const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, boundaries.maxWidth, boundaries.maxHeight);
        snapCanvas.draw(this.stage.backgroundColorLayer, 0,0)
        snapCanvas.draw(this.backgroundCanvasLayer, 0,0)
        snapCanvas.draw(this.playgroundCanvasLayer, 0,0)
        snapCanvas.draw(this.entityInstanceGroup, 0,0)
        snapCanvas.draw(this.foregroundCanvasLayer, 0,0)
    
        snapCanvas.snapshot(async function (image) {    
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
    if(this.stamper && pointer.leftButtonReleased() && !this.draggingObjectInstanceId) {
      this.stamper.stamp(pointer)
      if(!pointer.event.shiftKey) {
        this.destroyStamper()
        store.dispatch(clearClass())
      }
    }
    
    this.draggingObjectInstanceId = null

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
    this.isMouseOverGame = false
  }

  onPointerOut = (pointer, entitySprite) => {
    const phaserInstance = entitySprite[0]
    phaserInstance.isHoveringOver = false
    store.dispatch(changeInstanceHovering(null, null))
    const { isObscured } = getInterfaceIdData(CONTEXT_MENU_INSTANCE_MOVE_IID)
    if(isObscured) {
      return
    }
    // if(document.body.style.cursor === 'grab') document.body.style.cursor = null
  }

  onPointerUpOutside = (pointer)  => {
    this.draggingObjectInstanceId = null

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
    if(this.draggingObjectInstanceId) return
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

  getObjectInstanceData(entityInstanceId) {
    const gameModel = store.getState().gameModel.gameModel

    if(entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
      return gameModel.player
    }
    return gameModel.stages[this.stage.stageId].entityInstances[entityInstanceId]
  }

  addObjectInstanceData(entityClassId, {spawnX, spawnY}) {
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

    this.addObjectInstance(entityInstanceId, entityInstanceData)
  }

  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // NETWORK UPDATE
  ////////////////////////////////////////////////////////////
  onGameModelUpdate = (gameUpdate) => {

    if(gameUpdate.metadata?.interfaceColor) {
      store.dispatch(updateTheme({
        primaryColor: gameUpdate.metadata.interfaceColor
      }))
      this.reset()
    }

    if(gameUpdate.stages) {

      Object.keys(gameUpdate.stages).forEach((stageId) => {
        const sceneKeys = this.scene.manager.keys
        if(stageId && !sceneKeys[stageId]) {
          const key = stageId
          this.scene.add(key, createGameSceneInstance(key, this.gameRoom));
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

      if(stageUpdate?.backgroundColor) {
        this.stage.createStageBackgroundColorLayer()
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
        // this.player.cameraPreview.setZoom(this.player.cameraPreview.zoom)
        this.stage.setBoundaries(stageUpdate.boundaries)

        this.createGrids()
      }

      const entityInstances = stageUpdate?.entityInstances
      if(entityInstances) Object.keys(entityInstances).forEach((entityInstanceId) => {
        const objectUpdate = entityInstances[entityInstanceId]
        const entityInstance = this.getObjectInstance(entityInstanceId)
        if(!entityInstance) {
          this.addObjectInstance(entityInstanceId, objectUpdate)
          return
        }
        if(objectUpdate === null) {
          this.removeObjectInstance(entityInstanceId)
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

    if(gameUpdate.canvasImages) {
      if(gameUpdate.canvasImages[this.backgroundCanvasLayer.textureId]) {
        this.backgroundCanvasLayer.updateTexture()
      } else if(gameUpdate.canvasImages[this.playgroundCanvasLayer.textureId]) {
        this.playgroundCanvasLayer.updateTexture()
      } else if(gameUpdate.canvasImages[this.foregroundCanvasLayer.textureId]) {
        this.foregroundCanvasLayer.updateTexture()
      } else {
        Object.keys(gameUpdate.canvasImages).forEach((id) => {
          const textureId = gameUpdate.canvasImages[id].textureId
          this.load.image(textureId, window.awsUrl + textureId);
          this.load.once('complete', (idk) => {
            console.log('loaded', textureId)
          });
          this.load.start();
        })
      }
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
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setBounce(classUpdate.collisionResponse.bounciness)
        })
      }

      if(classUpdate.collisionResponse?.friction >= 0) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setFriction(classUpdate.collisionResponse.friction)
        })
      }

      if(classUpdate.collisionResponse?.notPushable !== undefined) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setPushable(!classUpdate.collisionResponse.notPushable)
        })
      }


      if(classUpdate.movement?.drag >= 0) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setDrag(classUpdate.movement.drag)
        })
      }

      if(classUpdate.movement?.dragX >= 0) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setDragX(classUpdate.movement.dragX)
        })
      }

      if(classUpdate.movement?.dragAngular >= 0) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setAngularDrag(classUpdate.movement.dragAngular)
        })
      }

      if(classUpdate.movement?.dragY >= 0) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setDragY(classUpdate.movement.dragY)
        })
      }

      if(classUpdate.movement?.gravityY !== undefined) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setGravityY(classUpdate.movement?.gravityY)
        })
      }
      if(classUpdate.movement?.gravityX !== undefined) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setGravityX(classUpdate.movement?.gravityX)
        })
      }

      // if(classUpdate.frictionStatic >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
      //     entityInstance.setFrictionStatic(classUpdate.frictionStatic)
      //   })
      // }

      // if(entityClass.collisionResponse.useMass && classUpdate.mass >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
      //     entityInstance.setMass(classUpdate.mass)
      //   })
      // }
      // if(!entityClass.collisionResponse.useMass && classUpdate.density >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
      //     entityInstance.setDensity(classUpdate.density)
      //   })
      // }

      if(classUpdate.movement?.movementControlsBehavior) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.resetPhysics()
        })
      }

      if(classUpdate.movement?.ignoreGravity !== undefined) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setIgnoreGravity(classUpdate.movement?.ignoreGravity)
        })
      }

      if(classUpdate.collisionResponse?.ignoreSides) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setCollideIgnoreSides(classUpdate.collisionResponse?.ignoreSides)
        })
      }

      if(
        classUpdate.graphics?.invisibile !== undefined ||
        classUpdate.boundaryRelation || 
        classUpdate.graphics?.textureId ||
        classUpdate.movement?.movementBehavior !== undefined ||
        classUpdate.movement?.velocityX !== undefined ||
        classUpdate.movement?.velocityY !== undefined ||
        classUpdate.collisionResponse?.ignoreBoundaries !== undefined
      ) {
        // setTimeout(() => {
          this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
            if(entityInstance.entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
              this.removePlayerInstance()
              this.addPlayerInstance()
              return
            }
            const entityInstanceData = this.getObjectInstanceData(entityInstance.entityInstanceId)
            this.removeObjectInstance(entityInstance.entityInstanceId)
            this.addObjectInstance(entityInstance.entityInstanceId, entityInstanceData)
          })
        // })
      }

      if(classUpdate.graphics?.width && classUpdate.graphics?.height) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setSize(classUpdate.graphics?.width, classUpdate.graphics?.height)
        })
      } else if(classUpdate.graphics?.width) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setSize(classUpdate.graphics?.width, entityClass.graphics?.height)
        })
      } else if(classUpdate.graphics?.height) {
        this.forAllObjectInstancesMatchingClassId(entityClassId, (entityInstance) => {
          entityInstance.setSize(entityClass.graphics?.width, classUpdate.graphics?.height)
        })
      }
      
      if(classUpdate.tags) {
        this.reregisterRelationships()
      }

      if(classUpdate.camera !== undefined) {
        if(this.playerInstance.entityClassId === entityClassId) {
          if(classUpdate.camera.zoom) {
            this.cameras.main.setZoom(classUpdate.camera.zoom)
            this.playerInstance.setZoom(classUpdate.camera.zoom)
          }
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

    // this.grid.setDepth(UI_CANVAS_DEPTH)
    // this.grid2.setDepth(UI_CANVAS_DEPTH)

    if(this.grid) this.grid.destroy()
    if(this.grid2) this.grid2.destroy()

    const boundaries = store.getState().gameModel.gameModel.stages[this.stage.stageId].boundaries

    const gameWidth = boundaries.width
    const gameHeight = boundaries.height
    const gameX = boundaries.x
    const gameY = boundaries.y
    this.grid = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    this.grid2 = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    this.grid.setDepth(UI_CANVAS_DEPTH)
    this.grid2.setDepth(UI_CANVAS_DEPTH)
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

    const lobby = store.getState().lobby.lobby
    if(lobby.id) {
      const me = store.getState().auth.me
      lobby.members.forEach(({id}) => {
        if(id !== me.id && lobby.participantId === id) {
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
        if(this.brush) {
          this.destroyBrush()
        } else if(this.stamper) {
          this.destroyStamper()
        } else if(this.snapshotSquare) {
          this.clearSnapshotSquare()
        } else if(this.resizingObjectInstance) {
          this.clearResize()
        } else {
          // store.dispatch(editGameRoom(this.gameRoom.id, {
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

    const gameRoom = store.getState().gameRoom.gameRoom
    const gameResetDate = gameRoom.gameResetDate
    if(gameResetDate > this.gameResetDate) {
      this.gameResetDate = gameResetDate
      this.reset()
    }

    const cameraZoom = store.getState().gameViewEditor.cameraZoom
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
    //     this.stage.backgroundColorLayer.setVisible(false)
    //     this.backgroundCanvasLayer.setVisible(false)
    //     this.playgroundCanvasLayer.setVisible(false)
    //     this.foregroundCanvasLayer.setVisible(false)
    //     const canvas = this.getLayerCanvasInstanceById(brush.getCanvasId())
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

