import {
  gameInstanceDisconnectedDelta,
  PLAYER_INSTANCE_ID_PREFIX, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, STOPPED_STATE,
} from '../constants';
import { ON_GAME_INSTANCE_ANIMATION, ON_GAME_INSTANCE_UPDATE, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, ON_GAME_MODEL_UPDATE } from '../../store/types';
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

  onGameInstanceUpdate = ({gameInstanceId, objects, player, projectiles, stageId, upsHost, upsServer}) => {
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

    objects.forEach((instanceUpdate) => {
      const instanceId = instanceUpdate.instanceId
      if(instanceId === this.draggingObjectInstanceId) {
        return
      }
      const objectInstance = this.objectInstancesById[instanceId]
      if(!objectInstance) {
        const modifiedClassData = { spawnX: instanceUpdate.x, spawnY: instanceUpdate.y, classId: instanceUpdate.classId }
        this.addObjectInstance(instanceId, modifiedClassData, true)
        return
      };
      this.updateObjectInstance(objectInstance, instanceUpdate)
    })

    projectiles.forEach((instanceUpdate) => {
      const instanceId = instanceUpdate.instanceId
      const projectileInstance = this.projectileInstancesById[instanceId]
      if(!projectileInstance) {
        this.addProjectileInstance(instanceId, instanceUpdate.classId)
        return
      };
      this.updateObjectInstance(projectileInstance, instanceUpdate)
      projectileInstance.destroyTime = instanceUpdate.destroyTime
    })

    if(this.draggingObjectInstanceId === PLAYER_INSTANCE_ID_PREFIX) return

    this.playerInstance.sprite.x = player.x 
    this.playerInstance.sprite.y = player.y
    this.playerInstance.sprite.rotation = player.rotation
    this.playerInstance.setVisible(player.isVisible);
    this.playerInstance.setVisible(player.isVisible);
    this.playerInstance.isVisible = player.isVisible
    this.playerInstance.destroyAfterUpdate = player.destroyAfterUpdate 
    this.playerInstance.reclassId = player.reclassId


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

  onGameInstanceAnimation = ({type, data}) => {
    if(data.hostOnly) return
    this.runAnimation({type, data})
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_INSTANCE_ANIMATION, this.onGameInstanceAnimation)
    window.socket.off(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    window.socket.off(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
  }

  create() {
    super.create()
    this.pause()
    this.isPaused = true
    window.socket.on(ON_GAME_INSTANCE_ANIMATION, this.onGameInstanceAnimation)
    window.socket.on(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
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
    if(gameState === STOPPED_STATE) {
      this.isPlaythrough = false
    }

    this.gameState = gameState
  }
}