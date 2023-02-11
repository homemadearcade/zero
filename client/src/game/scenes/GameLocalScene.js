import store from '../../store';
import { ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';

export class GameLocalScene extends EditorScene {
  constructor(props) {
    super(props);

    this.gameSession = props.gameSession

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

    const gameState = store.getState().gameSession.gameSession.gameState
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