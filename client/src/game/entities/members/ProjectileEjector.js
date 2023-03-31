import store from "../../../store"
import { generateUniqueId } from "../../../utils/webPageUtils"
import { PROJECTILE_INSTANCE_ID_PREFIX, PROJECTILE_NONE } from "../../constants"

export class ProjectileEjector {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene
    this.nextFire = 0
  }

  update(time, delta) {
    const entityModelId = this.entityInstance.entityModelId
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]

    if(time < this.nextFire || !entityModel.projectile.entityModelId || entityModel.projectile.projectileBehavior === PROJECTILE_NONE) { 
      return
    }

    const projectile = this.scene.addTemporaryInstance(PROJECTILE_INSTANCE_ID_PREFIX+generateUniqueId(), entityModel.projectile?.entityModelId)
    projectile.fireAutomatic(this.entityInstance, time)

    this.nextFire = time + (entityModel.projectile.cooldown * 6) + 200;
  }
}