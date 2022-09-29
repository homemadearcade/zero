import Phaser from 'phaser';
import { v4 as uuidv4 } from 'uuid';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { addAwsImage, editGameModel } from '../../store/actions/gameActions';
import { openContextMenuFromGameObject, openWorldContextMenu } from '../../store/actions/contextMenuActions';
import { changeEditorCameraZoom, closeSnapshotTaker, openSnapshotTaker } from '../../store/actions/editorActions';
import { HERO_INSTANCE_ID, UI_CANVAS_DEPTH } from '../../constants';
import { isBrushIdColor, isBrushIdEraser, snapObjectXY } from '../../utils/editorUtils';
import { TexturePencil } from '../drawing/TexturePencil';
import { Eraser } from '../drawing/Eraser';
import { ClassStamper } from '../drawing/ClassStamper';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { RemoteEditor } from '../entities/RemoteEditor';
import { ColorPencil } from '../drawing/ColorPencil';
import { gameSize, nodeSize } from '../../defaultData/general';
import { urlToFile } from '../../utils/utils';

export class EditorScene extends GameInstance {
  constructor({key}) {
    super({
      key: key,
    });

    this.draggingObjectInstanceId = null
    this.canvas = null
    this.brush = null 
    this.stamper = null
    this.gameResetDate = Date.now()
    this.isGridViewOn = true
    this.editorCamera = null
    this.remoteEditors = []
    this.mouseWheelTimeout = null

    this.snapshotSquare = null 
    this.snapshotStartPos = null
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // DRAG
  ////////////////////////////////////////////////////////////
  onDragStart = (pointer, entitySprite, dragX, dragY) => {
    if(this.draggingObjectInstanceId) {
      const classId = this.getObjectInstance(this.draggingObjectInstanceId).classId
      const objectClass= store.getState().game.gameModel.classes[classId]
      const { clampedX, clampedY } = snapObjectXY({x: dragX, y: dragY,  objectClass})
      entitySprite.x = clampedX;
      entitySprite.y = clampedY;
    } else if(!this.brush && !this.stamper){
      this.draggingObjectInstanceId = entitySprite.id
    }
  }

  onDragEnd = (pointer, entitySprite) => {
    if(entitySprite.id === HERO_INSTANCE_ID) {
      store.dispatch(editGameModel({ 
        hero: {
          spawnX: entitySprite.x,
          spawnY: entitySprite.y
        }
      }))
    } else {
      store.dispatch(editGameModel({ 
        objects: {
          [entitySprite.id]: {
            spawnX: entitySprite.x,
            spawnY: entitySprite.y
          }
        }
      }))
    }
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
    const objectClass = store.getState().game.gameModel.classes[sprite.classId]
    const boundaries = store.getState().game.gameModel.world.boundaries
    // const distance = Phaser.Math.Distance.Between(sprite.x, sprite.y, pointer.worldX, pointer.worldY)
    const distanceW = Phaser.Math.Snap.To(Math.abs(sprite.x - pointer.worldX), nodeSize)
    const distanceH = Phaser.Math.Snap.To(Math.abs(sprite.y - pointer.worldY), nodeSize)

    // const gridx = boundaries.x
    // const gridy = boundaries.y
    // const gridwidth = gridx + boundaries.width
    // const gridheight = gridy + boundaries.height

    const width = Phaser.Math.Clamp(distanceW * 2, nodeSize, boundaries.width)
    const height = Phaser.Math.Clamp(distanceH * 2, nodeSize, boundaries.height)

    this.resizingObjectInstance.setSize(width, height)
  }

  onResizeEnd = (pointer) => {
    const sprite = this.resizingObjectInstance.sprite
    if(sprite.id === HERO_INSTANCE_ID) {
      store.dispatch(editGameModel({ 
        hero: {
          spawnX: sprite.x,
          spawnY: sprite.y
        },
        classes: {
          [sprite.classId]: {
            width: sprite.displayWidth,
            height: sprite.displayHeight
          }
        }
      }))
    } else {
      store.dispatch(editGameModel({ 
        objects: {
          [sprite.id]: {
            spawnX: sprite.x,
            spawnY: sprite.y
          }
        },
        classes: {
          [sprite.classId]: {
            width: sprite.displayWidth,
            height: sprite.displayHeight
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

    const editor = getCobrowsingState().editor
    const brushId = editor.brushIdSelectedBrushList
    const classId = editor.classIdSelectedClassList
    const gameModel = store.getState().game.gameModel

    if(this.resizingObjectInstance) {
      this.onResizeMove(pointer)
      return
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // SNAPSHOT
    ////////////////////////////////////////////////////////////
    if(this.snapshotSquare) {
      if(!editor.isSnapshotTakerOpen) {
        this.snapshotSquare.clear()
        this.snapshotSquare = null 
        this.snapshotStartPos = null
       } else {
        this.snapshotSquare.clear()
        this.snapshotSquare.lineStyle(2, 0xffffff);
        this.snapshotSquare.strokeRect(this.snapshotStartPos.x - 2, this.snapshotStartPos.y - 2, (pointer.worldX - this.snapshotStartPos.x) + 2, (pointer.worldY - this.snapshotStartPos.y) + 2);
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
      this.destroyStamp()
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
    entitySprite[0].highlight.setVisible(true)
  }

  onPointerDownOutside = (pointer) => {
    if(pointer.leftButtonDown()) {
      if(this.resizingObjectInstance) {
        this.onResizeEnd()
      }
    }
  }

  onPointerDown = (pointer, gameObjects) => {
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

      if(gameObjects.length) {
        store.dispatch(openContextMenuFromGameObject(gameObjects, pointer.event))
      } else {
        store.dispatch(openWorldContextMenu(pointer.event))
      }
    }

    if(pointer.leftButtonDown()) {
      if(this.resizingObjectInstance) {
        this.onResizeEnd()
      }

      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // SNAPSHOT
      ////////////////////////////////////////////////////////////
      const editor = getCobrowsingState().editor
      const gameModel = store.getState().game.gameModel
      if(editor.isSnapshotTakerOpen) {
        if(this.snapshotSquare) {
          const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, gameModel.world.boundaries.maxWidth, gameModel.world.boundaries.maxHeight);
          snapCanvas.draw(this.world.backgroundColorLayer, 0,0)
          snapCanvas.draw(this.backgroundLayer, 0,0)
          snapCanvas.draw(this.playgroundLayer, 0,0)
          snapCanvas.draw(this.objectInstanceGroup, 0,0)
          snapCanvas.draw(this.foregroundLayer, 0,0)
          snapCanvas.snapshotArea(
            Math.floor(this.snapshotStartPos.x - 2), Math.floor(this.snapshotStartPos.y - 2), 
            Math.floor((pointer.worldX - this.snapshotStartPos.x) + 2), 
            Math.floor((pointer.worldY - this.snapshotStartPos.y) + 2), 
            async function (image) {
              const fileId = editor.snapshotFileId
          
              var imgCanvas = document.createElement("canvas"),
              imgContext = imgCanvas.getContext("2d");
              imgCanvas.width = image.width;
              imgCanvas.height = image.height;
              imgContext.drawImage(image, 0, 0, image.width, image.height);

              const file = await urlToFile(imgCanvas.toDataURL(), fileId, 'image/png')

              addAwsImage(file, fileId, {
                name: fileId,
                type: 'layer'
              })
            }
          );
          this.snapshotSquare.clear()
          this.snapshotSquare = null
          this.snapshotStartPos = null
          store.dispatch(closeSnapshotTaker())
          return
        }
        this.snapshotSquare = this.add.graphics().setDepth(UI_CANVAS_DEPTH);
        this.snapshotStartPos = { x: pointer.worldX, y: pointer.worldY }
        return
      }


      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // BRUSH
      ////////////////////////////////////////////////////////////
      if(this.brush) {
        const canvas = this.getLayerById(this.brush.getCanvasId())
        if(canvas.isSavingToAws) return
        this.canvas = canvas
        this.brush.stroke(pointer, this.canvas)
      }
    }
  }

  onPointerUp = (pointer) => {
    if(this.stamper && pointer.leftButtonReleased() && !this.draggingObjectInstanceId) {
      this.stamper.stamp(pointer)
    }

    this.draggingObjectInstanceId = null

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onPointerLeaveGame = () => {
    // without !this.canvas check we end up with discrepencies in codrawing
    if(this.brush && !this.canvas) this.destroyBrush()
    if(this.stamper) this.destroyStamp()
  }

  onPointerOut = (pointer, entitySprite) => {
    entitySprite[0].highlight.setVisible(false)
  }

  onPointerUpOutside = (pointer)  => {
    this.draggingObjectInstanceId = null

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onDoubleClick = (pointer) => {
    store.dispatch(changeEditorCameraZoom(5))
    this.editorCamera.setZoom(5)
    this.editorCamera.pan(pointer.worldX, pointer.worldY, 0)
  }

  onMouseWheel = (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
    if(this.draggingObjectInstanceId) return
    if(!getCobrowsingState().editor.isGridViewOn) return
    
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

  destroyStamp() {
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

  getGameObjectById(id) {
    const gameModel = store.getState().game.gameModel

    if(id === HERO_INSTANCE_ID) {
      return gameModel.hero
    }
    return gameModel.objects[id]
  }

  addGameObject(classId, {spawnX, spawnY}) {
    const id = uuidv4();

    const gameObject = {
      classId,
      spawnX,
      spawnY,
    }

    store.dispatch(editGameModel({
      objects: {
        [id]: gameObject
      }
    }))

    this.addObjectInstance(id, gameObject)
  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // NETWORK UPDATE
  ////////////////////////////////////////////////////////////
  onGameModelUpdate = (gameUpdate) => {
    if(gameUpdate.world?.gravity) {
      const gravity = gameUpdate.world.gravity
      const currentGravity = store.getState().game.gameModel.world.gravity

      if(typeof gravity?.x === 'number' && typeof gravity?.y === 'number') {
        this.world.setGravity(gravity.x, gravity.y)
      } else if(typeof gravity?.x === 'number') {
        this.world.setGravity(gravity.x, currentGravity.y)
      } else if(typeof gravity?.y === 'number') {
        this.world.setGravity(currentGravity.x, gravity.y)
      }
    }

    if(gameUpdate.world?.boundaries) {
      if(gameUpdate.world.boundaries.loop) {
        this.reload()
        return
      }
      
      // set camera previews zoom
      // set camera bounds
      // set world bounds
      const gameModel = gameUpdate
      const gameWidth = gameModel.world.boundaries.width
      const gameHeight = gameModel.world.boundaries.height
      const gameX = gameModel.world.boundaries.x
      const gameY = gameModel.world.boundaries.y
      this.cameras.main.setBounds(gameX, gameY, gameWidth, gameHeight)
      // this.player.cameraPreview.setZoom(this.player.cameraPreview.zoom)
      this.world.setBoundaries(gameModel.world.boundaries)

      this.createGrids()
    }

    if(gameUpdate.awsImages) {
      if(gameUpdate.awsImages[this.backgroundLayer.textureId]) {
        this.backgroundLayer.updateTexture()
      }
      if(gameUpdate.awsImages[this.playgroundLayer.textureId]) {
        this.playgroundLayer.updateTexture()
      }
      if(gameUpdate.awsImages[this.foregroundLayer.textureId]) {
        this.foregroundLayer.updateTexture()
      }
    }

    if(gameUpdate.hero) {
      this.removePlayerInstance()
      this.addPlayerInstance()
    }

    if(gameUpdate.objects) Object.keys(gameUpdate.objects).forEach((id) => {
      const objectUpdate = gameUpdate.objects[id]
      const objectInstance = this.getObjectInstance(id)
      if(!objectInstance) {
        this.addObjectInstance(id, objectUpdate)
        return
      }
      if(objectUpdate === null) {
        this.removeObjectInstance(id)
        return
      }
      
      if(typeof objectUpdate.spawnX === 'number' || typeof objectUpdate.spawnY === 'number') {
        objectInstance.sprite.x = objectUpdate.spawnX
        objectInstance.sprite.y = objectUpdate.spawnY
      }
    })

    if(gameUpdate.classes) Object.keys(gameUpdate.classes).forEach((id) => {
      const classUpdate = gameUpdate.classes[id]
      const objectClass = store.getState().game.gameModel.classes[id]
      if(classUpdate.bounciness >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setBounce(classUpdate.bounciness)
        })
      }
      if(classUpdate.friction >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setFriction(classUpdate.friction)
        })
      }
      if(classUpdate.drag >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDrag(classUpdate.drag)
        })
      }

      if(classUpdate.dragX >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDragX(classUpdate.dragX)
        })
      }

      if(classUpdate.dragY >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDragY(classUpdate.dragY)
        })
      }

      if(classUpdate.frictionStatic >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setFrictionStatic(classUpdate.frictionStatic)
        })
      }

      if(objectClass.attributes.useMass && classUpdate.mass >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setMass(classUpdate.mass)
        })
      }
      if(!objectClass.attributes.useMass && classUpdate.density >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDensity(classUpdate.density)
        })
      }

