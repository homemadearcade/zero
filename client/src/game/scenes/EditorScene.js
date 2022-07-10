import Phaser from 'phaser';
import { v4 as uuidv4 } from 'uuid';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { editGameModel } from '../../store/actions/gameActions';
import { openContextMenuFromGameObject, openWorldContextMenu } from '../../store/actions/editorActions';

export class EditorScene extends GameInstance {
  constructor({key}) {
    super({
      key: key,
    });
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
    this.layerZero.save()
  }

  onPointerMove = (pointer)  => {
    if(this.paintingBrushId && pointer.isDown) {
      this.drawNodeAt(pointer)
    }
  }

  drawNodeAt({x, y}) {
    const nodeSize = store.getState().game.gameModel.world.nodeSize
    this.layerZero.draw('brush',
      Phaser.Math.Snap.To(x - 10, nodeSize),
      Phaser.Math.Snap.To(y - 10, nodeSize)
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
      const brushId = store.getState().editor.editorState.brushSelectedIdBrushList
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

      if(gravity?.x && gravity?.y) {
        this.matter.world.setGravity(gravity.x, gravity.y)
      } else if(gravity?.x) {
        this.matter.world.setGravity(gravity.x, currentGravity.y)
      } else if(gravity?.y) {
        this.matter.world.setGravity(currentGravity.x, gravity.y)
      }
    }


    if(gameUpdate.awsImages) {
      if(gameUpdate.awsImages[this.layerZero.textureId]) {
        this.layerZero.updateTexture()
      }
    }

    if(gameUpdate.objects) Object.keys(gameUpdate.objects).forEach((id) => {
      const objectUpdate = gameUpdate.objects[id]
      if(!this.objectInstancesById[id]) {
        this.addObjectInstance(id, objectUpdate)
      }
      if(objectUpdate === null) {
        this.removeObjectInstance(id)
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