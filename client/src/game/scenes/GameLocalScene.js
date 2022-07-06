import {
  GAME_SCENE,
} from '../../constants';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor({gameModel, closeContextMenu, openContextMenu}) {
    super({
      key: GAME_SCENE,
      gameModel : gameModel,
      closeContextMenu : closeContextMenu,
      openContextMenu : openContextMenu,
    });

    this.gameModel = gameModel
    this.closeContextMenu = closeContextMenu
    this.openContextMenu = openContextMenu
  }

  create() {
    super.create()
    this.matter.world.setBounds(0, 0, 1000, 1000);
    window.socket.on('ON_GAME_MODEL_UPDATE', this.onGameModelUpdate)
    //game.loop.actualFps
  }

  destroy() {
    super.destroy();
    window.socket.off('ON_GAME_MODEL_UPDATE')
  }
}