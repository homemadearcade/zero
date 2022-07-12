import {
  GAME_SCENE,
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

    if(this.draggingObjectInstanceId === 'player') return
    this.player.x = player.x 
    this.player.y = player.y
    this.player.rotation = player.rotation
  }

  create() {
    super.create()
    this.matter.world.setBounds(0, 0, 1000, 1000);
    this.matter.pause()
    window.socket.on(ON_GAME_INSTANCE_UPDATE, this.onGameInstanceUpdate)
    window.socket.on(ON_GAME_MODEL_UPDATE, this.onGameModelUpdate)
  }

  unload() {
    super.unload();
    window.socket.off(ON_GAME_INSTANCE_UPDATE)
    window.socket.off(ON_GAME_MODEL_UPDATE)
  }
}