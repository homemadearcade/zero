import store from '../../store';
import { GameInstance } from './GameInstance';

export class GamePlayScene extends GameInstance {
  constructor(props) {
    super(props);

    this.gameRoom = props.gameRoom
  }

  callAnimation({type, data}) {
    this.runAnimation({type, data})
  }

  unregisterEvents() {

  }

  update(time, delta) {
    super.update(time, delta) 
    this.afterGameInstanceUpdateEffects()
    const gameState = store.getState().gameRoom.gameRoom.gameState
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