import store from '../../store';
import { GameInstance } from './GameInstance';

export class GamePlayScene extends GameInstance {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance
  }

  callGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly}) {
    this.runGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly})
  }

  unregisterEvents() {

  }

  update(time, delta) {
    super.update(time, delta) 
    this.afterGameInstanceUpdateEffects()
    const gameStatus = store.getState().gameRoomInstance.gameRoomInstance.gameStatus
    if(this.gameStatus !== gameStatus) {
      this.onStateChange(this.gameStatus, gameStatus)
    }

    if(this.isPaused) {
      this.pause()
    } else {
      this.resume()
    }
  }

}