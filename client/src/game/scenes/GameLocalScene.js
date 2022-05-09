import {
  GAME_SCENE,
} from '../../constants';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor({gameModel, closeContextMenu, openContextMenu, editGameModel}) {
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

  create() {
    super.create()
    this.matter.world.setBounds(0, 0, 1000, 1000);
    //game.loop.actualFps
  }
}