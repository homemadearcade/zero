import Phaser from "phaser";
import { 
  ARCADE_PHYSICS,
  EFFECT_STICK_TO,
  MATTER_PHYSICS,
  ON_TOUCH_ACTIVE, ON_COLLIDE_END, ON_TOUCH_START, 
  SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SIDE_DOWN,
  EFFECT_INVISIBLE, EFFECT_IGNORE_GRAVITY, 
} from "../../constants";
import { areBSidesHit, isEventMatch } from "../../../utils/gameUtils";
import store from "../../../store";

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

  update() {
    const entityModelId = this.entityInstance.entityModelId
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]
    const phaserInstance = this.entityInstance.phaserInstance

    // if(phaserInstance.previousIgnoreGravityOverrideFlag && !phaserInstance.ignoreGravityOverrideFlag) {
    //   phaserInstance.ignoreGravityOverride = false
    // }

    // phaserInstance.previousIgnoreGravityOverrideFlag = phaserInstance.ignoreGravityOverrideFlag
    // phaserInstance.ignoreGravityOverrideFlag = false

    ////////////////////////////////////////
    ////////////////////////////////////////
    // VISIBLITY AND IGNORE GRAVITY EFFECTS
    ////////////////////////////////////////
    ////////////////////////////////////////
    // STICK TO EFFECT
    if (phaserInstance.lockedTo) {
      phaserInstance.body.position.x += phaserInstance.lockedTo.body.deltaX();
      phaserInstance.body.position.y += phaserInstance.lockedTo.body.deltaY();   
    }
    
    if (phaserInstance.lockedTo && this.fallenOff(phaserInstance, phaserInstance.lockedTo, phaserInstance.lockedReleaseSides)) {
      phaserInstance.lockedTo = null;   
      phaserInstance.lockedReleaseSides = null
    }

    // if(this.lastCollidingWith) {
    //   this.lastCollidingWith.forEach((entityModelId) => {
    //     if(this.collidingWith.indexOf(entityModelId) === -1) {
    //       const relevantRelations = this.onCollideEndRelations[entityModelId]
    //       if(relevantRelations) {
                // I stopped here cuz the issue is I need.. to keep track of instance ids which makes these arrays WAY longer, so really I need to flag which instance ids to keep track of...
    //       }
    //     }
    //   })
    // }

    // this.testRelationsList.forEach(() => {

    // })

    setTimeout(() => {
      phaserInstance.invisibleOverride = false 
      phaserInstance.ignoreGravityOverride = false
    }, 0)

    this.lastCollidingWith = this.collidingWith
    this.collidingWith = []
  }

  fallenOff(player, platform, sides) {
    // if turns out to be annoying
    if(Phaser.Math.Distance.Between(player.body.x, player.body.y, platform.body.x, platform.body.y) > 100) {
      return true
    }

    if(sides[SIDE_LEFT] || sides[SIDE_RIGHT]) {
      return (
        player.body.bottom <= platform.body.position.y ||
        player.body.position.y >= platform.body.bottom 
      );
    } else if(sides[SIDE_UP] >= 0 || sides[SIDE_DOWN] >= 0) {
      return (
        player.body.right <= platform.body.position.x ||
        player.body.position.x >= platform.body.right 
      );
    } else {
      return (
        (player.body.right <= platform.body.position.x ||
        player.body.position.x >= platform.body.right) && (
          player.body.bottom <= platform.body.position.y ||
          player.body.position.y >= platform.body.bottom 
        )
      );
    }
  }
  
  runCollideActiveEffect = ({
    relation,
    phaserInstanceA,
    phaserInstanceB,
    sidesA = [],
    sidesB = []
  }) => {
    const effect = relation.effect
  
    const [phaserInstances, alternatePhaserInstanceData] = this.scene.getEffectedPhaserInstances({
      phaserInstanceA,
      phaserInstanceB,
      sidesA,
      sidesB,
      effect: relation.effect
    })

    const runEffect = (phaserInstance) => {
      if(effect.effectBehavior === EFFECT_INVISIBLE && !this.isVisibilityModified) {
        phaserInstance.invisibleOverride = true
      }

      if(effect.effectBehavior === EFFECT_IGNORE_GRAVITY && !this.ignoreGravityOverrideFlag) {
        phaserInstance.ignoreGravityOverride = true
      }

      if(effect.effectBehavior === EFFECT_STICK_TO) {
        if(!alternatePhaserInstanceData.phaserInstance) console.error('bad!, stick to will not work here')

        phaserInstance.lockedTo = alternatePhaserInstanceData.phaserInstance;   
        phaserInstance.lockedReleaseSides = alternatePhaserInstanceData.sides

        phaserInstance.ignoreGravityOverride = true
      }
    }

    phaserInstances.forEach((phaserInstance) => {
      runEffect(phaserInstance)
    })

  }


  registerRelations(relations, entityInstancesByTag) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcadeRelations(relations, entityInstancesByTag)
    } 
    if(this.scene.physicsType === MATTER_PHYSICS) {
      this.registerMatter(relations)
    } 
  }

  registerColliders(colliders, entityInstancesByTag) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcadeColliders(colliders, entityInstancesByTag)
    } 
  }

  startRunCollideEffects = ({
    relation,
    phaserInstanceA,
    phaserInstanceB,
    sidesA = [],
    sidesB = []
  }) => {
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
        this.runCollideActiveEffect({
          relation: newRelation,
          phaserInstanceA,
          phaserInstanceB,
          sidesA,
          sidesB
        })
      }

      if(isOnEnter && (event.eventType === ON_TOUCH_START || effect.effectBehavior === EFFECT_STICK_TO)) {
        this.scene.runAccuteEffect({
          relation: newRelation,
          phaserInstanceA,
          phaserInstanceB,
          sidesA,
          sidesB
        })
      }
    })
  }

  registerArcadeColliders(colliders, entityInstancesByTag) {
    colliders.forEach((collider) => {
      const { relationTagIdB } = collider
      const releventInstances = entityInstancesByTag[relationTagIdB]
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

  registerArcadeRelations(relations, entityInstancesByTag) {
    relations?.forEach((relation) => {
      const {event, sidesA, sidesB} = relation
      const releventInstances = entityInstancesByTag[event.relationTagIdB]
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
            entityModelId: event.entityModelIdB,
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
            entityModelId: event.entityModelIdB,
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

      const phaserInstance = this.entityInstance.phaserInstance
      phaserInstance.lockedTo = null
      // this.onCollideEndRelations = {}
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }
}