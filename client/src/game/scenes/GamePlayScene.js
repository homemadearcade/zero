import store from '../../store';
import { resetGameInstanceState } from '../../store/actions/game/gameRoomInstanceActions';
import { GameInstance } from './GameInstance';

export class GamePlayScene extends GameInstance {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance

    this.gameState = null
    this.initializeGameState()
  }

  initializeGameState() {
    this.gameState = this.getStartingGameState()
  }

  callGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly}) {
    this.runGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly})
  }

  unregisterEvents() {

  }

  unload() {
    super.unload();
    store.dispatch(resetGameInstanceState())
    this.unregisterEvents()
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