import {
  gameInstanceDisconnectedDelta,
  PLAYER_INSTANCE_DID, PLAYTHROUGH_PLAY_STATE, PLAY_STATE,
} from '../constants';
import { ON_GAME_INSTANCE_EVENT, ON_GAME_INSTANCE_UPDATE, ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED, ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';
import store from '../../store';
import { changeErrorState, clearErrorState } from '../../store/actions/errorsActions';
import { changeCurrentStage } from '../../store/actions/game/gameModelActions';
import { GAME_ROOM_CONNECTION_LOST } from '../../constants';

export class GameClientScene extends EditorScene {
  constructor(props) {
    super(props);

    this.gameRoomInstance = props.gameRoomInstance

    this.lastHostUpdate = null

    this.lastUpsClientCount = null
    this.upsClientUpdates = 0
    this.upsClient = 0
    this.upsHost = 0
    this.upsServer = 0

    this.gameInstanceId = props.gameRoomInstance.gameInstanceId

    this.registerEvents()

    this.gameState = null

    this.checkGameState()
  }

  checkGameState() {
    const checkGameState = () => {
      const gameState = this.gameState
      console.log('checking game state: ', gameState)
      if(!gameState || !gameState.gameInstanceId || gameState.gameInstanceId !== this.gameInstanceId) {
        setTimeout(() => {  
          checkGameState()
        }, 1000)
      } else {
        console.log('game state is good')
        this.loadingText?.destroy()
        this.initializeWithGameState()
      }
    }

    checkGameState()
  }

  onGameInstanceUpdate = ({gameInstanceId, entityInstances, playerInstance, temporaryInstances, stageId, upsHost, upsServer, gameResetVersion}) => {
    if(gameInstanceId !== this.gameInstanceId) {
      console.error('Incorrect game instance', gameInstanceId, 'should be', this.gameInstanceId)
      // this.unload()
      // this.gameInstanceId = gameInstanceId
      return
    }

    if(gameResetVersion < this.gameResetVersion) {
      console.info('not updating because gameResetVersion is before gameResetVersion')
      return 
    }

    /////////////////////
    /////////////////////
    /////////////////////
    // INITIALIZE GAME STATE
    if(!this.gameState){
      this.gameState = {
        gameInstanceId,
        stages: {}
      }
    }
    if(!this.gameState.stages[stageId]) {
      this.gameState.stages[stageId] = {
        stageId: stageId,
        entityInstances: [],
        temporaryInstances: []
      }
    }
    /////////////////////
    /////////////////////

    this.updateNetworkStatus()
    this.upsHost = upsHost
    this.upsServer = upsServer

    if(!this.stage) return 
    
    if(this.stage.stageId !== stageId) {
      if(store.getState().cobrowsing.isActivelyCobrowsing)  {
        store.dispatch(changeCurrentStage(stageId))
      }
      return
    }

    if(this.playerInstance) {
      this.playerInstance.matterSprite.x = playerInstance.x 
      this.playerInstance.matterSprite.y = playerInstance.y
      this.playerInstance.matterSprite.rotation = playerInstance.rotation
      this.playerInstance.setVisible(playerInstance.isVisible);
      this.playerInstance.isVisible = playerInstance.isVisible
      this.playerInstance.destroyAfterUpdate = playerInstance.destroyAfterUpdate 
      this.playerInstance.transformEntityModelId = playerInstance.transformEntityModelId
    } else {
      const playerInstanceData = {
        spawnX: playerInstance.x,
        spawnY: playerInstance.y,
        ...playerInstance
      }
      this.addPlayerInstance(playerInstanceData)
      this.initializeCamera()
    }

    entityInstances.forEach((instanceUpdate) => {
      const entityInstanceId = instanceUpdate.entityInstanceId
      if(entityInstanceId === this.draggingEntityInstanceId) {
        return
      }
      const entityInstance = this.getEntityInstance(entityInstanceId)
      if(!entityInstance) {

        //bug fix: if we just removed this entity, don't add it back. This happens often
        if(entityInstanceId === this._recentlyRemovedEntityInstanceId) {
          // its possible this is where IC an check like... ok is it part of the game model or not?? 
          // if its not part of the game model then it can be created from this. Buuuut if its not - its spawned!
          console.info('successfully prevented adding back entity instance that was just removed')
          return 
        }

        const modifiedEntityData = { 
          spawnX: instanceUpdate.x, 
          spawnY: instanceUpdate.y, 
          entityModelId: instanceUpdate.entityModelId
        }

        this.addEntityInstance(entityInstanceId, modifiedEntityData, true)
        return
      };
      this.updateEntityInstance(entityInstance, instanceUpdate)
    })

    temporaryInstances.forEach((instanceUpdate) => {
      const entityInstanceId = instanceUpdate.entityInstanceId
      const temporaryInstance = this.temporaryInstancesById[entityInstanceId]
      if(!temporaryInstance) {
        this.addTemporaryInstance(entityInstanceId, instanceUpdate.entityModelId)
        return
      };
      this.updateEntityInstance(temporaryInstance, instanceUpdate)
      temporaryInstance.destroyTime = instanceUpdate.destroyTime
    })

    if(this.draggingEntityInstanceId === PLAYER_INSTANCE_DID) return

    /////////////////////
    /////////////////////
    /////////////////////
    // UPDATE GAME STATE
    this.gameState.stages[stageId].temporaryInstances = temporaryInstances
    this.gameState.stages[stageId].entityInstances = entityInstances
    this.gameState.playerInstance = playerInstance 
    /////////////////////
    /////////////////////

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
      gameRoomInstanceMongoId: this.gameRoomInstance.id,
      upsClient: this.upsClient,
    })
  }

  callGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly}) {
    window.socket.emit(ON_GAME_INSTANCE_EVENT, { 
      gameRoomInstanceMongoId: this.gameRoomInstance.id,
      gameRoomInstanceEventType, 
      data,
      hostOnly
    })
    if(!hostOnly) this.runGameInstanceEvent({gameRoomInstanceEventType, data, hostOnly})
  }

  onGameInstanceEvent = ({gameRoomInstanceEventType, data}) => {
    if(data.hostOnly) return
    this.runGameInstanceEvent({gameRoomInstanceEventType, data})
  }

  unregisterEvents() {
    window.socket.off(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    window.socket.off(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    if(this.clearGameModelUpdate) this.clearGameModelUpdate()
  }

  registerEvents() {
    window.socket.on(ON_GAME_INSTANCE_EVENT, this.onGameInstanceEvent)
    window.socket.on(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    this.clearGameModelUpdate = window.events.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
  }

  create() {
    super.create()
    this.pause()
    this.isPaused = true

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.loadingText = this.add.text(screenCenterX, screenCenterY, 'Waiting for host...').setOrigin(0.5);
  }

  unload() {
    super.unload()
    this.unregisterEvents()
  }

  update(time, delta) {
    super.update(time, delta)

    const gameStatus = store.getState().gameRoomInstance.gameRoomInstance.gameStatus
    if(this.gameStatus !== gameStatus) {
      this.onStateChange(this.gameStatus, gameStatus)
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

  onStateChange(oldGameStatus, gameStatus) {
    if(gameStatus === PLAY_STATE) {
      this.isPlaythrough = false
    }
    if(gameStatus === PLAYTHROUGH_PLAY_STATE) {
      this.isPlaythrough = true
    }

    this.gameStatus = gameStatus
  }
}