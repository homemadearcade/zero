import Phaser from 'phaser';
import { v4 as uuidv4 } from 'uuid';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/gameActions';
import { openContextMenuFromGameObject, openWorldContextMenu } from '../../store/actions/editorActions';
import { getTextureMetadata } from '../../utils/utils';
import { BACKGROUND_LAYER_DEPTH, OVERHEAD_LAYER_DEPTH, PLAYAREA_LAYER_DEPTH } from '../../constants';

export class EditorScene extends GameInstance {
  constructor({key}) {
    super({
      key: key,
    });

    this.draggingObjectInstanceId = null
    this.currentDrawingLayer = null
    this.paintingBrushId = null
  }
  
  onDragStart = (pointer, objectInstance, dragX, dragY) => {
    objectInstance.x = dragX;
    objectInstance.y = dragY;
    this.draggingObjectInstanceId = objectInstance.id
  }

  onDragEnd = (pointer, objectInstance) => {
    if(objectInstance.id === 'player') {
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
      this.addGameObject(classId, {
        spawnX: pointer.x, 
        spawnY: pointer.y
      })
    }

    // this.draggingObjectInstanceId = null

    if(this.paintingBrushId) {
      this.onBrushStrokeComplete()
    }
  }

  onPointerUpOutside = (pointer, objectInstances)  => {
    // this.draggingObjectInstanceId = null

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
    const editorState =store.getState().editor.editorState
    const brushId = editorState.brushSelectedIdBrushList

    if((!brushId && this.brushPointSprite) || (this.brushPointSprite && (this.brushPointSprite.brushId !== brushId))) {
      this.brushPointSprite.destroy()
      this.brushPointSprite = null
    }

    if(brushId && !this.brushPointSprite) {
      const gameModel = store.getState().game.gameModel
      const brush = gameModel.brushes[brushId]
  
      const { spriteSheetName, spriteIndex } = getTextureMetadata(brush.textureId)
      this.brushPointSprite = new Phaser.GameObjects.Image(this, 0,0, spriteSheetName, spriteIndex)
      this.brushPointSprite.setOrigin(0, 0)
      this.brushPointSprite.brushId = brushId
      this.add.existing(this.brushPointSprite)
    }



    if(this.brushPointSprite) {
      this.updateBrushSprite(pointer)
    }

    if(this.paintingBrushId && pointer.isDown) {
      this.drawNodeAt(pointer)
    }
  }

  updateBrushSprite(pointer) {
    const editorState =store.getState().editor.editorState
    const gameModel = store.getState().game.gameModel
    const brushSize = editorState.brushSize
    const nodeSize = gameModel.world.nodeSize
    const brushId = editorState.brushSelectedIdBrushList
    const brush = gameModel.brushes[brushId]

    const { snappedX, snappedY } = this.getSnapXY(pointer.x, pointer.y)
    this.brushPointSprite.setPosition(snappedX, snappedY)
    this.brushPointSprite.setDisplaySize(nodeSize * brushSize, nodeSize * brushSize)
    this.brushPointSprite.setDepth(brush.layer)
  }

  getSnapXY(x, y) {
    const gameModel = store.getState().game.gameModel
    const editorState =store.getState().editor.editorState
    const nodeSize = gameModel.world.nodeSize
    const brushSize = editorState.brushSize
    const blockSize = nodeSize * brushSize
    

    const snappedX = Phaser.Math.Snap.To(x - (blockSize/2), blockSize)
    const snappedY = Phaser.Math.Snap.To(y - (blockSize/2), blockSize)

    return {
      snappedX,
      snappedY
    }
  }

  drawNodeAt({x, y}) {
    //'square10x10'
    const { snappedX, snappedY } = this.getSnapXY(x, y)

    this.currentDrawingLayer.draw(
      this.brushPointSprite,
      snappedX,
      snappedY
    );
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
      const gameModel = store.getState().game.gameModel
      const editorState =store.getState().editor.editorState
      const brushId = editorState.brushSelectedIdBrushList
      const brush = gameModel.brushes[brushId]

      if(brush.layer === BACKGROUND_LAYER_DEPTH) {
        this.currentDrawingLayer = this.layer_1
      }
      if(brush.layer === PLAYAREA_LAYER_DEPTH) {
        this.currentDrawingLayer = this.layerZero
      }
      if(brush.layer === OVERHEAD_LAYER_DEPTH) {
        this.currentDrawingLayer = this.layer1
      }

      this.paintingBrushId = brushId

      if(this.paintingBrushId) {
        this.drawNodeAt(pointer)
      }
    }
  }

  onPointerOut = (pointer, gameObjects) => {
    gameObjects[0].outline.setVisible(false)
    gameObjects[0].outline2.setVisible(false)
  }

  getGameObjectById(id) {
    const gameModel = store.getState().game.gameModel

    if(id === 'player') {
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
      if(gameUpdate.awsImages[this.layer_1.textureId]) {
        this.layer_1.updateTexture()
      }
      if(gameUpdate.awsImages[this.layerZero.textureId]) {
        this.layerZero.updateTexture()
      }
      if(gameUpdate.awsImages[this.layer1.textureId]) {
        this.layer1.updateTexture()
      }
    }

    if(gameUpdate.objects) Object.keys(gameUpdate.objects).forEach((id) => {
      const objectUpdate = gameUpdate.objects[id]
      const objectInstance = this.objectInstancesById[id]
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
    this.input.dragDistanceThreshold = 16;
    this.input.on('drag', this.onDragStart);
    this.input.on('dragend', this.onDragEnd);
  }

  unload() {
    super.unload()
  }
}