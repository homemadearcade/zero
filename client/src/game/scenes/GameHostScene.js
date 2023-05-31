import {
  gameInstanceDisconnectedDelta,
} from '../constants';
import store from '../../store';
import { ON_GAME_INSTANCE_UPDATE, ON_GAME_MODEL_UPDATE, ON_GAME_INSTANCE_EVENT, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED } from '../../store/types';
import { EditorScene } from './EditorScene';
import { changeErrorState, clearErrorState } from '../../store/actions/errorsActions';
import { GAME_ROOM_CONNECTION_LOST } from '../../constants';

export class GameHostScene extends EditorScene {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance

    this.lastAcknowledgement = null
    
    this.lastUpsHostCount = null
    this.upsHostUpdates = 0
    this.upsHost = 0
    this.upsClient = 0
    this.upsServer = 0

    this.gameInstanceId = props.gameRoomInstance.gameInstanceId
    console.log('gameInstanceId', this.gameInstanceId)

    this.registerEvents()
  }
  
  callGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly}) {
    if(!hostOnly) window.socket.emit(ON_GAME_INSTANCE_EVENT, { 
      gameRoomInstanceMongoId: this.gameRoomInstance.id,
      gameRoomInstanceEventType, 
      data: {...data, fromHost: true},
      hostOnly
    })
    this.runGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly})
  }

  onGameInstanceEvent = ({gameRoomInstanceEventType, data, hostOnly}) => {
    if(!data.fromHost) {
      this.runGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly})
    }
  }

  startRemoteClientUpdateLoop = () => {
    let updateInterval = 1000/12
    this.remoteClientUpdateInterval = setInterval(() => {

      const gameModelId = store.getState().gameModel.gameModel.id
      if(this.gameRoomInstance.arcadeGameMongoId !== gameModelId) {
        console.error('host is sending updates for incorrect game model id', this.gameRoomInstance.arcadeGameMongoId, 'should be', gameModelId)
        // this.unload()
        return
      }
      const currentStageId = store.getState().gameModel.currentStageId

      if(!this.stage) return
      if(this.stage.stageId !== currentStageId) return
      const entityInstances = this.entityInstances.map(({phaserInstance: { entityInstanceId, x, y, rotation}, isVisible, destroyAfterUpdate, transformEntityModelId, entityModelId}) => {
        return {
          entityInstanceId,
          x,
          y,
          rotation,
          isVisible,
          destroyAfterUpdate, 
          transformEntityModelId,
          entityModelId
        }
      })

      const temporaryInstances = this.temporaryInstances.map(({phaserInstance: { entityInstanceId, x, y, rotation}, isVisible, destroyTime, entityModelId, destroyAfterUpdate, transformEntityModelId}) => {
        return {
          entityInstanceId,
          x,
          y,
          rotation,
          isVisible,
          entityModelId,
          destroyTime,
          destroyAfterUpdate, 
          transformEntityModelId,
        }
      })
      
      const playerInstance = {
        x: this.playerInstance.phaserInstance.x,
        y: this.playerInstance.phaserInstance.y,
        rotation: this.playerInstance.phaserInstance.rotation,
        isVisible: this.playerInstance.isVisible,
        destroyAfterUpdate: this.playerInstance.destroyAfterUpdate,
        transformEntityModelId: this.playerInstance.transformEntityModelId
      }
      
      this.updateNetworkStatus()
      
      window.socket.emit(ON_GAME_INSTANCE_UPDATE, 
        {
          gameInstanceId: this.gameInstanceId, 
          gameRoomInstanceMongoId: this.gameRoomInstance.id,
          entityInstances, 
          playerInstance, 
          temporaryInstances, 
          stageId: currentStageId, 
          upsHost: this.upsHost,
          updateDate: Date.now(),
        }
      )
      this.afterGameInstanceUpdateEffects() 

    }, updateInterval)
  }

  updateNetworkStatus() {
    const time = Date.now();
    this.upsHostUpdates++;
    if (time > this.lastUpsHostCount + 1000) {
      this.upsHost = Math.round( ( this.upsHostUpdates * 1000 ) / ( time - this.lastUpsHostCount ) );
      this.lastUpsHostCount = time;
      this.upsHostUpdates = 0;
    }
  }

  onGameInstanceUpdateAcknowledged = ({ upsClient, upsServer, tageId }) => {
    this.lastAcknowledgement = Date.now()
    this.upsClient = upsClient
    this.upsServer = upsServer
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    if(this.clearGameModelUpdate) this.clearGameModelUpdate()
    window.socket.off(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, this.onGameInstanceUpdateAcknowledged)
    window.clearInterval(this.remoteClientUpdateInterval)
  }

  registerEvents() {
    console.log('creating game instance with id:', this.gameInstanceId)
    this.startRemoteClientUpdateLoop()
    window.socket.on(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    this.clearGameModelUpdate = window.events.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    window.socket.on(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, this.onGameInstanceUpdateAcknowledged)
  }

  unload() {
    super.unload();
    this.unregisterEvents()
  }

  update(time, delta) {
    super.update(time, delta)

    const state = store.getState()
    const gameState = state.gameRoomInstance.gameRoomInstance.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
    }

    if(this.lastAcknowledgement) {
      if(this.lastAcknowledgement + gameInstanceDisconnectedDelta < Date.now()) {
        store.dispatch(changeErrorState(GAME_ROOM_CONNECTION_LOST, {message: 'Your connection to your guide has been lost. This may resolve shorty. If it doesnt please refresh the page. If the problem continues further, your guide will contact you'}))
        this.lastAcknowledgement = null
      } else if(store.getState().errors.errorStates[GAME_ROOM_CONNECTION_LOST].on) {
        store.dispatch(clearErrorState(GAME_ROOM_CONNECTION_LOST))
      }
    }
    
    if(this.isPaused) {
      this.pause()
    } else {
      this.resume()
    }

  }
}