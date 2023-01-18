import {
  GAME_SCENE,
} from '../constants';
import store from '../../store';
import { ON_GAME_INSTANCE_UPDATE, ON_GAME_MODEL_UPDATE, ON_GAME_INSTANCE_ANIMATION } from '../../store/types';
import { isGameContextPausing } from '../../utils/gameUtils';
import { EditorScene } from './EditorScene';

export class GameHostScene extends EditorScene {
  constructor(props) {
    super({
      key: props.key,
    });
  }

  callAnimation({type, data}) {
    window.socket.emit(ON_GAME_INSTANCE_ANIMATION, { lobbyId: store.getState().lobby.lobby.id, type, data})
    this.runAnimation({type, data})
  }

  startRemoteClientUpdateLoop = () => {
    let updateInterval = 1000/12
    this.remoteClientUpdateInterval = setInterval(() => {
      const objects = this.objectInstances.map(({sprite: { id, x, y, rotation, isVisible}, destroyAfterUpdate, reclassId, classId}) => {
        return {
          id,
          x,
          y,
          rotation,
          isVisible,
          destroyAfterUpdate, 
          reclassId,
          classId
        }
      })

      const projectiles = this.projectileInstances.map(({sprite: { id, x, y, rotation, isVisible}, destroyTime, classId, destroyAfterUpdate, reclassId}) => {
        return {
          id,
          x,
          y,
          rotation,
          isVisible,
          classId,
          destroyTime,
          destroyAfterUpdate, 
          reclassId,
        }
      })
      
      const player = {
        x: this.playerInstance.sprite.x,
        y: this.playerInstance.sprite.y,
        rotation: this.playerInstance.sprite.rotation,
        isVisible: this.playerInstance.sprite.isVisible,
        destroyAfterUpdate: this.playerInstance.destroyAfterUpdate,
        reclassId: this.playerInstance.reclassId
      }
      
      window.socket.emit(ON_GAME_INSTANCE_UPDATE, { lobbyId: store.getState().lobby.lobby.id, objects, player, projectiles})
      this.afterGameInstanceUpdateEffects() 
    }, updateInterval)
  }

  create() {
    super.create()
    
    this.startRemoteClientUpdateLoop()
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)

    //game.loop.actualFps
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    window.clearInterval(this.remoteClientUpdateInterval)
  }

  unload() {
    super.unload();
    this.unregisterEvents()
  }

  update(time, delta) {
    super.update(time, delta)

    const gameState = store.getState().gameContext.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
    }
  }
}