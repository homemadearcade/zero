import _ from "lodash";
import Phaser from "phaser";
import { ARCADE_PHYSICS, EFFECT_COLLIDE, MATTER_PHYSICS, MOVEMENT_TURN_ON_COLLIDE, ON_COLLIDE, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START } from "../../../constants";
import store from "../../../store";
import { areBSidesHit, isEventMatch } from "../../../utils/gameUtils";

export class Collider {
  constructor(scene, objectInstance, sensor){
    this.objectInstance = objectInstance
    this.sensor = sensor
    this.unregisters = []
    this.scene = scene
  }

  register(relations) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcade(relations)
    } 
    if(this.scene.physicsType === MATTER_PHYSICS) {
      this.registerMatter(relations)
    } 
  }

  registerArcade(relations) {
    Object.keys(relations).map((relationId) => {
	    return relations[relationId]
    }).forEach(({event, effect, sides}) => {
      if(event.type === ON_COLLIDE) {
        const releventInstances = [this.scene.playerInstance, ...this.scene.objectInstances].filter((objectInstance) => objectInstance.classId === event.classId).map(({sprite}) => sprite)
        if(effect.type === EFFECT_COLLIDE) {
          this.unregisters.push(
            this.scene.physics.add.collider(this.sensor.sprite, releventInstances, (instanceA, instanceB) => {
              instanceA.justCollided = true
              instanceB.justCollided = true
            })
          )
        } else {
          this.unregisters.push(
            this.scene.physics.add.overlap(this.sensor.sprite, releventInstances, (a, b) => {
              if(sides.length) {
                if(areBSidesHit(sides, a, b)) this.objectInstance.runEffect(effect, b, sides)
              } else {
                this.objectInstance.runEffect(effect, b, sides)
              }
            })
          )
        }
      }
    })
  }

  registerMatter(relations) { 
    const world = this.scene.matter.world

    Object.keys(relations).map((relationId) => {
	    return relations[relationId]
    }).forEach(({event, effect}) => {
      const eventEffect = {
        objectA: this,
        callback: eventData => {
          const { gameObjectB, bodyB } = eventData;

          if(isEventMatch({
            gameObject: gameObjectB,
            body: bodyB,
            classId: event.classId,
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
            classId: event.classId,
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
      this.unregisters.forEach((fx) =>  {
        this.scene.physics.world.removeCollider(fx)
      })
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }
}