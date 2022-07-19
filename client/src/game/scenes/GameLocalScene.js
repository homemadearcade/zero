import {
  GAME_SCENE,
} from '../../constants';
import { ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor() {
    super({
      key: GAME_SCENE,
    });
  }

  create() {
    super.create()
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    //game.loop.actualFps
  }

  unload() {
    super.unload();
    window.socket.off(ON_GAME_MODEL_UPDATE)
  }
}