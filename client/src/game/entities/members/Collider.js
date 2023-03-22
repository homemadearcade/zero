import { ARCADE_PHYSICS, EFFECT_STICK_TO, PLAYER_INSTANCE_ID_PREFIX, MATTER_PHYSICS, ON_TOUCH_ACTIVE, ON_COLLIDE_END, ON_TOUCH_START, EFFECT_TRANSFORM } from "../../constants";
import { areBSidesHit, isEventMatch } from "../../../utils/gameUtils";

export class Collider {
  constructor(scene, entityInstance, sensor){
    this.entityInstance = entityInstance
    this.sensor = sensor
    this.overlaps = []
    this.colliders = []
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

  registerColliders(colliders) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcadeColliders(colliders)
    } 
  }

  update() {
    // if(this.lastCollidingWith) {
    //   this.lastCollidingWith.forEach((entityClassId) => {
    //     if(this.collidingWith.indexOf(entityClassId) === -1) {
    //       const relevantRelations = this.onCollideEndRelations[entityClassId]
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
    phaserInstanceA,
    phaserInstanceB,
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
      const isOnEnter = this.lastCollidingWith?.indexOf(phaserInstanceB?.entityInstanceId) === -1 // -> this would mean that instances couldnt do two effects.. && this.collidingWith?.indexOf(phaserInstanceB?.entityInstanceId) === -1

      const alreadyCollidingWith = this.collidingWith.indexOf(phaserInstanceB?.entityInstanceId) >= 0
      if(!alreadyCollidingWith) {
        this.collidingWith.push(phaserInstanceB?.entityInstanceId)
      }
      
      if(event.eventType === ON_TOUCH_ACTIVE) {
        this.entityInstance.effects.runCollideActiveEffect({
          relation: newRelation,
          phaserInstanceA,
          phaserInstanceB,
          sidesA,
          sidesB
        })
      }

      if(isOnEnter && (event.eventType === ON_TOUCH_START || effect.effectBehavior === EFFECT_STICK_TO)) {
        this.entityInstance.runAccuteEffect({
          relation: newRelation,
          phaserInstanceA,
          phaserInstanceB,
          sidesA,
          sidesB
        })
      }
    })
  }

  registerArcadeColliders(colliders) {
    colliders.forEach((collider) => {
      const { relationTagIdB } = collider
      const releventInstances = this.scene.entityInstancesByTag[relationTagIdB]
      if(!releventInstances || !releventInstances.length) return
      const releventSprites = releventInstances.map(({phaserInstance}) => phaserInstance)
      this.colliders.push(
        this.scene.physics.add.collider(this.sensor.phaserInstance, releventSprites, (phaserInstanceA, phaserInstanceB) => {
          phaserInstanceA.justCollided = true
          phaserInstanceB.justCollided = true
        })
      )
    })
  }

  registerArcadeRelations(relations) {
    relations?.forEach((relation) => {
      const {event, sidesA, sidesB} = relation
      const releventInstances = this.scene.entityInstancesByTag[event.relationTagIdB]
      if(!releventInstances || !releventInstances.length) return
      const releventSprites = releventInstances.map(({phaserInstance}) => phaserInstance)
      this.overlaps.push(
        this.scene.physics.add.overlap(this.sensor.phaserInstance, releventSprites, (phaserInstanceA, phaserInstanceB) => {
          if(sidesB?.length) {
            if(!areBSidesHit(sidesB, phaserInstanceA, phaserInstanceB)) return
          }
          if(sidesA?.length) {
            if(!areBSidesHit(sidesA, phaserInstanceB, phaserInstanceA)) return
          }
          this.startRunCollideEffects({
            relation,
            phaserInstanceA,
            phaserInstanceB,
            sidesA,
            sidesB
          })
        })
      )
    })
  }

  registerMatter(relations) { 
    const world = this.scene.matter.world

    relations?.forEach((relation) => {
      const {event, effect} = relation

      const eventEffect = {
        objectA: this,
        callback: eventData => {
          const { gameObjectB, bodyB } = eventData;

          if(isEventMatch({
            gameObject: gameObjectB,
            body: bodyB,
            entityClassId: event.entityClassIdB,
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
            entityClassId: event.entityClassIdB,
            event,
            world
          })){
            this.runRestore(effect, gameObjectB)
          }
        }
      }

      if(event === ON_TOUCH_START) {
        this.scene.matterCollision.addOnCollideStart(eventEffect);
      }
      if(event === ON_COLLIDE_END) {
        this.scene.matterCollision.addOnCollideEnd(eventEffect);
      }
      if(event === ON_TOUCH_ACTIVE) {
        this.scene.matterCollision.addOnCollideActive(eventEffect);
        this.scene.matterCollision.addOnCollideEnd(eventRestore)
      }
    })
  }

  unregister() {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.overlaps.forEach((overlap) =>  {
        overlap.destroy()
      })
      this.overlaps = []
      this.colliders.forEach((collider) =>  {
        collider.destroy()
      })
      this.colliders = []

      // this.onCollideEndRelations = {}
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }
}