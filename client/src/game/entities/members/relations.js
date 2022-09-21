import Phaser from "phaser";
import { ARCADE_PHYSICS, EFFECT_CAMERA_SHAKE, EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_DIALOGUE, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_TELEPORT, MATTER_PHYSICS, ON_COLLIDE, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from "../../../constants";
import store from "../../../store";
import { areBSidesHit, isEventMatch } from "../../../utils/gameUtils";

export class Relations {
  constructor(scene, objectInstance, sensor){
    this.objectInstance = objectInstance
    this.sensor = sensor
    this.unregisters = []
    this.scene = scene
  }

  register(relationships) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcade(relationships)
    } 
    if(this.scene.physicsType === MATTER_PHYSICS) {
      this.registerMatter(relationships)
    } 
  }

  registerArcade(relationships) {
    relationships.forEach(({classId, event, effect, sides}) => {
      if(event === ON_COLLIDE) {
        const releventInstances = this.scene.objectInstances.filter((objectInstance) => objectInstance.classId === classId).map(({sprite}) => sprite)
        if(effect.id === EFFECT_COLLIDE) {
          this.scene.physics.add.collider(this.sensor.sprite, releventInstances)
        } else {
          this.scene.physics.add.collider(this.sensor.sprite, releventInstances, (a, b) => {
            if(sides.length && areBSidesHit(sides, a, b)) {
              this.runEffect(effect, b)
            } else {
              this.runEffect(effect, b)
            }
          })

        }
      }
    })
  }

  registerMatter(relationships) { 
    const world = this.scene.matter.world

    relationships.forEach(({classId, event, effect}) => {
      const eventEffect = {
        objectA: this,
        callback: eventData => {
          const { gameObjectB, bodyB } = eventData;

          if(isEventMatch({
            gameObject: gameObjectB,
            body: bodyB,
            classId,
            event,
            world
          })){
            this.runEffect(effect, gameObjectB)
          }
        }
      }

      const eventRestore = {
        objectA: this,
        callback: eventData => {
          const { gameObjectB, bodyB } = eventData;
          
          if(isEventMatch({
            gameObject: gameObjectB,
            body: bodyB,
            classId,
            event,
            world
          })){
            this.runRestore(effect, gameObjectB)
          }
        }
      }

      if(event === ON_COLLIDE_START) {
        this.scene.matterCollision.addOnCollideStart(eventEffect);
      }
      if(event === ON_COLLIDE_END) {
        this.scene.matterCollision.addOnCollideEnd(eventEffect);
      }
      if(event === ON_COLLIDE_ACTIVE) {
        this.scene.matterCollision.addOnCollideActive(eventEffect);
        this.scene.matterCollision.addOnCollideEnd(eventRestore)
      }
    })
  }

  unregister() {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.unregisters.forEach((fx) => fx())
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }

  runRestore(effect, agent) {
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[this.objectInstance.classId]
    // this.objectInstance.setCollideable(true);
    
    // MOVEMENT
    if(effect.id === EFFECT_IGNORE_GRAVITY) {
      this.objectInstance.setIgnoreGravity(objectClass.attributes.ignoreGravity)
    }
      
    // VFX
    if(effect.id === EFFECT_INVISIBLE) {
      this.objectInstance.setVisible(!objectClass.attributes.invisible)
    }
  }


  runEffect(effect, agent) {
    console.log(effect, agent)

    // MOVEMENT
    if(effect.id === EFFECT_TELEPORT) {
      this.objectInstance.setPosition(effect.x, effect.y)
    } else if(effect.id === EFFECT_IGNORE_GRAVITY) {
      this.objectInstance.setIgnoreGravity(true)
    }
    
    // LIFE
    if(effect.id === EFFECT_DESTROY) {
      this.objectInstance.destroyInGame()
    } else if(effect.id === EFFECT_SPAWN) {
      this.objectInstance.spawn()
    } else if(effect.id === EFFECT_RECLASS) {
      this.objectInstance.scene.removeObjectInstance(this.objectInstance.id)
      this.objectInstance.scene.addObjectInstance(this.objectInstance.id, {spawnX: this.objectInstance.sprite.x, spawnY: this.objectInstance.sprite.y, classId: effect.classId})
    }

    // NARRATIVE
    if(effect.id === EFFECT_CUTSCENE) {

    } else if(effect.id === EFFECT_DIALOGUE) {

    }
    
    // GRAPHICS
    if(effect.id === EFFECT_INVISIBLE) {
      this.objectInstance.setVisible(false)
    } else if(effect.id === EFFECT_CAMERA_SHAKE) {
      this.scene.cameras.main.shake(20)
    }
  }
}