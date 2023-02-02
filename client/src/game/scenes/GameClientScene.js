import {
  disconnectedDelta,
  PLAYER_INSTANCE_ID_PREFIX, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, STOPPED_STATE,
} from '../constants';
import { ON_GAME_INSTANCE_ANIMATION, ON_GAME_INSTANCE_UPDATE, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { changeLobbyConnectionState } from '../../store/actions/lobbyActions';
import { GAME_CONNECTION_LOST } from '../../lobby/constants';

export class GameClientScene extends EditorScene {
  constructor(props) {
    super(props);

    this.sceneInstanceData = props.sceneInstanceData

    this.lastUpdate = null

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
    if(gameInstanceId !== this.gameInstanceId) return
    if(this.stage.id !== stageId) return

    this.upsHost = upsHost
    this.upsServer = upsServer

    objects.forEach((instanceUpdate) => {
      const objectId = instanceUpdate.id
      if(objectId === this.draggingObjectInstanceId) {
        return
      }
      const objectInstance = this.objectInstancesById[instanceUpdate.id]
      if(!objectInstance) {
        const modifiedClassData = { spawnX: instanceUpdate.x, spawnY: instanceUpdate.y, classId: instanceUpdate.classId }
        this.addObjectInstance(instanceUpdate.id, modifiedClassData, true)
        return
      };
      this.updateObjectInstance(objectInstance, instanceUpdate)
    })

    projectiles.forEach((instanceUpdate) => {
      const projectileInstance = this.projectileInstancesById[instanceUpdate.id]
      if(!projectileInstance) {
        this.addProjectileInstance(instanceUpdate.id, instanceUpdate.classId)
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

    this.lastUpdate = Date.now()

    const time = Date.now();
    this.upsClientUpdates++;
    if (time > this.lastUpsClientCount + 1000) {
      this.upsClient = Math.round( ( this.upsClientUpdates * 1000 ) / ( time - this.lastUpsClientCount ) );
      this.lastUpsClientCount = time;
      this.upsClientUpdates = 0;
    }

    window.socket.emit(ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, {
      lobbyId: store.getState().lobby.lobby?.id,
      upsClient: this.upsClient,
    })

    this.afterGameInstanceUpdateEffects() 
  }

  onGameInstanceAnimation = ({type, data}) => {
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

    const gameState = getCobrowsingState({forceActiveCobrowsing: true}).gameContext.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
    }

    if(this.lastUpdate) {
      if(this.lastUpdate + disconnectedDelta < Date.now()) {
        store.dispatch(changeLobbyConnectionState(GAME_CONNECTION_LOST, 'Your connection to your participant has been lost. This may resolve shortly. If it doesnt please refresh the page. If the problem continues further, please contact your participant'))
        this.lastUpdate = null
      } else if(store.getState().lobby.connectionState) {
        store.dispatch(changeLobbyConnectionState(null))
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