import Phaser from 'phaser';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/gameModelActions';
import { openContextMenuFromObjectInstance, openStageContextMenu } from '../../store/actions/contextMenuActions';
import { isBrushIdColor, isBrushIdEraser, snapObjectXY } from '../../utils/editorUtils';
import { clearBrush, clearClass } from '../../store/actions/gameSelectorActions';
import { closeSnapshotTaker, changeEditorCameraZoom, changeInstanceHovering } from '../../store/actions/gameViewEditorActions';
import { PLAYER_INSTANCE_ID_PREFIX, OBJECT_INSTANCE_ID_PREFIX, UI_CANVAS_DEPTH, BACKGROUND_CANVAS_ID, STAGE_BACKGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID, FOREGROUND_CANVAS_ID, PAUSED_STATE, EVENT_SPAWN_CLASS_DRAG_FINISH } from '../constants';
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
import { addAwsImage } from '../../store/actions/textureActions';
import { updateTheme } from '../../store/actions/themeActions';
import { ON_GAME_INSTANCE_EVENT } from '../../store/types';

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
  onDragStartContextMenu = (objectInstanceId) => {
    this.draggingObjectInstanceId = objectInstanceId
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
      this.draggingObjectInstanceId = entitySprite.instanceId
    }
  }

  continueDrag(sprite, {x, y}) {
    const classId = this.getObjectInstance(this.draggingObjectInstanceId).classId
    const objectClass= store.getState().gameModel.gameModel.classes[classId]
    const { clampedX, clampedY } = snapObjectXY({x, y,  objectClass})
    sprite.x = clampedX;
    sprite.y = clampedY;
  }

  finishDrag(entitySprite) {
    document.body.style.cursor = null
    if(entitySprite.effectSpawned) {
      window.socket.emit(ON_GAME_INSTANCE_EVENT, {
        gameRoomId: this.gameRoom.id, 
        type: EVENT_SPAWN_CLASS_DRAG_FINISH,
        data: {
          x: entitySprite.x,
          y: entitySprite.y,
          instanceId: entitySprite.instanceId,
          hostOnly: true
        }
      })

      return
    }

    if(entitySprite.instanceId === PLAYER_INSTANCE_ID_PREFIX) {
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
            objects: {
              [entitySprite.instanceId]: {
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
  onResizeStart = (instanceId) => {
    this.resizingObjectInstance = this.getObjectInstance(instanceId)
  }

  onResizeMove = (pointer) => {
    const sprite = this.resizingObjectInstance.sprite
    const boundaries = store.getState().gameModel.gameModel.stages[this.stage.stageId].boundaries
    // const distance = Phaser.Math.Distance.Between(sprite.x, sprite.y, pointer.worldX, pointer.worldY)
    const distanceW = Phaser.Math.Snap.To(Math.abs(sprite.x - pointer.worldX), nodeSize)
    const distanceH = Phaser.Math.Snap.To(Math.abs(sprite.y - pointer.worldY), nodeSize)
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

    this.forAllObjectInstancesMatchingClassId(sprite.classId, (object) => {
      object.setSize(width, height)
    })
  }

  clearResize() {
    const sprite = this.resizingObjectInstance.sprite
    const objectClass = store.getState().gameModel.gameModel.classes[sprite.classId];
    this.forAllObjectInstancesMatchingClassId(sprite.classId, (object) => {
      object.setSize(objectClass.graphics.width, objectClass.graphics.height)
    })
    this.resizingObjectInstance = null
  }

  onResizeEnd = (pointer) => {
    const sprite = this.resizingObjectInstance.sprite
    if(sprite.instanceId === PLAYER_INSTANCE_ID_PREFIX) {
      store.dispatch(editGameModel({ 
        // player: {
        //   spawnX: sprite.x,
        //   spawnY: sprite.y
        // },
        classes: {
          [sprite.classId]: {
            graphics: {
              width: sprite.displayWidth,
              height: sprite.displayHeight
            }
          }
        }
      }))
    } else {
      store.dispatch(editGameModel({ 
        stages: {
          [this.stage.stageId]: {
            objects: {
              [sprite.instanceId]: {
                spawnX: sprite.x,
                spawnY: sprite.y
              }
            },
          }
        },
        classes: {
          [sprite.classId]: {
            graphics: {
              width: sprite.displayWidth,
              height: sprite.displayHeight
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
    const classId = gameSelector.classIdSelectedClassList
    const gameModel = store.getState().gameModel.gameModel

    if(this.resizingObjectInstance) {
      this.onResizeMove(pointer)
      return
    }

    if(this.isDragFromContext && this.draggingObjectInstanceId) {
      const instance = this.getObjectInstance(this.draggingObjectInstanceId)
      this.continueDrag(instance.sprite, {x: pointer.worldX, y: pointer.worldY})
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
      this.brush = this.getBrushFromBrushId(brushId)
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
    if((!classId && this.stamper) || (this.stamper && (this.stamper.classId !== classId))) {
      this.destroyStamper()
    }
    if(classId && !this.stamper) {
      const objectClass = gameModel.classes[classId]
      this.stamper = new ClassStamper(this, classId, objectClass)
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

    const instanceIdHovering = store.getState().gameViewEditor.instanceIdHovering
    const sprite = entitySprite[0]
    if(sprite.instanceId !== instanceIdHovering) {
      store.dispatch(changeInstanceHovering(sprite.instanceId, sprite.classId, { isSpawned: sprite.effectSpawned }))
    }

    sprite.isHoveringOver = true
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
    
    if(gameViewEditor.layerVisibility[STAGE_BACKGROUND_CANVAS_ID]) {
      snapCanvas.draw(this.stage.backgroundColorLayer, 0,0)
    }
    if(gameViewEditor.layerVisibility[BACKGROUND_CANVAS_ID]) {
      snapCanvas.draw(this.backgroundLayer, 0,0)
    }
    if(gameViewEditor.layerVisibility[PLAYGROUND_CANVAS_ID]) {
      snapCanvas.draw(this.playgroundLayer, 0,0)
    }
    // if(gameViewEditor.layerVisibility[PLAYER_INSTANCE_CANVAS_ID] && gameViewEditor.layerVisibility[BASIC_CLASS] && gameViewEditor.layerVisibility[NPC_CLASS] ) {
      snapCanvas.draw(this.objectInstanceGroup, 0,0)
    // }
    if(gameViewEditor.layerVisibility[FOREGROUND_CANVAS_ID]) {
      snapCanvas.draw(this.foregroundLayer, 0,0)
    }
    snapCanvas.snapshotArea(
      Math.floor(this.snapshotStartPos.x - 2), Math.floor(this.snapshotStartPos.y - 2), 
      Math.floor((this.snapshotEndPos.x)), 
      Math.floor((this.snapshotEndPos.y)), 
      async function (image) {
        const fileId = gameViewEditor.snapshotFileId
    
        var imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");
        imgCanvas.width = image.width;
        imgCanvas.height = image.height;
        imgContext.drawImage(image, 0, 0, image.width, image.height);

        const file = await urlToFile(imgCanvas.toDataURL(), fileId, 'image/png')

        await addAwsImage(file, fileId, {
          name: fileId,
          type: 'layer'
        })

        store.dispatch(addSnackbar({
          message: 'Snapshot Saved!',
          imageUrl: window.awsUrl + fileId
        }))
      }
    );
    this.clearSnapshotSquare()
    store.dispatch(closeSnapshotTaker())
    return true
  }

  onPointerDown = (pointer, objectInstance) => {
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

      if(objectInstance.length) {
        store.dispatch(openContextMenuFromObjectInstance(objectInstance, pointer.event))
      } else {
        store.dispatch(openStageContextMenu(pointer.event))
      }
    }

    if(pointer.leftButtonDown()) {

      if(this.draggingObjectInstanceId && this.isDragFromContext) {
        this.finishDrag(this.getObjectInstance(this.draggingObjectInstanceId).sprite)
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
        const canvas = this.getLayerByCanvasId(this.brush.getCanvasId())
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
        snapCanvas.draw(this.backgroundLayer, 0,0)
        snapCanvas.draw(this.playgroundLayer, 0,0)
        snapCanvas.draw(this.objectInstanceGroup, 0,0)
        snapCanvas.draw(this.foregroundLayer, 0,0)
    
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
    const sprite = entitySprite[0]
    sprite.isHoveringOver = false
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

  onMouseWheel = (pointer, objectInstance, deltaX, deltaY, deltaZ) => {
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
  getBrushFromBrushId(brushId) {
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

  getObjectInstanceData(instanceId) {
    const gameModel = store.getState().gameModel.gameModel

    if(instanceId === PLAYER_INSTANCE_ID_PREFIX) {
      return gameModel.player
    }
    return gameModel.stages[this.stage.stageId].objects[instanceId]
  }

  addObjectInstanceData(classId, {spawnX, spawnY}) {
    const instanceId = OBJECT_INSTANCE_ID_PREFIX+generateUniqueId()

    const objectInstanceData = {
      classId,
      spawnX,
      spawnY,
    }

    store.dispatch(editGameModel({
      stages: {
        [this.stage.stageId]: {
          objects: {
            [instanceId]: objectInstanceData
          }
        }
      }
    }))

    this.addObjectInstance(instanceId, objectInstanceData)
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

      const objects = stageUpdate?.objects
      if(objects) Object.keys(objects).forEach((instanceId) => {
        const objectUpdate = objects[instanceId]
        const objectInstance = this.getObjectInstance(instanceId)
        if(!objectInstance) {
          this.addObjectInstance(instanceId, objectUpdate)
          return
        }
        if(objectUpdate === null) {
          this.removeObjectInstance(instanceId)
          return
        }
        
        if(typeof objectUpdate.spawnX === 'number' || typeof objectUpdate.spawnY === 'number') {
          objectInstance.sprite.x = objectUpdate.spawnX
          objectInstance.sprite.y = objectUpdate.spawnY
        }
      })
      if(stageUpdate?.playerClassId) {
        this.playerInstance.reclassId = stageUpdate?.playerClassId
      }
    }

    if(gameUpdate.awsImages) {
      if(gameUpdate.awsImages[this.backgroundLayer.textureId]) {
        this.backgroundLayer.updateTexture()
      } else if(gameUpdate.awsImages[this.playgroundLayer.textureId]) {
        this.playgroundLayer.updateTexture()
      } else if(gameUpdate.awsImages[this.foregroundLayer.textureId]) {
        this.foregroundLayer.updateTexture()
      } else {
        Object.keys(gameUpdate.awsImages).forEach((id) => {
          const textureId = gameUpdate.awsImages[id].url
          this.load.image(textureId, window.awsUrl + textureId);
          this.load.once('complete', (idk) => {
            console.log('loaded', textureId)
          });
          this.load.start();
        })
      }
    }

    if(gameUpdate.relations || gameUpdate.effects || gameUpdate.events) {
      // setTimeout(() => {
        this.reregisterRelationships()
      // }, 100)
    }

    if(gameUpdate.classes) Object.keys(gameUpdate.classes).forEach((classId) => {
      const classUpdate = gameUpdate.classes[classId]
      const objectClass = store.getState().gameModel.gameModel.classes[classId]

      if(classUpdate.collisionResponse?.bounciness >= 0) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setBounce(classUpdate.collisionResponse.bounciness)
        })
      }

      if(classUpdate.collisionResponse?.friction >= 0) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setFriction(classUpdate.collisionResponse.friction)
        })
      }

      if(classUpdate.collisionResponse?.notPushable !== undefined) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setPushable(!classUpdate.collisionResponse.notPushable)
        })
      }


      if(classUpdate.movement?.drag >= 0) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setDrag(classUpdate.movement.drag)
        })
      }

      if(classUpdate.movement?.dragX >= 0) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setDragX(classUpdate.movement.dragX)
        })
      }

      if(classUpdate.movement?.dragAngular >= 0) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setAngularDrag(classUpdate.movement.dragAngular)
        })
      }

      if(classUpdate.movement?.dragY >= 0) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setDragY(classUpdate.movement.dragY)
        })
      }

      if(classUpdate.movement?.gravityY !== undefined) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setGravityY(classUpdate.movement?.gravityY)
        })
      }
      if(classUpdate.movement?.gravityX !== undefined) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setGravityX(classUpdate.movement?.gravityX)
        })
      }

      // if(classUpdate.frictionStatic >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
      //     objectInstance.setFrictionStatic(classUpdate.frictionStatic)
      //   })
      // }

      // if(objectClass.collisionResponse.useMass && classUpdate.mass >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
      //     objectInstance.setMass(classUpdate.mass)
      //   })
      // }
      // if(!objectClass.collisionResponse.useMass && classUpdate.density >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
      //     objectInstance.setDensity(classUpdate.density)
      //   })
      // }

      if(classUpdate.movement?.controls) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.resetPhysics()
        })
      }

      if(classUpdate.movement?.ignoreGravity !== undefined) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setIgnoreGravity(classUpdate.movement?.ignoreGravity)
        })
      }

      if(classUpdate.collisionResponse?.ignoreSides) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setCollideIgnoreSides(classUpdate.collisionResponse?.ignoreSides)
        })
      }

      if(
        classUpdate.graphics?.invisibile !== undefined ||
        classUpdate.boundaryRelation || 
        classUpdate.graphics?.textureId ||
        classUpdate.movement?.pattern !== undefined ||
        classUpdate.movement?.velocityX !== undefined ||
        classUpdate.movement?.velocityY !== undefined ||
        classUpdate.collisionResponse?.ignoreBoundaries !== undefined
      ) {
        // setTimeout(() => {
          this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
            if(objectInstance.instanceId === PLAYER_INSTANCE_ID_PREFIX) {
              this.removePlayerInstance()
              this.addPlayerInstance()
              return
            }
            const objectInstanceData = this.getObjectInstanceData(objectInstance.instanceId)
            this.removeObjectInstance(objectInstance.instanceId)
            this.addObjectInstance(objectInstance.instanceId, objectInstanceData)
          })
        // })
      }

      if(classUpdate.graphics?.width && classUpdate.graphics?.height) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setSize(classUpdate.graphics?.width, classUpdate.graphics?.height)
        })
      } else if(classUpdate.graphics?.width) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setSize(classUpdate.graphics?.width, objectClass.graphics?.height)
        })
      } else if(classUpdate.graphics?.height) {
        this.forAllObjectInstancesMatchingClassId(classId, (objectInstance) => {
          objectInstance.setSize(objectClass.graphics?.width, classUpdate.graphics?.height)
        })
      }
      
      if(classUpdate.tags) {
        this.reregisterRelationships()
      }

      if(classUpdate.camera !== undefined) {
        if(this.playerInstance.classId === classId) {
          if(classUpdate.camera.zoom) {
            this.cameras.main.setZoom(classUpdate.camera.zoom)
            this.playerInstance.setZoom(classUpdate.camera.zoom)
          }
          if(classUpdate.camera.lerpX || classUpdate.camera.lerpY) {
            let lerpX = classUpdate.camera.lerpX ? classUpdate.camera.lerpX : objectClass.camera.lerpX
            let lerpY = classUpdate.camera.lerpY ? classUpdate.camera.lerpY : objectClass.camera.lerpY
            this.cameras.main.setLerp(lerpX, lerpY)
            // this.cameras.main.startFollow(this.playerInstance.sprite, false, classUpdate.camera.lerpX ? classUpdate.camera.lerpX : objectClass.camera.lerpX, classUpdate.camera.lerpY ? classUpdate.camera.lerpY : objectClass.camera.lerpY);
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
    if(gameRoom.id) {
      const gameResetDate = gameRoom.gameResetDate
      if(gameResetDate > this.gameResetDate) {
        this.gameResetDate = gameResetDate
        this.reset()
      }
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

    const gameSelector = getCobrowsingState().gameSelector
    if(!this.isMouseOverGame && gameSelector.brushIdSelectedBrushList) {
      if(!isBrushIdEraser(gameSelector.brushIdSelectedBrushList)) {
        const brush = this.getBrushFromBrushId(gameSelector.brushIdSelectedBrushList)
        this.stage.backgroundColorLayer.setVisible(false)
        this.backgroundLayer.setVisible(false)
        this.playgroundLayer.setVisible(false)
        this.foregroundLayer.setVisible(false)
        const canvas = this.getLayerByCanvasId(brush.getCanvasId())
        canvas.setVisible(true)
        brush.destroy()
      }
    }

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

