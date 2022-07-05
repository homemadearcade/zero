import {
  GAME_SCENE,
} from '../../constants';
import { EditorScene } from './EditorScene';

export class GameHostScene extends EditorScene {
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
    this.lobbyId = lobbyId
  }

  startRemoteClientUpdateLoop = () => {
    let updateInterval = 1000/12
    setInterval(() => {
      const objects = this.objects.map(({id, x, y, rotation}) => {
        return {
          id,
          x,
          y,
          rotation
        }
      })
      
      const player = {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation
      }
      
      window.socket.emit('ON_GAME_INSTANCE_UPDATE', { lobbyId: this.lobbyId, objects, player})
    }, updateInterval)
  }

  onGameModelUpdate(payload) {

  }

  create() {
    super.create()
    this.matter.world.setBounds(0, 0, 1000, 1000);
    this.startRemoteClientUpdateLoop()
    window.socket.on('ON_GAME_MODEL_UPDATE', this.onGameModelUpdate)

    //game.loop.actualFps
  }

  destroy() {
    super.destroy();
    window.socket.off('ON_GAME_MODEL_UPDATE')
  }
}