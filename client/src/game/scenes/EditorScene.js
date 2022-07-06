import { v4 as uuidv4 } from 'uuid';
import { CoreScene } from './CoreScene';
import store from '../../store';
import { editGameModel } from '../../store/actions/gameActions';
import { openContextMenu } from '../../store/actions/editorActions';

export class EditorScene extends CoreScene {
  constructor({key}) {
    super({
      key: key,
    });
  }
  
  onDragStart = (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
    this.draggingObjectId = gameObject.id
  }

  onDragEnd = (pointer, gameObject) => {
    store.dispatch(editGameModel({ 
      objects: {
        [gameObject.id]: {
          spawnX: gameObject.x,
          spawnY: gameObject.y
        }
      }
    }))
  }

  onPointerOver = (pointer, gameObjects) => {
    if(this.draggingObjectId) return
    gameObjects[0].outline.setVisible(true)
    gameObjects[0].outline2.setVisible(true)
  }

  onPointerUp = (pointer, gameObjects) => {
    const classId = store.getState().editor.editorState.classSelectedId

    if(classId && pointer.leftButtonReleased() && !this.draggingObjectId) {
      const gameModelObject = {
        classId,
        id: uuidv4(),
        spawnX: pointer.x,
        spawnY: pointer.y
      }

      store.dispatch(editGameModel({
        objects: {
          [gameModelObject.id]: gameModelObject
        }
      }))

      this.addInstanceObject(gameModelObject)
    }

    this.draggingObjectId = null
  }

  onPointerUpOutside = (pointer, gameObjects)  => {
    this.draggingObjectId = null
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
        store.dispatch(openContextMenu(gameObjects, pointer))
      }
    }
  }

  onPointerOut = (pointer, gameObjects) => {
    gameObjects[0].outline.setVisible(false)
    gameObjects[0].outline2.setVisible(false)
  }

  onGameModelUpdate = (gameUpdate) => {
    if(gameUpdate.objects) Object.keys(gameUpdate.objects).forEach((id) => {
      const objectUpdate = gameUpdate.objects[id]
      if(!this.objectsById[id]) {
        this.addInstanceObject(objectUpdate)
      }
    })

    if(gameUpdate.classes) Object.keys(gameUpdate.classes).forEach((id) => {
      const classUpdate = gameUpdate.classes[id]
      
      if(classUpdate.bounciness >= 0) {
        this.forAllObjectsMatchingClassId(id, (object) => {
          object.setBounce(classUpdate.bounciness)
        })
      }
      if(classUpdate.mass >= 0) {
        this.forAllObjectsMatchingClassId(id, (object) => {
          object.setMass(classUpdate.mass)
        })
      }
      if(classUpdate.density >= 0) {
        this.forAllObjectsMatchingClassId(id, (object) => {
          object.setDensity(classUpdate.density)
        })
      }
      if(classUpdate.friction >= 0) {
        this.forAllObjectsMatchingClassId(id, (object) => {
          object.setFriction(classUpdate.friction)
        })
      }
      if(classUpdate.frictionAir >= 0) {
        this.forAllObjectsMatchingClassId(id, (object) => {
          object.setFrictionAir(classUpdate.frictionAir)
        })
      }
      if(classUpdate.frictionStatic >= 0) {
        this.forAllObjectsMatchingClassId(id, (object) => {
          object.setFrictionStatic(classUpdate.frictionStatic)
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

    this.input.dragDistanceThreshold = 16;
    this.input.on('drag', this.onDragStart);
    this.input.on('dragend', this.onDragEnd);
  }

  unload() {
    super.unload()
  }
}