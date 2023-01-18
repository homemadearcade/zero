import {
  GAME_SCENE, HERO_INSTANCE_ID, PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, STOPPED_STATE,
} from '../constants';
import { ON_GAME_INSTANCE_ANIMATION, ON_GAME_INSTANCE_UPDATE, ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';

export class GameClientScene extends EditorScene {
  constructor(props) {
    super({
      key: props.key,
    });
  }

  onGameInstanceUpdate = ({objects, player, projectiles}) => {
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

    if(this.draggingObjectInstanceId === HERO_INSTANCE_ID) return

    this.playerInstance.sprite.x = player.x 
    this.playerInstance.sprite.y = player.y
    this.playerInstance.sprite.rotation = player.rotation
    this.playerInstance.setVisible(player.isVisible);
    this.playerInstance.destroyAfterUpdate = player.destroyAfterUpdate 
    this.playerInstance.reclassId = player.reclassId

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

    const gameState = getCobrowsingState({force: true}).gameContext.gameState
    if(this.gameState !== gameState) {
      this.onStateChange(this.gameState, gameState)
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