import store from "../../../store"
import { generateUniqueId } from "../../../utils/webPageUtils"
import { PROJECTILE_INSTANCE_ID_PREFIX } from "../../constants"
import { ProjectileInstance } from "../ProjectileInstance"

export class ControlledProjectileEjector {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.scene = scene
    this.nextFire = Infinity
  }

  update(time, delta) {
    const classId = this.objectInstance.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]

    if(time < this.nextFire) { 
      return
    }

    const projectile = this.scene.addProjectileInstance(PROJECTILE_INSTANCE_ID_PREFIX+generateUniqueId(), objectClass.projectile?.classId)
    projectile.fire(this.objectInstance, time, this.cursors)

    this.nextFire = time + objectClass.projectile.cooldown;
  }
}