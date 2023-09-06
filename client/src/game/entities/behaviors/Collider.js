import Phaser from "phaser";
import { 
  ARCADE_PHYSICS,
  EFFECT_STICK_TO,
  MATTER_PHYSICS,
  ON_TOUCH_ACTIVE, ON_COLLIDE_END, ON_TOUCH_START, 
  SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SIDE_DOWN,
  EFFECT_INVISIBLE, EFFECT_IGNORE_GRAVITY, EFFECT_GRAVITY_PULL, EFFECT_GRAVITY_PUSH, EFFECT_ALLOW_CLIMB, 
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
    const matterSprite = this.entityInstance.matterSprite

    // if(matterSprite.previousIgnoreGravityOverrideFlag && !matterSprite.ignoreGravityOverrideFlag) {
    //   matterSprite.ignoreGravityOverride = false
    // }

    // matterSprite.previousIgnoreGravityOverrideFlag = matterSprite.ignoreGravityOverrideFlag
    // matterSprite.ignoreGravityOverrideFlag = false

    ////////////////////////////////////////
    ////////////////////////////////////////
    // VISIBLITY AND IGNORE GRAVITY EFFECTS
    ////////////////////////////////////////
    ////////////////////////////////////////
    // STICK TO EFFECT
    if (matterSprite.heldByInstance) {
      matterSprite.body.position.x += matterSprite.heldByInstance.body.deltaXFinal();
      matterSprite.body.position.y += matterSprite.heldByInstance.body.deltaYFinal();   
    }
    
    if (matterSprite.heldByInstance && this.fallenOff(matterSprite, matterSprite.heldByInstance, matterSprite.heldReleaseSides)) {
      matterSprite.heldByInstance = null;   
      matterSprite.heldReleaseSides = null
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
      matterSprite.invisibleOverride = false 
      matterSprite.ignoreGravityOverride = false
      matterSprite.upKeyClimbOverride = false
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
    matterSpriteA,
    matterSpriteB,
    sidesA = [],
    sidesB = []
  }) => {
    const effect = relation.effect
  
    const [matterSprites, alternatematterSpriteData] = this.scene.getEffectedmatterSprites({
      matterSpriteA,
      matterSpriteB,
      sidesA,
      sidesB,
      effect: relation.effect
    })

    const runEffect = (matterSprite) => {
      if(effect.effectBehavior === EFFECT_INVISIBLE && !this.isVisibilityModified) {
        matterSprite.invisibleOverride = true
      }

      if(effect.effectBehavior === EFFECT_IGNORE_GRAVITY && !this.ignoreGravityOverrideFlag) {
        matterSprite.ignoreGravityOverride = true
      }

      if(effect.effectBehavior === EFFECT_STICK_TO) {
        if(!alternatematterSpriteData.matterSprite) console.error('bad!, stick to will not work here')

        matterSprite.heldByInstance = alternatematterSpriteData.matterSprite;   
        matterSprite.heldReleaseSides = alternatematterSpriteData.sides

        matterSprite.ignoreGravityOverride = true
      }

      if(effect.effectBehavior === EFFECT_ALLOW_CLIMB) {
        matterSprite.ignoreGravityOverride = true
        matterSprite.upKeyClimbOverride = true
      }

      if(effect.effectBehavior === EFFECT_GRAVITY_PULL || effect.effectBehavior === EFFECT_GRAVITY_PUSH) {
        matterSprite.ignoreGravityOverride = true
        const center = alternatematterSpriteData.matterSprite.body.center
        const x = matterSprite.body.position.x + matterSprite.body.width / 2
        const currentVelocityX = matterSprite.body.velocity.x
        const currentVelocityY = matterSprite.body.velocity.y

        let deltaVelocity = .01 * this.scene.lastDelta

        if(effect.effectBehavior === EFFECT_GRAVITY_PUSH) {
          deltaVelocity *= -1
        }

        if(center.x > x) {
          matterSprite.setVelocityX(currentVelocityX + deltaVelocity)
        } else {
          matterSprite.setVelocityX(currentVelocityX - deltaVelocity)
        }

        const y = matterSprite.body.position.y + matterSprite.body.height / 2
        if(center.y > y) {
          matterSprite.setVelocityY(currentVelocityY + deltaVelocity)
        } else {
          matterSprite.setVelocityY(currentVelocityY - deltaVelocity)
        }

      }
    }

    matterSprites.forEach((matterSprite) => {
      runEffect(matterSprite)
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
    matterSpriteA,
    matterSpriteB,
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
      const isOnEnter = this.lastCollidingWith?.indexOf(matterSpriteB?.entityInstanceId) === -1 // -> this would mean that instances couldnt do two effects.. && this.collidingWith?.indexOf(matterSpriteB?.entityInstanceId) === -1

      const alreadyCollidingWith = this.collidingWith.indexOf(matterSpriteB?.entityInstanceId) >= 0
      if(!alreadyCollidingWith) {
        this.collidingWith.push(matterSpriteB?.entityInstanceId)
      }
      
      if(event.eventType === ON_TOUCH_ACTIVE) {
        this.runCollideActiveEffect({
          relation: newRelation,
          matterSpriteA,
          matterSpriteB,
          sidesA,
          sidesB
        })
      }

      if(isOnEnter && (event.eventType === ON_TOUCH_START || effect.effectBehavior === EFFECT_STICK_TO)) {
        this.scene.runAccuteEffect({
          relation: newRelation,
          matterSpriteA,
          matterSpriteB,
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
      const releventSprites = releventInstances.map(({matterSprite}) => matterSprite)
      this.colliders.push(
        this.scene.physics.add.collider(this.sensor.matterSprite, releventSprites, (matterSpriteA, matterSpriteB) => {
          matterSpriteA.justCollided = true
          matterSpriteB.justCollided = true
        })
      )
    })
  }

  registerArcadeRelations(relations, entityInstancesByTag) {
    relations?.forEach((relation) => {
      const {event, sidesA, sidesB} = relation
      const releventInstances = entityInstancesByTag[event.relationTagIdB]

      if(!releventInstances || !releventInstances.length) return

      const releventSprites = releventInstances.map(({matterSprite}) => matterSprite)
      this.overlaps.push(
        this.scene.physics.add.overlap(this.sensor.matterSprite, releventSprites, (matterSpriteA, matterSpriteB) => {
          if(sidesB?.length) {
            if(!areBSidesHit(sidesB, matterSpriteA, matterSpriteB)) return
          }
          if(sidesA?.length) {
            if(!areBSidesHit(sidesA, matterSpriteB, matterSpriteA)) return
          }
          this.startRunCollideEffects({
            relation,
            matterSpriteA,
            matterSpriteB,
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

      const matterSprite = this.entityInstance.matterSprite
      matterSprite.heldByInstance = null
      // this.onCollideEndRelations = {}
    } 

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }
}