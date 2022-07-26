import Phaser from 'phaser';
import { v4 as uuidv4 } from 'uuid';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/gameActions';
import { openContextMenuFromGameObject, openWorldContextMenu } from '../../store/actions/contextMenuActions';
import { changeEditorCameraZoom } from '../../store/actions/editorActions';
import { HERO_INSTANCE_ID } from '../../constants';
import { isBrushIdEraser, snapObjectXY } from '../../utils/editor';
import { Pencil } from '../entities/Pencil';
import { Eraser } from '../entities/Eraser';
import { Stamper } from '../entities/Stamper';
import { getCobrowsingState } from '../../utils/cobrowsing';
import { RemoteEditor } from '../entities/RemoteEditor';

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
    this.isEditModeOn = false
    this.editorCamera = null
    this.remoteEditors = []
    this.cameraDragStart = null
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // DRAG
   ////////////////////////////////////////////////////////////
  onDragStart = (pointer, objectInstance, dragX, dragY) => {
    if(this.draggingObjectInstanceId) {
      const classId = this.getObjectInstance(this.draggingObjectInstanceId).classId
      const objectClass= store.getState().game.gameModel.classes[classId]
      const { snappedX, snappedY } = snapObjectXY({x: dragX, y: dragY}, objectClass)
      objectInstance.x = snappedX;
      objectInstance.y = snappedY;
    } else if(!this.brush && !this.stamper && !this.cameraDragStart){
      this.draggingObjectInstanceId = objectInstance.id
    }
  }

  onDragEnd = (pointer, objectInstance) => {
    if(objectInstance.id === HERO_INSTANCE_ID) {
      store.dispatch(editGameModel({ 
        hero: {
          spawnX: objectInstance.x,
          spawnY: objectInstance.y
        }
      }))
    } else {
      store.dispatch(editGameModel({ 
        objects: {
          [objectInstance.id]: {
            spawnX: objectInstance.x,
            spawnY: objectInstance.y
          }
        }
      }))
    }

  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // POINTER
  ////////////////////////////////////////////////////////////
  onPointerMove = (pointer)  => {
    window.pointer = pointer

    if(this.cameraDragStart && !this.brush && !this.stamper) {
      const cameraZoom = getCobrowsingState().editor.cameraZoom
      const deltaX = (this.cameraDragStart.x - pointer.x)/cameraZoom
      const deltaY = (this.cameraDragStart.y - pointer.y)/cameraZoom
      let scrollX = this.cameraDragStart.startScrollX + deltaX 
      let scrollY = this.cameraDragStart.startScrollY + deltaY
      this.editorCamera.setScroll(scrollX, scrollY)
      this.input.setDefaultCursor('grabbing');
    }

    const editor = getCobrowsingState().editor
    const brushId = editor.brushIdSelectedBrushList
    const classId = editor.classIdSelectedClassList
    const gameModel = store.getState().game.gameModel

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // BRUSHES
    ////////////////////////////////////////////////////////////
    if((!brushId && this.brush) || (this.brush && (this.brush.brushId !== brushId))) {
      this.destroyBrush()
    }

    if(brushId && !this.brush) {
      if(isBrushIdEraser(brushId)) {
        this.brush = new Eraser(this, brushId)
      } else {
        const brush = gameModel.brushes[brushId]
        this.brush = new Pencil(this, brushId, brush)
      }
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
      this.stamper = new Stamper(this, classId, objectClass)
    }
    if(this.stamper) {
      this.stamper.update(pointer)
    }

  }

  onPointerOver = (pointer, objectInstances) => {
    if(this.draggingObjectInstanceId) return
    objectInstances[0].outline.setVisible(true)
    objectInstances[0].outline2.setVisible(true)
  }

  onPointerDown = (pointer, gameObjects) => {
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
      if(this.brush) {
        this.canvas = this.getLayerById(this.brush.getLayerId())
        if(this.canvas) {
          this.brush.stroke(pointer, this.canvas)
        }
      } else if(!gameObjects.length && this.isEditModeOn && !this.cameraDragStart) {

        // PREVENTING CAMERA DRAG FUNCTIONALITY FOR NOW
        // const editorCamera = this.editorCamera
        // this.cameraDragStart = { x: pointer.x, y: pointer.y, startScrollX: editorCamera.scrollX, startScrollY: editorCamera.scrollY }
      }

    }
  }

  onPointerUp = (pointer) => {
    if(this.stamper && pointer.leftButtonReleased() && !this.draggingObjectInstanceId) {
      this.stamper.stamp(pointer)
    }

    this.draggingObjectInstanceId = null
    this.cameraDragStart = null
    this.input.setDefaultCursor('default');

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onPointerLeaveGame = () => {
    if(this.brush) this.destroyBrush()
    if(this.stamper) this.destroyStamp()
  }

  onPointerOut = (pointer, gameObjects) => {
    gameObjects[0].outline.setVisible(false)
    gameObjects[0].outline2.setVisible(false)
  }

  onPointerUpOutside = (pointer, objectInstances)  => {
    this.draggingObjectInstanceId = null
    this.cameraDragStart = null

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onMouseWheel = (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
    if(this.draggingObjectInstanceId || this.cameraDragStart) return

    window.pointer = pointer
    const zoomUpdate = (deltaY * 0.001)
    const newZoom = this.editorCamera.zoom - zoomUpdate

    if(newZoom <= 1) {
      store.dispatch(changeEditorCameraZoom(1))
    } else if(newZoom >= 10) {
      store.dispatch(changeEditorCameraZoom(10))
    } else {
      store.dispatch(changeEditorCameraZoom(newZoom))
    }
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // HELPERS
  ////////////////////////////////////////////////////////////
  destroyStamp() {
    this.stamper.destroy()
    this.stamper = null
  }

  destroyBrush() {
    this.brush.destroy()
    this.brush = null
  }

  onStrokeComplete = async () => {
    this.canvas.save()
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
        this.matter.world.setGravity(gravity.x, gravity.y)
      } else if(typeof gravity?.x === 'number') {
        this.matter.world.setGravity(gravity.x, currentGravity.y)
      } else if(typeof gravity?.y === 'number') {
        this.matter.world.setGravity(currentGravity.x, gravity.y)
      }
    }

    if(gameUpdate.awsImages) {
      if(gameUpdate.awsImages[this.backgroundLayer.textureId]) {
        this.backgroundLayer.updateTexture()
      }
      if(gameUpdate.awsImages[this.playgroundLayer.textureId]) {
        this.playgroundLayer.updateTexture()
      }
      if(gameUpdate.awsImages[this.overheadLayer.textureId]) {
        this.overheadLayer.updateTexture()
      }
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
        objectInstance.x = objectUpdate.spawnX
        objectInstance.y = objectUpdate.spawnY
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
      if(objectClass.useMass && classUpdate.mass >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setMass(classUpdate.mass)
        })
      }
      if(!objectClass.useMass && classUpdate.density >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDensity(classUpdate.density)
        })
      }
      if(classUpdate.friction >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setFriction(classUpdate.friction)
        })
      }
      if(classUpdate.frictionAir >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setFrictionAir(classUpdate.frictionAir)
        })
      }
      if(classUpdate.frictionStatic >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setFrictionStatic(classUpdate.frictionStatic)
        })
      }
      if(classUpdate.ignoreGravity !== undefined) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setIgnoreGravity(classUpdate.ignoreGravity)
        })
      }
      if(classUpdate.fixedRotation !== undefined) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setFixedRotation(classUpdate.fixedRotation)
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
    const gameWidth = gameModel.world.boundaries.width
    const gameHeight = gameModel.world.boundaries.height
    this.cameras.fromJSON({
      name: 'editor',
      x: 0,
      y: 0,
      width: gameWidth,
      height: gameHeight,
      zoom: 1,
      rotation: 0,
      scrollX: 0,
      scrollY: 0,
      roundPixels: false,
      visible: false,
      backgroundColor: false,
      bounds: {x: 0, y: 0, width: gameWidth, height: gameHeight},
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

      const isEditModeOn = lobby.isEditModeOn
      if(isEditModeOn) {
        this.isEditModeOn = true
      } else {
        this.isEditModeOn = false
      }
    }
    
    const cameraZoom = store.getState().editor.cameraZoom
    if(cameraZoom !== this.editorCamera.zoom) {
      this.editorCamera.setZoom(cameraZoom)
    }

    if(this.isEditModeOn) {
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

