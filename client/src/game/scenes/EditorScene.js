import Phaser, { BlendModes } from 'phaser';
import { v4 as uuidv4 } from 'uuid';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/gameActions';
import { openContextMenuFromGameObject, openWorldContextMenu } from '../../store/actions/editorActions';
import { getTextureMetadata } from '../../utils/utils';
import { BACKGROUND_LAYER_DEPTH, HERO_INSTANCE_ID, OBJECT_INSTANCE_LAYER_DEPTH, OVERHEAD_LAYER_DEPTH, PLAYGROUND_LAYER_DEPTH } from '../../constants';
import { getDepthFromEraserId, isBrushIdEraser } from '../../utils/editor';

export class EditorScene extends GameInstance {
  constructor({key}) {
    super({
      key: key,
    });

    this.draggingObjectInstanceId = null
    this.currentDrawingLayer = null
    this.paintingBrushId = null
    this.brushPointSprite = null 
    this.classStampSprite = null
    this.isErasing = false
    this.lowerLayerPreviews = []
  }
  
  onDragStart = (pointer, objectInstance, dragX, dragY) => {
    if(this.draggingObjectInstanceId) {
      const classId = this.getObjectInstance(this.draggingObjectInstanceId).classId
      const objectClass= store.getState().game.gameModel.classes[classId]
      const { snappedX, snappedY } = this.getClassSnapXY({x: dragX, y: dragY}, objectClass)
      objectInstance.x = snappedX;
      objectInstance.y = snappedY;
    } else {
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

  onPointerOver = (pointer, objectInstances) => {
    if(this.draggingObjectInstanceId) return
    objectInstances[0].outline.setVisible(true)
    objectInstances[0].outline2.setVisible(true)
  }

  onPointerUp = (pointer) => {
    const classId = store.getState().editor.editorState.classSelectedIdClassList

    if(classId && pointer.leftButtonReleased() && !this.draggingObjectInstanceId) {
      const objectClass = store.getState().game.gameModel.classes[classId]

      const { snappedX, snappedY } = this.getClassSnapXY(pointer, objectClass)

      this.addGameObject(classId, {
        spawnX: snappedX, 
        spawnY: snappedY
      })
    }

    this.draggingObjectInstanceId = null

    if(this.paintingBrushId) {
      this.onBrushStrokeComplete()
    }
  }

  onPointerUpOutside = (pointer, objectInstances)  => {
    this.draggingObjectInstanceId = null

    if(this.paintingBrushId) {
      this.onBrushStrokeComplete()
    }
  }

  onBrushStrokeComplete = async () => {
    this.paintingBrushId = null
    this.currentDrawingLayer.save()
    this.currentDrawingLayer = null;
  }

  onPointerMove = (pointer)  => {
    // BRUSH STROKE
    const editorState = store.getState().editor.editorState
    const brushId = editorState.brushSelectedIdBrushList
    const classId = editorState.classSelectedIdClassList
    const gameModel = store.getState().game.gameModel

    if((!brushId && this.brushPointSprite) || (this.brushPointSprite && (this.brushPointSprite.brushId !== brushId))) {
      this.destroyBrush()
    }
    if(brushId && !this.brushPointSprite) {
      if(isBrushIdEraser(brushId)) {
        this.brushPointSprite = new Phaser.GameObjects.Image(this, 0,0, 'square10x10')
        this.createPreviewLayers()
        this.brushPointSprite.setBlendMode(BlendModes.ERASE)
        this.isErasing = true
      } else {
        const brush = gameModel.brushes[brushId]
        const { spriteSheetName, spriteIndex } = getTextureMetadata(brush.textureId)
        this.brushPointSprite = new Phaser.GameObjects.Image(this, 0,0, spriteSheetName, spriteIndex)
        this.isErasing = false
      }

      this.brushPointSprite.setOrigin(0, 0)
      this.brushPointSprite.brushId = brushId
      this.add.existing(this.brushPointSprite)
    }
    if(this.brushPointSprite) {
      this.updateBrushSprite(pointer)
    }
    if(this.paintingBrushId && pointer.isDown) {
      this.brush(pointer)
    }

    // CLASS STAMP
    if((!classId && this.classStampSprite) || (this.classStampSprite && (this.classStampSprite.classId !== classId))) {
      this.destroyStamp()
    }
    if(classId && !this.classStampSprite) {
      const objectClass = gameModel.classes[classId]
  
      const { spriteSheetName, spriteIndex } = getTextureMetadata(objectClass.textureId)
      this.classStampSprite = new Phaser.GameObjects.Image(this, 0,0, spriteSheetName, spriteIndex)
      this.classStampSprite.classId = classId
      this.add.existing(this.classStampSprite)
    }

    if(this.classStampSprite) {
      this.updateClassStamp(pointer)
    }
  }

  createPreviewLayers() {
    const editorState = store.getState().editor.editorState
    const brushId = editorState.brushSelectedIdBrushList
    const gameModel = store.getState().game.gameModel
    const eraserDepth = getDepthFromEraserId(brushId)
    const previewWidth = gameModel.world.boundaries.width
    const previewHeight = gameModel.world.boundaries.height

    if(eraserDepth === PLAYGROUND_LAYER_DEPTH) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this, 0, 0, previewWidth, previewHeight).draw(this.backgroundLayer, 0, 0).setDepth(PLAYGROUND_LAYER_DEPTH + 5)
      )
    } else if(eraserDepth === OVERHEAD_LAYER_DEPTH) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this, 0, 0, previewWidth, previewHeight).draw(this.backgroundLayer, 0, 0).setDepth(PLAYGROUND_LAYER_DEPTH + 5),
        new Phaser.GameObjects.RenderTexture(this, 0, 0, previewWidth, previewHeight).draw(this.playgroundLayer, 0, 0).setDepth(OVERHEAD_LAYER_DEPTH+ 5)
      )
    }

    this.lowerLayerPreviews.map((preview) => {
      this.add.existing(preview)
    })
  }

  destroyStamp() {
    this.classStampSprite.destroy()
    this.classStampSprite = null
  }

  destroyBrush() {
    this.brushPointSprite.destroy()
    this.brushPointSprite = null
    if(this.lowerLayerPreviews) {
      this.lowerLayerPreviews.forEach((preview) => {
        preview.destroy()
      })
      this.lowerLayerPreviews = []
    }
  }

  updateClassStamp(pointer) {
    const editorState =store.getState().editor.editorState
    const gameModel = store.getState().game.gameModel
    const classId = editorState.classSelectedIdClassList
    const objectClass = gameModel.classes[classId]

    const { snappedX, snappedY } = this.getClassSnapXY(pointer, objectClass)

    this.classStampSprite.setPosition(snappedX, snappedY)
    this.classStampSprite.setDisplaySize(objectClass.width, objectClass.height)
    this.classStampSprite.setDepth(OBJECT_INSTANCE_LAYER_DEPTH)
  }

  updateBrushSprite(pointer) {
    const editorState =store.getState().editor.editorState
    const gameModel = store.getState().game.gameModel
    const brushSize = editorState.brushSize
    const nodeSize = gameModel.world.nodeSize
    const brushId = editorState.brushSelectedIdBrushList

    const { snappedX, snappedY } = this.getBrushSnapXY(pointer)
    const newWidth = nodeSize * brushSize
    const newHeight = nodeSize * brushSize
    this.brushPointSprite.setPosition(snappedX, snappedY)
    this.brushPointSprite.setDisplaySize(newWidth, newHeight)
    
    if(isBrushIdEraser(brushId)) {
      const eraserDepth = getDepthFromEraserId(brushId)
      this.brushPointSprite.setDepth(eraserDepth)
    } else {
      const brush = gameModel.brushes[brushId]
      this.brushPointSprite.setDepth(brush.layer)
    }
  }

  getClassSnapXY({x, y}, objectClass) {
    const gameModel = store.getState().game.gameModel
    const nodeSize = gameModel.world.nodeSize

    const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x, nodeSize), objectClass.width/2, gameModel.world.boundaries.width - (objectClass.width/2))
    const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y, nodeSize), objectClass.height/2, gameModel.world.boundaries.height - (objectClass.height/2))

    return {
      snappedX,
      snappedY
    }
  }

  getBrushSnapXY({x, y}) {
    const gameModel = store.getState().game.gameModel
    const editorState =store.getState().editor.editorState
    const nodeSize = gameModel.world.nodeSize
    const brushSize = editorState.brushSize
    const blockSize = nodeSize * brushSize

    const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x - (blockSize/2), blockSize), 0, gameModel.world.boundaries.width)
    const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y - (blockSize/2), blockSize), 0, gameModel.world.boundaries.height)

    return {
      snappedX,
      snappedY
    }
  }

  brush(pointer) {
    const { snappedX, snappedY } = this.getBrushSnapXY(pointer)

    const args = [
      this.brushPointSprite,
      snappedX,
      snappedY
    ]

    if(this.isErasing) {
      this.currentDrawingLayer.erase(...args);
    } else {
      this.currentDrawingLayer.draw(...args);
    }
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

    const editorState =store.getState().editor.editorState
    const brushId = editorState.brushSelectedIdBrushList
    if(pointer.leftButtonDown() && brushId) {
      const gameModel = store.getState().game.gameModel

      if(isBrushIdEraser(brushId)) {
        this.currentDrawingLayer = this.getLayerById(getDepthFromEraserId(brushId))
      } else {
        const brush = gameModel.brushes[brushId]
        this.currentDrawingLayer = this.getLayerById(brush.layer)
      }

      this.paintingBrushId = brushId

      if(this.paintingBrushId) {
        this.brush(pointer)
      }
    }
  }

  getLayerById(layerId) {
    if(layerId === BACKGROUND_LAYER_DEPTH) {
      return this.backgroundLayer
    }
    if(layerId === PLAYGROUND_LAYER_DEPTH) {
      return this.playgroundLayer
    }
    if(layerId === OVERHEAD_LAYER_DEPTH) {
      return this.overheadLayer
    }

    console.error('didnt find layer with id', layerId, typeof layerId)
  }

  onPointerLeaveGame = () => {
    if(this.brushPointSprite) this.destroyBrush()
    if(this.classStampSprite) this.destroyStamp()
  }

  onPointerOut = (pointer, gameObjects) => {
    gameObjects[0].outline.setVisible(false)
    gameObjects[0].outline2.setVisible(false)
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
      }
      if(objectUpdate === null) {
        this.removeObjectInstance(id)
      }
      if(typeof objectUpdate.spawnX === 'number' || typeof objectUpdate.spawnY === 'number') {
        objectInstance.x = objectUpdate.spawnX
        objectInstance.y = objectUpdate.spawnY
      }
    })

    if(gameUpdate.classes) Object.keys(gameUpdate.classes).forEach((id) => {
      const classUpdate = gameUpdate.classes[id]
      
      if(classUpdate.bounciness >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setBounce(classUpdate.bounciness)
        })
      }
      if(classUpdate.density >= 0) {
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
    })
  }

  create() {
    super.create()

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
  }

  unload() {
    super.unload()
  }
}