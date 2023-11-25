import { DEFAULT_TEXTURE_ID, ON_SPAWN, BOUNDARY_COLLIDE, BOUNDARY_WRAP, ON_DESTROY_ONE, ON_DESTROY_ALL, ON_INTERACT, ON_TOUCH_START, ON_TOUCH_ACTIVE } from "../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { PhysicsSprite } from "./behaviors/PhysicsSprite";
import { Collider } from "./behaviors/Collider";
import { Graphics } from "./behaviors/Graphics";
import { Movement } from "./behaviors/Movement";
import { ProjectileEjector } from "./behaviors/ProjectileEjector";

export class EntityInstance extends PhysicsSprite {
  constructor(scene, entityInstanceId, entityInstanceData, effectSpawned){
    const {spawnX, spawnY, entityModelId, transformCancelEntityModelId} = entityInstanceData

    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[entityModelId]

    const textureId = entityModel.graphics.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    super(scene, { spawnX, spawnY, textureId, spriteIndex, spriteSheetName })
    
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // STORE
    this.entityInstanceId = entityInstanceId
    this.entityModelId = entityModelId
    this.transformCancelEntityModelId = transformCancelEntityModelId
    this.scene = scene

    this.width = entityInstanceData.width || entityModel.graphics.width
    this.height = entityInstanceData.height || entityModel.graphics.height
    this.physicsSprite.entityInstanceId = entityInstanceId
    this.physicsSprite.effectSpawned = effectSpawned
    this.effectSpawned = effectSpawned
    this.physicsSprite.entityModelId = entityModelId
    scene.entityInstanceGroup.add(this.physicsSprite)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // GRAPHICAL
    this.graphics = new Graphics(scene, this)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PHYSICS
    this.movement = new Movement(scene, this)
    this.setBounce(entityModel.collisionResponse.bounciness)
    // this.setImmovable(entityModel.collisionResponse.immovable)
    this.setPushable(!entityModel.collisionResponse.notPushable)
    // this.setMass(entityModel.collisionResponse.mass)
    // this.setFriction(entityModel.collisionResponse.friction)
    const boundaryRelation = entityModel.boundaryRelation
    if(entityModel.collisionResponse.ignoreStageBoundaries) {
      this.setCollideWorldBounds(false)
    } else if(boundaryRelation === BOUNDARY_COLLIDE) {
      this.setCollideWorldBounds(true)
    }
    this.setCollideIgnoreSides(entityModel.collisionResponse.ignoreSides)
    if(entityInstanceData.velocityX) {
      this.setVelocityX(entityInstanceData.velocityX)
    }
    if(entityInstanceData.velocityY) {
      this.setVelocityY(entityInstanceData.velocityY)
    }


    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // RELATIONS
    this.collider = new Collider(scene, this, this)

    setTimeout(() => {
      this.scene.relationsByEventType[ON_SPAWN]?.forEach(this.runRelation)
    })

    this.projectileEjector = new ProjectileEjector(scene, this)

    this.ignoreGravityOverride = null

    this.invisibleOverride = null

    return this
  }

  runRelation = (relation, physicsSpriteB) => {
    const { event } = relation
    if(this.hasTag(event.relationTagIdA)) {
      Object.keys(relation.effects).forEach((effectId) => {
        const effect = relation.effects[effectId]
        if(!effect) return

        this.runAccuteEffect({
          relation: {
            ...relation,
            effect,
            effects: undefined
          },
          physicsSpriteA: this.physicsSprite,
          physicsSpriteB,
        })
      })
    }
  }
  
  hasTag(relationTagId) {
    const entityModel = store.getState().gameModel.gameModel.entityModels[this.entityModelId]
    return !!entityModel.relationTags[relationTagId]
  }

  runAccuteEffect({
    relation, 
    physicsSpriteA,
    physicsSpriteB,
    sidesA =[],
    sidesB = []
  }) {
    this.scene.runAccuteEffect({
      relation,
      physicsSpriteA,
      physicsSpriteB,
      sidesA,
      sidesB
    })
  }

  setSize(w, h) {
    this.width = w
    this.height = h
    super.setSize(w, h)
    this.graphics.setSize(w, h)
  }

  setDepth(depth) {
    super.setDepth(depth)
    this.graphics.setDepth(depth)
  }

  update(time, delta) {
    const entityModel = store.getState().gameModel.gameModel.entityModels[this.entityModelId]

    this.graphics.update()

    ////////////////////////////////////////
    ////////////////////////////////////////
    // RELATIONS
    if(entityModel.boundaryRelation === BOUNDARY_WRAP) {
      const width = this.physicsSprite.displayWidth
      const height = this.physicsSprite.displayHeight

      let highestSize = width
      if(height > width) highestSize = height

      this.scene.physics.world.wrap(this.physicsSprite.body, highestSize)
    }

    if(this.scene.isPaused) return 

    this.collider.update()
    this.projectileEjector.update(time, delta)
    this.movement.update(time, delta)
  }

