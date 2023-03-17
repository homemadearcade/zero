import { ARCADE_PHYSICS, EFFECT_STICK_TO, PLAYER_INSTANCE_ID_PREFIX, MATTER_PHYSICS, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, EFFECT_RECLASS } from "../../constants";
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

  startRunCollideEffects({
    relation,
    instanceSpriteA,
    instanceSpriteB,
    sidesA = [],
    sidesB = []
  }) {
    Object.keys(relation.effects).forEach((effectId) => {
      const effect = relation.effects[effectId]
      const newRelation = {
        ...relation,
        effect,
        effects: undefined
      }

      const event = relation.event
      const isOnEnter = this.lastCollidingWith?.indexOf(instanceSpriteB?.instanceId) === -1 // -> this would mean that instances couldnt do two effects.. && this.collidingWith?.indexOf(instanceSpriteB?.instanceId) === -1

      const alreadyCollidingWith = this.collidingWith.indexOf(instanceSpriteB?.instanceId) >= 0
      if(!alreadyCollidingWith) {
        this.collidingWith.push(instanceSpriteB?.instanceId)
      }
      
      if(event.type === ON_COLLIDE_ACTIVE) {
        this.objectInstance.effects.runCollideActiveEffect({
          relation: newRelation,
          instanceSpriteA,
          instanceSpriteB,
          sidesA,
          sidesB
        })
      }

      if(isOnEnter && (event.type === ON_COLLIDE_START || effect.type === EFFECT_STICK_TO)) {
        this.objectInstance.runAccuteEffect({
          relation: newRelation,
          instanceSpriteA,
          instanceSpriteB,
          sidesA,
          sidesB
        })
      }
    })
  }

  registerArcadeColliders(relations) {
    relations.forEach((relation) => {
      const {event} = relation
      if(event.type === ON_COLLIDE_ACTIVE || event.type === ON_COLLIDE_START) {
        const releventInstances = [this.scene.playerInstance, ...this.scene.objectInstances].filter((objectInstance) => objectInstance.classId === event.classIdB).map(({sprite}) => sprite)

        this.unregisters.push(
          this.scene.physics.add.collider(this.sensor.sprite, releventInstances, (instanceSpriteA, instanceSpriteB) => {
            instanceSpriteA.justCollided = true
            instanceSpriteB.justCollided = true
          })
        )
      }
    })
  }

  registerArcadeRelations(relations) {
    relations.forEach((relation) => {
      const {event, sidesA, sidesB} = relation
      const releventInstances = this.scene.objectInstances.filter((objectInstance) => {
        return objectInstance.hasTag(event.tagIdB)
      })
      if(!releventInstances) return
      const releventSprites = releventInstances.map(({sprite}) => sprite)
      this.unregisters.push(
        this.scene.physics.add.overlap(this.sensor.sprite, releventSprites, (instanceSpriteA, instanceSpriteB) => {
          if(sidesB?.length) {
            if(!areBSidesHit(sidesB, instanceSpriteA, instanceSpriteB)) return
          }
          if(sidesA?.length) {
            if(!areBSidesHit(sidesA, instanceSpriteB, instanceSpriteA)) return
          }
          this.startRunCollideEffects({
            relation,
            instanceSpriteA,
            instanceSpriteB,
            sidesA,
            sidesB
          })
        })
      )
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
      this.unregisters = []
      // this.onCollideEndRelations = {}
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }
}