import {
  GAME_SCENE,
} from '../../constants';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor() {
    super({
      key: GAME_SCENE,
    });
  }

  create() {
    super.create()
    this.matter.world.setBounds(0, 0, 1000, 1000);
    window.socket.on('ON_GAME_MODEL_UPDATE', this.onGameModelUpdate)
    //game.loop.actualFps
  }

  unload() {
    super.unload();
    window.socket.off('ON_GAME_MODEL_UPDATE')
  }
}