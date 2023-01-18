import {
  GAME_SCENE,
} from '../constants';
import store from '../../store';
import { ON_GAME_MODEL_UPDATE } from '../../store/types';
import { isGameContextPausing } from '../../utils/gameUtils';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor(props) {
    super({
      key: props.key,
    });
  }

  callAnimation({type, data}) {
    this.runAnimation({type, data})
  }

  create() {
    super.create()
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    //game.loop.actualFps
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
  }

  unload() {
    super.unload();
    this.unregisterEvents()
  }

  update(time, delta) {
    super.update(time, delta) 

    const state = store.getState()
    const gameContext = state.gameContext
    if(isGameContextPausing(gameContext)) {
      this.pause()
    } else {
      if(this.isPaused) {
        this.pause()
      } else {
        this.resume()
      }
    }

    this.afterGameInstanceUpdateEffects()
  }
}