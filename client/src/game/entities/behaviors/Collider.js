import Phaser from "phaser";
import { 
  ARCADE_PHYSICS,
  EFFECT_STICK_TO,
  MATTER_PHYSICS,
  ON_TOUCH_ACTIVE, ON_COLLIDE_END, ON_TOUCH_START, 
  SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SIDE_DOWN,
  EFFECT_INVISIBLE, EFFECT_IGNORE_GRAVITY, EFFECT_GRAVITY_PULL, EFFECT_GRAVITY_PUSH, EFFECT_ALLOW_CLIMB, DIRECTIONAL_CONTROLS, 
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
    const physicsSprite = this.entityInstance.physicsSprite

    // if(physicsSprite.previousIgnoreGravityOverrideFlag && !physicsSprite.ignoreGravityOverrideFlag) {
    //   physicsSprite.ignoreGravityOverride = false
    // }

    // physicsSprite.previousIgnoreGravityOverrideFlag = physicsSprite.ignoreGravityOverrideFlag
    // physicsSprite.ignoreGravityOverrideFlag = false

    ////////////////////////////////////////
    ////////////////////////////////////////
    // VISIBLITY AND IGNORE GRAVITY EFFECTS
    ////////////////////////////////////////
    ////////////////////////////////////////
    // STICK TO EFFECT
    if (physicsSprite.heldByInstance) {
      physicsSprite.body.position.x += physicsSprite.heldByInstance.body.deltaXFinal();
      physicsSprite.body.position.y += physicsSprite.heldByInstance.body.deltaYFinal();   
    }
    
    if (physicsSprite.heldByInstance && this.fallenOff(physicsSprite, physicsSprite.heldByInstance, physicsSprite.heldReleaseSides)) {
      physicsSprite.heldByInstance = null;   
      physicsSprite.heldReleaseSides = null
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
      physicsSprite.invisibleOverride = false 
      physicsSprite.ignoreGravityOverride = false
      physicsSprite.upKeyClimbOverride = false
    }, 0)

    this.lastCollidingWith = this.collidingWith
    this.collidingWith = []
  }

  fallenOff(holder, heldByInstance, sides) {
    // if turns out to be annoying
    if(Phaser.Math.Distance.Between(holder.body.x, holder.body.y, heldByInstance.body.x, heldByInstance.body.y) > 100) {
      return true
    }

    if(sides[SIDE_LEFT] || sides[SIDE_RIGHT]) {
      return (
        holder.body.bottom <= heldByInstance.body.position.y ||
        holder.body.position.y >= heldByInstance.body.bottom 
      );
    } else if(sides[SIDE_UP] >= 0 || sides[SIDE_DOWN] >= 0) {
      return (
        holder.body.right <= heldByInstance.body.position.x ||
        holder.body.position.x >= heldByInstance.body.right 
      );
    } else {
      return (
        (holder.body.right <= heldByInstance.body.position.x ||
        holder.body.position.x >= heldByInstance.body.right) && (
          holder.body.bottom <= heldByInstance.body.position.y ||
          holder.body.position.y >= heldByInstance.body.bottom 
        )
      );
    }
  }
  
  runCollideActiveEffect = ({
    relation,
    physicsSpriteA,
    physicsSpriteB,
    sidesA = [],
    sidesB = []
  }) => {
    const effect = relation.effect
  
    const [physicsSprites, alternatephysicsSpriteData] = this.scene.getEffectedphysicsSprites({
      physicsSpriteA,
      physicsSpriteB,
      sidesA,
      sidesB,
      effect: relation.effect
    })

    const runEffect = (physicsSprite) => {
      if(effect.effectBehavior === EFFECT_INVISIBLE && !this.isVisibilityModified) {
        physicsSprite.invisibleOverride = true
      }

      if(effect.effectBehavior === EFFECT_IGNORE_GRAVITY && !this.ignoreGravityOverrideFlag) {
        physicsSprite.ignoreGravityOverride = true
      }

      if(effect.effectBehavior === EFFECT_STICK_TO) {
        if(!alternatephysicsSpriteData.physicsSprite) console.error('bad!, stick to will not work here')

        physicsSprite.heldByInstance = alternatephysicsSpriteData.physicsSprite;   
        physicsSprite.heldReleaseSides = alternatephysicsSpriteData.sides

        physicsSprite.ignoreGravityOverride = true
      }

      if(effect.effectBehavior === EFFECT_ALLOW_CLIMB) {
        physicsSprite.ignoreGravityOverride = true
        physicsSprite.upKeyClimbOverride = true
      }

      if(effect.effectBehavior === EFFECT_GRAVITY_PULL || effect.effectBehavior === EFFECT_GRAVITY_PUSH) {
        physicsSprite.ignoreGravityOverride = true
        const center = alternatephysicsSpriteData.physicsSprite.body.center
        const x = physicsSprite.body.position.x + physicsSprite.body.width / 2
        
        const entityInstance = this.scene.getEntityInstance(physicsSprite.entityInstanceId)
        const entityModel = this.scene.getGameModel().entityModels[physicsSprite.entityModelId]
        const rate = entityModel.movement.movementControlsBehavior === DIRECTIONAL_CONTROLS ? 3 : .05
        const gradual = entityModel.movement.movementControlsBehavior !== DIRECTIONAL_CONTROLS

        let currentVelocityX = 0;
        let currentVelocityY = 0;
        if(gradual) {
          currentVelocityX = physicsSprite.body.velocity.x
          currentVelocityY = physicsSprite.body.velocity.y
        }

        let deltaVelocity = rate * this.scene.lastDelta

        if(effect.effectBehavior === EFFECT_GRAVITY_PUSH) {
          deltaVelocity *= -1
        }

        if(center.x > x) {
          entityInstance.setVelocityX(currentVelocityX + deltaVelocity)
        } else {
          entityInstance.setVelocityX(currentVelocityX - deltaVelocity)
        }

        const y = physicsSprite.body.position.y + physicsSprite.body.height / 2
        if(center.y > y) {
          entityInstance.setVelocityY(currentVelocityY + deltaVelocity)
        } else {
          entityInstance.setVelocityY(currentVelocityY - deltaVelocity)
        }

      }
    }

    physicsSprites.forEach((physicsSprite) => {
      runEffect(physicsSprite)
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
    physicsSpriteA,
    physicsSpriteB,
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
      const isOnEnter = this.lastCollidingWith?.indexOf(physicsSpriteB?.entityInstanceId) === -1 // -> this would mean that instances couldnt do two effects.. && this.collidingWith?.indexOf(physicsSpriteB?.entityInstanceId) === -1

      const alreadyCollidingWith = this.collidingWith.indexOf(physicsSpriteB?.entityInstanceId) >= 0
      if(!alreadyCollidingWith) {
        this.collidingWith.push(physicsSpriteB?.entityInstanceId)
      }
      
      if(event.eventType === ON_TOUCH_ACTIVE) {
        this.runCollideActiveEffect({
          relation: newRelation,
          physicsSpriteA,
          physicsSpriteB,
          sidesA,
          sidesB
        })
      }

      if(isOnEnter && (event.eventType === ON_TOUCH_START || effect.effectBehavior === EFFECT_STICK_TO)) {
        this.scene.runAccuteEffect({
          relation: newRelation,
          physicsSpriteA,
          physicsSpriteB,
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
      const releventSprites = releventInstances.map(({physicsSprite}) => physicsSprite)
      this.colliders.push(
        this.scene.physics.add.collider(this.sensor.physicsSprite, releventSprites, (physicsSpriteA, physicsSpriteB) => {
          physicsSpriteA.justCollided = true
          physicsSpriteB.justCollided = true
        })
      )
    })
  }

  registerArcadeRelations(relations, entityInstancesByTag) {
    relations?.forEach((relation) => {
      const {event, sidesA, sidesB} = relation
      const releventInstances = entityInstancesByTag[event.relationTagIdB]

      if(!releventInstances || !releventInstances.length) return

      const releventSprites = releventInstances.map(({physicsSprite}) => physicsSprite)
      this.overlaps.push(
        this.scene.physics.add.overlap(this.sensor.physicsSprite, releventSprites, (physicsSpriteA, physicsSpriteB) => {
          if(sidesB?.length) {
            if(!areBSidesHit(sidesB, physicsSpriteA, physicsSpriteB)) return
          }
          if(sidesA?.length) {
            if(!areBSidesHit(sidesA, physicsSpriteB, physicsSpriteA)) return
          }
          this.startRunCollideEffects({
            relation,
            physicsSpriteA,
            physicsSpriteB,
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

      const physicsSprite = this.entityInstance.physicsSprite
      physicsSprite.heldByInstance = null
      // this.onCollideEndRelations = {}
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }
}