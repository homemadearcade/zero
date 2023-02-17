import { ARCADE_PHYSICS, EFFECT_COLLIDE, EFFECT_STICK_TO, PLAYER_CLASS, PLAYER_INSTANCE_ID_PREFIX, MATTER_PHYSICS, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, EFFECT_RECLASS } from "../../constants";
import { areBSidesHit, isEventMatch } from "../../../utils/gameUtils";

export class Collider {
  constructor(scene, objectInstance, sensor){
    this.objectInstance = objectInstance
    this.sensor = sensor
    this.unregisters = []
    this.scene = scene

    this.collidingWith = []
    this.lastCollidingWith = null
    // this.onCollideEndRelations = {}

    // this.testRelationsList = []
  }

  registerRelations(relations) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcadeRelations(relations)
    } 
    if(this.scene.physicsType === MATTER_PHYSICS) {
      this.registerMatter(relations)
    } 
  }

  registerColliders(relations) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcadeColliders(relations)
    } 
  }


  update() {
    // if(this.lastCollidingWith) {
    //   this.lastCollidingWith.forEach((classId) => {
    //     if(this.collidingWith.indexOf(classId) === -1) {
    //       const relevantRelations = this.onCollideEndRelations[classId]
    //       if(relevantRelations) {
                // I stopped here cuz the issue is I need.. to keep track of instance ids which makes these arrays WAY longer, so really I need to flag which instance ids to keep track of...
    //       }
    //     }
    //   })
    // }

    // this.testRelationsList.forEach(() => {

    // })

    this.lastCollidingWith = this.collidingWith
    this.collidingWith = []
  }

  testForEffect(relation, instanceB, sides, swapWhoRunsEffect) {
    const effect = relation.effect 
    const event = relation.event

    const isOnEnter = this.lastCollidingWith?.indexOf(instanceB?.instanceId) === -1 // -> this would mean that instances couldnt do two effects.. && this.collidingWith?.indexOf(instanceB?.instanceId) === -1

    const alreadyCollidingWith = this.collidingWith.indexOf(instanceB?.instanceId) >= 0
    if(!alreadyCollidingWith) {
      this.collidingWith.push(instanceB?.instanceId)
    }
    
    if(event.type === ON_COLLIDE_ACTIVE) {
      // if(swapWhoRunsEffect) {
      //   this.scene.getObjectInstance(instanceB.instanceId).effects.runPersistentEffect(relation, this.objectInstance.sprite, sides)
      // } else {
        this.objectInstance.effects.runPersistentEffect(relation, instanceB, sides)
      // }
    }

    if(isOnEnter && (event.type === ON_COLLIDE_START || effect.type === EFFECT_STICK_TO)) {
      // if(swapWhoRunsEffect) {
      //   this.scene.getObjectInstance(instanceB.instanceId).runAccuteEffect(relation, this.objectInstance.sprite, sides)
      // } else {
        this.objectInstance.runAccuteEffect(relation, instanceB, sides)
      // }
    }
  }

  registerArcadeColliders(relations) {
    relations.forEach((relation) => {
      const {event, effect} = relation
      if(event.type === ON_COLLIDE_ACTIVE || event.type === ON_COLLIDE_START) {
        const releventInstancesB = [this.scene.playerInstance, ...this.scene.objectInstances].filter((objectInstance) => objectInstance.classId === event.classIdB).map(({sprite}) => sprite)
        if(event.classIdB === PLAYER_INSTANCE_ID_PREFIX) {
          releventInstancesB.push(this.scene.playerInstance.sprite)
        }

        if(effect.type === EFFECT_COLLIDE) {
          this.unregisters.push(
            this.scene.physics.add.collider(this.sensor.sprite, releventInstancesB, (instanceA, instanceB) => {
              instanceA.justCollided = true
              instanceB.justCollided = true
            })
          )
        } else {
          console.log('should not occccur')
        }
      }
    })
  }

  registerArcadeRelations(relations) {
    relations.forEach((relation) => {

      const {event, effect, sides} = relation

      if(event.type === ON_COLLIDE_ACTIVE || event.type === ON_COLLIDE_START) {
        const releventInstancesB = [this.scene.playerInstance, ...this.scene.objectInstances, ...this.scene.projectileInstances].filter((objectInstance) => objectInstance.classId === event.classIdB).map(({sprite}) => sprite)
        if(event.classIdB === PLAYER_INSTANCE_ID_PREFIX) {
          releventInstancesB.push(this.scene.playerInstance.sprite)
        }

        if(effect.type === EFFECT_COLLIDE) {
          console.log('this should not occur')

          // this.unregisters.push(
          //   this.scene.physics.add.collider(this.sensor.sprite, releventInstancesB, (instanceA, instanceB) => {
          //     instanceA.justCollided = true
          //     instanceB.justCollided = true
          //   })
          // )
        } else {
          this.unregisters.push(
            this.scene.physics.add.overlap(this.sensor.sprite, releventInstancesB, (a, b) => {
              if(sides.length) {
                if(areBSidesHit(sides, a, b)) this.testForEffect(relation, b, sides)
              } else  {
                this.testForEffect(relation, b, sides)
              }
            })
          )
        }
      }
    })
  }

  registerMatter(relations) { 
    const world = this.scene.matter.world

    relations.forEach((relation) => {
      const {event, effect} = relation

      const eventEffect = {
        objectA: this,
        callback: eventData => {
          const { gameObjectB, bodyB } = eventData;

          if(isEventMatch({
            gameObject: gameObjectB,
            body: bodyB,
            classId: event.classIdB,
            event,
            world
          })){
            this.runAccuteEffect(effect, gameObjectB)
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
            classId: event.classIdB,
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
      // this.onCollideEndRelations = {}
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }
}