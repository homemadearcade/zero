import {
  gameInstanceDisconnectedDelta,
  PLAYER_INSTANCE_ID_PREFIX, PLAYTHROUGH_PLAY_STATE, PLAY_STATE,
} from '../constants';
import { ON_GAME_INSTANCE_EVENT, ON_GAME_INSTANCE_UPDATE, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';
import store from '../../store';
import { changeErrorState, clearErrorState } from '../../store/actions/errorsActions';
import { changeCurrentStage } from '../../store/actions/gameModelActions';
import { GAME_ROOM_CONNECTION_LOST } from '../../constants';

export class GameClientScene extends EditorScene {
  constructor(props) {
    super(props);

    this.gameRoom = props.gameRoom

    this.lastHostUpdate = null

    this.lastUpsClientCount = null
    this.upsClientUpdates = 0
    this.upsClient = 0
    this.upsHost = 0
    this.upsServer = 0

    this.gameInstanceId = null
  }

  onGameInstanceUpdate = ({gameInstanceId, entityInstances, playerInstance, temporaryInstances, stageId, upsHost, upsServer}) => {
    if(!this.gameInstanceId) {
      this.gameInstanceId = gameInstanceId
    }
    
    if(gameInstanceId !== this.gameInstanceId) {
      console.error('Incorrect game instance', gameInstanceId, 'should be', this.gameInstanceId)
      // this.unload()
      // return
      this.gameInstanceId = gameInstanceId
    }

    this.updateNetworkStatus()
    this.upsHost = upsHost
    this.upsServer = upsServer

    if(this.stage.stageId !== stageId) {
      if(store.getState().cobrowsing.isActivelyCobrowsing)  {
        store.dispatch(changeCurrentStage(stageId))
      }
      return
    }

    entityInstances.forEach((instanceUpdate) => {
      const entityInstanceId = instanceUpdate.entityInstanceId
      if(entityInstanceId === this.draggingEntityInstanceId) {
        return
      }
      const entityInstance = this.getEntityInstance(entityInstanceId)
      if(!entityInstance) {
        const modifiedClassData = { spawnX: instanceUpdate.x, spawnY: instanceUpdate.y, entityClassId: instanceUpdate.entityClassId }
        this.addEntityInstance(entityInstanceId, modifiedClassData, true)
        return
      };
      this.updateEntityInstance(entityInstance, instanceUpdate)
    })

    temporaryInstances.forEach((instanceUpdate) => {
      const entityInstanceId = instanceUpdate.entityInstanceId
      const temporaryInstance = this.temporaryInstancesById[entityInstanceId]
      if(!temporaryInstance) {
        this.addTemporaryInstance(entityInstanceId, instanceUpdate.entityClassId)
        return
      };
      this.updateEntityInstance(temporaryInstance, instanceUpdate)
      temporaryInstance.destroyTime = instanceUpdate.destroyTime
    })

    if(this.draggingEntityInstanceId === PLAYER_INSTANCE_ID_PREFIX) return

    this.playerInstance.phaserInstance.x = playerInstance.x 
    this.playerInstance.phaserInstance.y = playerInstance.y
    this.playerInstance.phaserInstance.rotation = playerInstance.rotation
    this.playerInstance.setVisible(playerInstance.isVisible);
    this.playerInstance.isVisible = playerInstance.isVisible
    this.playerInstance.destroyAfterUpdate = playerInstance.destroyAfterUpdate 
    this.playerInstance.transformEntityClassId = playerInstance.transformEntityClassId

    this.afterGameInstanceUpdateEffects() 
  }

  updateNetworkStatus() {
    this.lastHostUpdate = Date.now()

    const time = Date.now();
    this.upsClientUpdates++;
    if (time > this.lastUpsClientCount + 1000) {
      this.upsClient = Math.round( ( this.upsClientUpdates * 1000 ) / ( time - this.lastUpsClientCount ) );
      this.lastUpsClientCount = time;
      this.upsClientUpdates = 0;
    }

    window.socket.emit(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, {
      gameRoomId: this.gameRoom.id,
      upsClient: this.upsClient,
    })
  }

  onGameInstanceEvent = ({gameInstanceEventType, data}) => {
    if(data.hostOnly) return
    this.runGameInstanceEvent({gameInstanceEventType, data})
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    window.socket.off(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    this.clearGameModelUpdate()
  }

  create() {
    super.create()
    this.pause()
    this.isPaused = true
    window.socket.on(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    window.socket.on(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    this.clearGameModelUpdate = window.events.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
  }

  unload() {
    super.unload();
    this.unregisterEvents()
  }

  update(time, delta) {
    super.update(time, delta)

    const gameState = store.getState().gameRoom.gameRoom.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
    }

    if(this.lastHostUpdate) {
      if(this.lastHostUpdate + gameInstanceDisconnectedDelta < Date.now()) {
        store.dispatch(changeErrorState(GAME_ROOM_CONNECTION_LOST, {message: 'Your connection to your participant has been lost. This may resolve shortly. If it doesnt please refresh the page. If the problem continues further, please contact your participant'}))
        this.lastHostUpdate = null
      } else if(store.getState().errors.errorStates[GAME_ROOM_CONNECTION_LOST].on) {
        store.dispatch(clearErrorState(GAME_ROOM_CONNECTION_LOST))
      }
    }
  }

  onStateChange(oldGameState, gameState) {
    if(gameState === PLAY_STATE) {
      this.isPlaythrough = false
    }
    if(gameState === PLAYTHROUGH_PLAY_STATE) {
      this.isPlaythrough = true
    }

    this.gameState = gameState
  }
}