import {
  GAME_SCENE,
} from '../constants';
import store from '../../store';
import { isGameContextPausing } from '../../utils/gameUtils';
import { GameInstance } from './GameInstance';

export class GamePlayScene extends GameInstance {
  constructor(props) {
    super({
      key: props.key,
    });
  }

  callAnimation({type, data}) {
    this.runAnimation({type, data})
  }

  unregisterEvents() {

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