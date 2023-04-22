import store from '../../store';
import { ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance

  }

  callGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly}) {
    this.runGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly})
  }

  create() {
    super.create()
    this.clearGameModelUpdate = window.events.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    //game.loop.actualFps
  }

  unregisterEvents() {
    this.clearGameModelUpdate()
  }

  unload() {
    super.unload();
    this.unregisterEvents()
  }

  update(time, delta) {
    super.update(time, delta) 
    this.afterGameInstanceUpdateEffects()

    const gameState = store.getState().gameRoomInstance.gameRoomInstance.gameState
    if(this.gameState !== gameState) {
      // this.onStateChange(this.gameState, gameState)
    }

    if(this.isPaused) {
      this.pause()
    } else {
      this.resume()
    }
  }
}