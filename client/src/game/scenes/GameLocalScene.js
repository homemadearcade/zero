import store from '../../store';
import { resetGameInstanceState } from '../../store/actions/game/gameRoomInstanceActions';
import { ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance

    this.registerEvents()
    //game.loop.actualFps

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
    if(this.clearGameModelUpdate) this.clearGameModelUpdate()
  }

  registerEvents() {
    this.clearGameModelUpdate = window.events.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
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