import {
  disconnectedDelta,
} from '../constants';
import store from '../../store';
import { ON_GAME_INSTANCE_UPDATE, ON_GAME_MODEL_UPDATE, ON_GAME_INSTANCE_ANIMATION, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED } from '../../store/types';
import { EditorScene } from './EditorScene';
import { changeLobbyConnectionState} from '../../store/actions/lobbyActions';
import { GAME_CONNECTION_LOST } from '../../lobby/constants';

export class GameHostScene extends EditorScene {
  constructor(props) {
    super(props);

    this.sceneInstanceData = props.sceneInstanceData

    this.lastAcknowledgement = null
    
    this.lastUpsHostCount = null
    this.upsHostUpdates = 0
    this.upsHost = 0
    this.upsClient = 0
    this.upsServer = 0

    this.gameInstanceId = props.sceneInstanceData.gameInstanceId
    console.log(this.gameInstanceId)
  }

  callAnimation({type, data}) {
    window.socket.emit(ON_GAME_INSTANCE_ANIMATION, { lobbyId: store.getState().lobby.lobby.id, type, data})
    this.runAnimation({type, data})
  }

  startRemoteClientUpdateLoop = () => {
    let updateInterval = 1000/12
    this.remoteClientUpdateInterval = setInterval(() => {
      const currentStageId = store.getState().gameModel.currentStageId
      if(this.stage.id !== currentStageId) return
      const objects = this.objectInstances.map(({sprite: { id, x, y, rotation}, isVisible, destroyAfterUpdate, reclassId, classId}) => {
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

      const projectiles = this.projectileInstances.map(({sprite: { id, x, y, rotation}, isVisible, destroyTime, classId, destroyAfterUpdate, reclassId}) => {
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
        isVisible: this.playerInstance.isVisible,
        destroyAfterUpdate: this.playerInstance.destroyAfterUpdate,
        reclassId: this.playerInstance.reclassId
      }

      const time = Date.now();
      this.upsHostUpdates++;
      if (time > this.lastUpsHostCount + 1000) {
        this.upsHost = Math.round( ( this.upsHostUpdates * 1000 ) / ( time - this.lastUpsHostCount ) );
        this.lastUpsHostCount = time;
        this.upsHostUpdates = 0;
      }
      
      console.log(this.gameInstanceId)
      window.socket.emit(ON_GAME_INSTANCE_UPDATE, { gameInstanceId: this.gameInstanceId, lobbyId: store.getState().lobby.lobby.id, objects, player, projectiles, stageId: currentStageId, upsHost: this.upsHost })
      this.afterGameInstanceUpdateEffects() 
    }, updateInterval)
  }

  onGameInstanceUpdateAcknowledged = ({ upsClient, upsServer }) => {
    this.lastAcknowledgement = Date.now()
    this.upsClient = upsClient
    this.upsServer = upsServer
  }

  create() {
    super.create()
    
    this.startRemoteClientUpdateLoop()
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    window.socket.on(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, this.onGameInstanceUpdateAcknowledged)
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    window.socket.off(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, this.onGameInstanceUpdateAcknowledged)
    window.clearInterval(this.remoteClientUpdateInterval)
  }

  unload() {
    super.unload();
    this.unregisterEvents()
  }

  update(time, delta) {
    super.update(time, delta)

    const state = store.getState()
    const gameState = state.gameContext.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
    }

    if(this.lastAcknowledgement) {
      if(this.lastAcknowledgement + disconnectedDelta < Date.now()) {
        store.dispatch(changeLobbyConnectionState(GAME_CONNECTION_LOST, 'Your connection to your guide has been lost. This may resolve shorty. If it doesnt please refresh the page. If the problem continues further, your guide will contact you'))
        this.lastAcknowledgement = null
      } else if(state.lobby.connectionState) {
        store.dispatch(changeLobbyConnectionState(null))
      }
    }
    
    if(this.isPaused) {
      this.pause()
    } else {
      this.resume()
    }

  }
}