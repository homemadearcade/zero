import {
  GAME_SCENE,
} from '../../constants';
import { EditorScene } from './EditorScene';

export class GameClientScene extends EditorScene {
  constructor({lobbyId, gameModel, closeContextMenu, openContextMenu, editGameModel}) {
    super({
      key: GAME_SCENE,
      gameModel : gameModel,
      closeContextMenu : closeContextMenu,
      openContextMenu : openContextMenu,
      editGameModel : editGameModel,
    });

    this.gameModel = gameModel
    this.closeContextMenu = closeContextMenu
    this.openContextMenu = openContextMenu
    this.editGameModel = editGameModel
  }

  onGameInstanceUpdate = ({objects, player}) => {
    objects.forEach((gameObjectUpdate) => {
      const gameInstanceObject = this.getInstanceObjectById(gameObjectUpdate.id)
      if(!gameInstanceObject) return;
      this.updateInstanceObject(gameInstanceObject, gameObjectUpdate)
    })

    if(this.draggingObjectId === 'player') return
    this.player.x = player.x 
    this.player.y = player.y
    this.player.rotation = player.rotation
  }

  create() {
    super.create()
    this.matter.world.setBounds(0, 0, 1000, 1000);
    this.matter.pause()
    window.socket.on('ON_GAME_INSTANCE_UPDATE', this.onGameInstanceUpdate)
  }
}