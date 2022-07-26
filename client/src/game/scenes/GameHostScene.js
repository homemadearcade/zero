import {
  GAME_SCENE,
} from '../../constants';
import store from '../../store';
import { ON_GAME_INSTANCE_UPDATE, ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';

export class GameHostScene extends EditorScene {
  constructor() {
    super({
      key: GAME_SCENE,
    });

    this.isPaused = false
  }

  startRemoteClientUpdateLoop = () => {
    let updateInterval = 1000/12
    this.remoteClientUpdateInterval = setInterval(() => {
      const objects = this.objectInstances.map(({id, x, y, rotation}) => {
        return {
          id,
          x,
          y,
          rotation
        }
      })
      
      const player = {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation
      }
      
      window.socket.emit(ON_GAME_INSTANCE_UPDATE, { lobbyId: store.getState().lobby.lobby.id, objects, player})
    }, updateInterval)
  }

  create() {
    super.create()
    
    this.startRemoteClientUpdateLoop()
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)

    //game.loop.actualFps
  }

  unload() {
    super.unload();
    window.socket.off(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    window.clearInterval(this.remoteClientUpdateInterval)
  }

  update(time, delta) {
    super.update(time, delta)

    const lobby = store.getState().lobby.lobby
    if(lobby.id) {

      const isGamePaused = lobby.isGamePaused
      if(isGamePaused) {
        this.isPaused = true
        this.matter.pause()
      } else {
        this.isPaused = false
        this.matter.resume()
      }
    }
  }
}