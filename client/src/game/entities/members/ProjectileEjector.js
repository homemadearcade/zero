import store from "../../../store"
import { generateUniqueId } from "../../../utils/webPageUtils"
import { PROJECTILE_INSTANCE_ID_PREFIX, PROJECTILE_NONE } from "../../constants"

export class ProjectileEjector {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.scene = scene
    this.nextFire = 0
  }

  update(time, delta) {
    const classId = this.objectInstance.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]

    if(time < this.nextFire || !objectClass.projectile.classId || objectClass.projectile.projectileBehavior === PROJECTILE_NONE) { 
      return
    }

    const projectile = this.scene.addTemporaryInstance(PROJECTILE_INSTANCE_ID_PREFIX+generateUniqueId(), objectClass.projectile?.classId)
    projectile.fireAutomatic(this.objectInstance, time)

    this.nextFire = time + (objectClass.projectile.cooldown * 6) + 200;
  }
}