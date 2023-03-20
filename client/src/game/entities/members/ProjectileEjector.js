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
    const entityClassId = this.entityInstance.entityClassId
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]

    if(time < this.nextFire || !entityClass.projectile.entityClassId || entityClass.projectile.projectileBehavior === PROJECTILE_NONE) { 
      return
    }

    const projectile = this.scene.addTemporaryInstance(PROJECTILE_INSTANCE_ID_PREFIX+generateUniqueId(), entityClass.projectile?.entityClassId)
    projectile.fireAutomatic(this.entityInstance, time)

    this.nextFire = time + (entityClass.projectile.cooldown * 6) + 200;
  }
}