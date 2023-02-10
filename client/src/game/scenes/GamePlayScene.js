import {
  GAME_SCENE,
} from '../constants';
import store from '../../store';
import { isGameContextPausing } from '../../utils/gameUtils';
import { GameInstance } from './GameInstance';

export class GamePlayScene extends GameInstance {
  constructor(props) {
    super(props);

    this.gameSession = props.gameSession
  }

  callAnimation({type, data}) {
    this.runAnimation({type, data})
  }

  unregisterEvents() {

  }

  update(time, delta) {
    super.update(time, delta) 
    this.afterGameInstanceUpdateEffects()
    const gameState = store.getState().gameContext.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
    }

    if(this.isPaused) {
      this.pause()
    } else {
      this.resume()
    }
  }

}