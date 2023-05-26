import store from "../../../store"
import { getCobrowsingState } from "../../../utils"
import { generateUniqueId } from "../../../utils/webPageUtils"
import { PROJECTILE_INSTANCE_DID } from "../../constants"

export class ControlledProjectileEjector {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.cursors = entityInstance.cursors
    this.scene = scene
    this.nextFire = 0
  }

  update(time, delta, projectileKey) {
    const entityModelId = this.entityInstance.entityModelId
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]

    if(projectileKey.isDown && entityModel.projectile?.entityModelId) {
      if(time < this.nextFire) { 
        return
      }

      const projectile = this.scene.addTemporaryInstance(PROJECTILE_INSTANCE_DID+generateUniqueId(), entityModel.projectile?.entityModelId)
      projectile.fireControlled(this.entityInstance, time, this.cursors)

      this.nextFire = time + entityModel.projectile.cooldown;
    }
  }
}