  getTouchRelations() {
    const relations = [] 
    const collideStartRelations = this.scene.relationsByEventType[ON_TOUCH_START]
    if(collideStartRelations) relations.push(...collideStartRelations.filter(({event: { relationTagIdA }}) => {
      return this.hasTag(relationTagIdA)
    }))

    const collideActiveRelations = this.scene.relationsByEventType[ON_TOUCH_ACTIVE]
    if(collideActiveRelations) relations.push(...collideActiveRelations.filter(({event: { relationTagIdA }}) => {
      return this.hasTag(relationTagIdA)
    }))

    return relations
  }

  getColliders() {
    const gameModel = store.getState().gameModel.gameModel
    return Object.keys(gameModel.collisions).map((collisionId) => {
      return gameModel.collisions[collisionId]
    }).filter(({ relationTagIdA }) => {
      return this.hasTag(relationTagIdA)
    })
  }

  registerRelations(entityInstancesByTag) {
    this.collider.registerRelations(this.getTouchRelations(), entityInstancesByTag)
  }

  registerColliders(entityInstancesByTag) {
    this.collider.registerColliders(this.getColliders(), entityInstancesByTag)
  }

  unregister() {
    this.collider.unregister()
  }

  getInnerCoordinateBoundaries(entityModel, entityInstance) {
    const physicsSprite = this.physicsSprite   

    let foreignWidth = entityModel.graphics.width
    let foreignHeight = entityModel.graphics.height

    if(entityInstance) {
      foreignWidth = entityInstance.physicsSprite.displayWidth
      foreignHeight = entityInstance.physicsSprite.displayHeight
    }

    const x = physicsSprite.x - (physicsSprite.displayWidth/2) +  foreignWidth/4
    const y = physicsSprite.y - (physicsSprite.displayHeight/2) + foreignHeight/4
    const width = physicsSprite.displayWidth -  foreignWidth/2
    const height = physicsSprite.displayHeight -  foreignHeight/2

    return [x, y, width, height]
  }

  getInnerCoordinates(entityModel, entityInstance) {
    let x, y;
    
    let entityWidth = entityModel.graphics.width
    let entityHeight = entityModel.graphics.height
    if(entityInstance) {
      entityWidth = entityInstance.physicsSprite.displayWidth
      entityHeight = entityInstance.physicsSprite.displayHeight
    }

    if(entityWidth === this.width && entityHeight === this.height) {
      x = this.physicsSprite.x
      y = this.physicsSprite.y
    } else {
      const coordinateBoundaries = this.getInnerCoordinateBoundaries(entityModel, entityInstance)
      const position = this.scene.getRandomPosition(...coordinateBoundaries)
      x = position.x
      y = position.y
    }

    return { x, y }
  }

  transformEntityModel(entityModelId) {
    const physicsSprite = this.physicsSprite
    const modifiedEntityData = { 
      spawnX: physicsSprite.x,
      spawnY: physicsSprite.y,
      entityModelId,
      transformCancelEntityModelId: this.transformCancelEntityModelId,
      velocityX: physicsSprite.body.velocity.x,
      velocityY: physicsSprite.body.velocity.y,
    }

    //issue because as soon as we destroy it, we lose acces to 'this'!
    const entityInstanceId = this.entityInstanceId
    setTimeout(() => { 
      this.scene.addEntityInstance(entityInstanceId, modifiedEntityData)
    })

    // calls .destroy()
    this.scene.removeEntityInstance(this.entityInstanceId)
  }

  runDestroyEvents() {
    const entityModelId = this.entityModelId
    this.scene.relationsByEventType[ON_DESTROY_ONE]?.forEach(this.runRelation)
    const instances = this.scene.getAllEntityInstancesOfEntityId(entityModelId)
    if(instances.length === 1) {
      this.scene.relationsByEventType[ON_DESTROY_ALL]?.forEach(this.runRelation)
    }
  }

  destroyInGame() {
    const entityInstanceId = this.entityInstanceId
    this.runDestroyEvents()
    // calls .destroy()
    this.scene.removeEntityInstance(entityInstanceId)
  }

  resetPhysics() {
    this.movement.resetPhysics()
  }

  destroy() {
    this.destroyed = true

    // this check is in here because sometimes the children array is undefined for a scene that is not loaded anymore
    if(this.scene.entityInstanceGroup.children) {
      this.scene.entityInstanceGroup.remove(this.physicsSprite, true)
    }
    // this.scene.removeInstanceFromPhysicsSpriteGroup(this.entityModelId, this.physicsSprite)
    this.graphics.destroy()
    super.destroy()
  }

}