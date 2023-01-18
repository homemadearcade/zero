import store from "../../../store"
import { ProjectileInstance } from "../ProjectileInstance"

export class ProjectileEjector {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.cursors = objectInstance.cursors
    this.scene = scene
  }

  update(time, delta) {
    const classId = this.objectInstance.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]

    if(this.cursors.space.isDown && objectClass.projectile?.classId) {
      if(time < this.nextFire) { 
        return
      }

      const projectile = this.scene.addProjectileInstance('hero-'+Math.random(), objectClass.projectile?.classId)
      projectile.fire(this.objectInstance, time, this.cursors)

      this.nextFire = time + objectClass.projectile.cooldown;
    }
  }
}