import { v4 as uuidv4 } from 'uuid';
import { CoreScene } from './CoreScene';
import store from '../../store';
import { getDiff } from '../../utils/utils';
import { editGameModel } from '../../store/actions/gameActions';

export class EditorScene extends CoreScene {
  constructor({key, lobbyId, closeContextMenu, openContextMenu}) {
    super({
      key: key,
    });

    this.closeContextMenu = closeContextMenu
    this.openContextMenu = openContextMenu
    this.lobbyId = lobbyId
  }
  
  onDragStart = (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
    this.draggingObjectId = gameObject.id
  }

  onDragEnd = (pointer, gameObject) => {
    gameObject.spawnX = gameObject.x;
    gameObject.spawnY = gameObject.y;
    const gameModelObject = this.getModelObjectById(gameObject.id)
    gameModelObject.spawnX = gameObject.x;
    gameModelObject.spawnY = gameObject.y;
    store.dispatch(editGameModel({ 
      objects: {
        [gameObject.id]: gameModelObject
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
        this.openContextMenu(gameObjects, pointer)
      }
    }
  }

  onPointerOut = (pointer, gameObjects) => {
    gameObjects[0].outline.setVisible(false)
    gameObjects[0].outline2.setVisible(false)
  }

  onGameModelUpdate = (gameUpdate) => {
    // const gameModel = store.getState().game.gameModel
    // console.log(gameModel.classes['9ab805a5-141e-4b54-91d6-b4901770d966'], gameUpdate.classes['9ab805a5-141e-4b54-91d6-b4901770d966'])
    // const diff = getDiff(gameModel, gameUpdate)
    // console.log('XX', diff)
    console.log(gameUpdate)
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
}