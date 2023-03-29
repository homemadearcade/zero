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
  }

  callGameInstanceEvent({gameInstanceEventType, data}) {
    window.socket.emit(ON_GAME_INSTANCE_EVENT, { 
      gameRoomInstanceId: this.gameRoomInstance.id,
      gameInstanceEventType, 
      data: {...data, fromHost: true}
    })
    this.runGameInstanceEvent({gameInstanceEventType, data})
  }

  onGameInstanceEvent = ({gameInstanceEventType, data}) => {
    if(!data.fromHost) {
      this.runGameInstanceEvent({gameInstanceEventType, data})
    }
  }

  startRemoteClientUpdateLoop = () => {
    let updateInterval = 1000/12
    this.remoteClientUpdateInterval = setInterval(() => {

      const gameInstanceId = store.getState().webPage.gameInstanceId
      if(this.gameInstanceId !== gameInstanceId) {
        console.error('host has incorrect game instance id', this.gameInstanceId, 'should be', gameInstanceId)
        // this.unload()
        // return
      }
      const currentStageId = store.getState().gameModel.currentStageId
      if(this.stage.stageId !== currentStageId) return
      const entityInstances = this.entityInstances.map(({phaserInstance: { entityInstanceId, x, y, rotation}, isVisible, destroyAfterUpdate, transformEntityClassId, entityClassId}) => {
        return {
          entityInstanceId,
          x,
          y,
          rotation,
          isVisible,
          destroyAfterUpdate, 
          transformEntityClassId,
          entityClassId
        }
      })

      const temporaryInstances = this.temporaryInstances.map(({phaserInstance: { entityInstanceId, x, y, rotation}, isVisible, destroyTime, entityClassId, destroyAfterUpdate, transformEntityClassId}) => {
        return {
          entityInstanceId,
          x,
          y,
          rotation,
          isVisible,
          entityClassId,
          destroyTime,
          destroyAfterUpdate, 
          transformEntityClassId,
        }
      })
      
      const playerInstance = {
        x: this.playerInstance.phaserInstance.x,
        y: this.playerInstance.phaserInstance.y,
        rotation: this.playerInstance.phaserInstance.rotation,
        isVisible: this.playerInstance.isVisible,
        destroyAfterUpdate: this.playerInstance.destroyAfterUpdate,
        transformEntityClassId: this.playerInstance.transformEntityClassId
      }
      
      this.updateNetworkStatus()
      window.socket.emit(ON_GAME_INSTANCE_UPDATE, 
        { 
          gameInstanceId: this.gameInstanceId, 
          gameRoomInstanceId: this.gameRoomInstance.id,
          entityInstances, 
          playerInstance, 
          temporaryInstances, 
          stageId: currentStageId, 
          upsHost: this.upsHost
        })
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

  create() {
    super.create()

    console.error('creating again...', this.gameInstanceId)
    
    this.startRemoteClientUpdateLoop()
    window.socket.on(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    this.clearGameModelUpdate = window.events.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
    window.socket.on(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, this.onGameInstanceUpdateAcknowledged)
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    this.clearGameModelUpdate()
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