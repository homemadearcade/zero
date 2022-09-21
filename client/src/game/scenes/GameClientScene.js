import {
  GAME_SCENE, HERO_INSTANCE_ID,
} from '../../constants';
import { ON_GAME_INSTANCE_UPDATE, ON_GAME_MODEL_UPDATE } from '../../store/types';
import { EditorScene } from './EditorScene';

export class GameClientScene extends EditorScene {
  constructor() {
    super({
      key: GAME_SCENE,
    });
  }

  onGameInstanceUpdate = ({objects, player}) => {
    objects.forEach((instanceUpdate) => {
      const objectId = instanceUpdate.id
      if(objectId === this.draggingObjectInstanceId) {
        return
      }
      const objectInstance = this.objectInstancesById[instanceUpdate.id]
      if(!objectInstance) return;
      this.updateObjectInstance(objectInstance, instanceUpdate)
    })

    if(this.draggingObjectInstanceId === HERO_INSTANCE_ID) return
    this.player.sprite.x = player.x 
    this.player.sprite.y = player.y
    this.player.sprite.rotation = player.rotation
  }

  create() {
    super.create()
    this.pause()
    window.socket.on(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
  }

  unload() {
    super.unload();
    window.socket.off(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    window.socket.off(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
  }
}