      if(classUpdate.controls) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.resetPhysics()
        })
      }

      if(classUpdate.attributes) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          if(object.id === HERO_INSTANCE_ID) {
            this.removePlayerInstance()
            this.addPlayerInstance()
            return
          }
          const gameObject = this.getGameObjectById(object.id)
          this.removeObjectInstance(object.id)
          this.addObjectInstance(object.id, gameObject)
        })
      }

      if(classUpdate.width && classUpdate.height) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setSize(classUpdate.width, classUpdate.height)
        })
      } else if(classUpdate.width) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setSize(classUpdate.width, objectClass.height)
        })
      } else if(classUpdate.height) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setSize(objectClass.width, classUpdate.height)
        })
      }

      if(classUpdate.camera !== undefined) {
        if(this.player.classId === id) {
          this.cameras.main.setZoom(classUpdate.camera.zoom)
          this.player.setZoom(classUpdate.camera.zoom)
        }
      }
    })
  }

  create() {
    super.create()

    const gameModel = store.getState().game.gameModel
    const gameMaxWidth = gameModel.world.boundaries.maxWidth
    const gameMaxHeight = gameModel.world.boundaries.maxHeight
    
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
  
    var keys = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
    const controlConfig = {
      camera: this.editorCamera,
      left: keys.left,
      right: keys.right,
      up: keys.up,
      down: keys.down,
      acceleration: 0.03,
      drag: 0.001,
      maxSpeed: 0.5
    };
    this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.input.on('pointerover', this.onPointerOver);
    this.input.on('pointerout', this.onPointerOut);
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointerup', this.onPointerUp);
    this.input.on('pointerupoutside', this.onPointerUpOutside);
    this.input.on('pointerdownoutside', this.onPointerDownOutside);
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('gameout', this.onPointerLeaveGame, this)
    this.input.dragDistanceThreshold = 16;
    this.input.on('drag', this.onDragStart);
    this.input.on('dragend', this.onDragEnd);
    this.input.on('wheel', this.onMouseWheel);

    const lobby = store.getState().lobby.lobby
    if(lobby.id) {
      const me = store.getState().auth.me
      lobby.users.forEach(({id}) => {
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

    this.cameraControls.update(delta)

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

    const lobby = store.getState().lobby.lobby
    if(lobby.id) {
      const gameResetDate = lobby.gameResetDate
      if(gameResetDate > this.gameResetDate) {
        this.gameResetDate = gameResetDate
        this.reload()
      }
    }

    const isGridViewOn = getCobrowsingState().editor.isGridViewOn
    if(isGridViewOn) {
      this.isGridViewOn = true
    } else {
      this.isGridViewOn = false
    }
    
    const cameraZoom = store.getState().editor.cameraZoom
    if(cameraZoom !== this.editorCamera.zoom) {
      this.editorCamera.setZoom(cameraZoom)
      // this.editorCamera.zoomTo(cameraZoom, 100, 'Linear', true)
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
  }
}

