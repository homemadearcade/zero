import {
  GAME_OVER_STATE,
  GAME_SCENE, PLAYTHROUGH_PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, START_STATE, STOPPED_STATE, WIN_GAME_STATE,
} from '../constants';
import store from '../../store';
import { ON_GAME_MODEL_UPDATE } from '../../store/types';
import { isGameContextPausing } from '../../utils/gameUtils';
import { EditorScene } from './EditorScene';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';

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
    this.afterGameInstanceUpdateEffects()

    const gameState = store.getState().gameContext.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
    }
  }
}