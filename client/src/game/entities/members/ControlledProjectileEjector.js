import store from "../../../store"
import { generateUniqueId } from "../../../utils/webPageUtils"
import { PROJECTILE_INSTANCE_ID_PREFIX } from "../../constants"

export class ControlledProjectileEjector {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.cursors = entityInstance.cursors
    this.scene = scene
    this.nextFire = 0
  }

  update(time, delta) {
    const entityClassId = this.entityInstance.entityClassId
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]

    if(this.cursors.space.isDown && entityClass.projectile?.entityClassId) {
      if(time < this.nextFire) { 
        return
      }

      const projectile = this.scene.addTemporaryInstance(PROJECTILE_INSTANCE_ID_PREFIX+generateUniqueId(), entityClass.projectile?.entityClassId)
      projectile.fireControlled(this.entityInstance, time, this.cursors)

      this.nextFire = time + entityClass.projectile.cooldown;
    }
  }
}