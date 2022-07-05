import { v4 as uuidv4 } from 'uuid';
import { CoreScene } from './CoreScene';

export class EditorScene extends CoreScene {
  constructor({key, lobbyId, isNetworked, gameModel, closeContextMenu, openContextMenu, editGameModel}) {
    super({
      key: key,
      gameModel : gameModel,
      closeContextMenu : closeContextMenu,
      openContextMenu : openContextMenu,
      editGameModel : editGameModel,
      lobbyId : lobbyId,
    });

    this.gameModel = gameModel
    this.closeContextMenu = closeContextMenu
    this.openContextMenu = openContextMenu
    this.editGameModel = editGameModel
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
    this.editGameModel(this.gameModel)
  }

  onPointerOver = (pointer, gameObjects) => {
    if(this.draggingObjectId) return
    gameObjects[0].outline.setVisible(true)
    gameObjects[0].outline2.setVisible(true)
  }

  onPointerUp = (pointer, gameObjects) => {
    if(pointer.leftButtonReleased() && !this.draggingObjectId) {
      const gameModelObject = {
        id: uuidv4(),
        spawnX: pointer.x,
        spawnY: pointer.y
      }

      this.addInstanceObject(gameModelObject)
      this.editGameModel(this.gameModel)
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