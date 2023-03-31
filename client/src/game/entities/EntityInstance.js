import { DEFAULT_TEXTURE_ID, ON_SPAWN, BOUNDARY_COLLIDE, BOUNDARY_WRAP, ON_DESTROY_ONE, ON_DESTROY_ALL, ON_INTERACT, ON_TOUCH_START, ON_TOUCH_ACTIVE } from "../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { PhaserInstance } from "./members/PhaserInstance";
import { Collider } from "./members/Collider";
import { Graphics } from "./members/Graphics";
import { Effects } from "./members/Effects";
import { Movement } from "./members/Movement";
import { ProjectileEjector } from "./members/ProjectileEjector";

export class EntityInstance extends PhaserInstance {
  constructor(scene, entityInstanceId, {spawnX, spawnY, entityModelId}, effectSpawned){
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
    this.scene = scene
    this.width = entityModel.graphics.width
    this.height = entityModel.graphics.height
    this.phaserInstance.entityInstanceId = entityInstanceId
    this.phaserInstance.effectSpawned = effectSpawned
    this.effectSpawned = effectSpawned
    this.phaserInstance.entityModelId = entityModelId
    scene.entityInstanceGroup.add(this.phaserInstance)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // GRAPHICAL
    this.graphics = new Graphics(scene, this)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PHYSICS
    this.movement = new Movement(scene, this)
    this.setBounce(entityModel.collisionResponse.bounciness)
    this.setImmovable(entityModel.collisionResponse.immovable)
    this.setPushable(!entityModel.collisionResponse.notPushable)
    this.setMass(entityModel.collisionResponse.mass)
    this.setFriction(entityModel.collisionResponse.friction)
    const boundaryRelation = entityModel.boundaryRelation
    if(entityModel.collisionResponse.ignoreStageBoundaries) {
      this.setCollideWorldBounds(false)
    } else if(boundaryRelation === BOUNDARY_COLLIDE) {
      this.setCollideWorldBounds(true)
    }
    this.setCollideIgnoreSides(entityModel.collisionResponse.ignoreSides)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // RELATIONS
    this.collider = new Collider(scene, this, this)
    this.effects = new Effects(scene, this)

    setTimeout(() => {
      this.scene.relationsByEventType[ON_SPAWN]?.forEach(this.runRelation)
    })

    this.projectileEjector = new ProjectileEjector(scene, this)

    return this
  }

  runRelation = (relation, phaserInstanceB) => {
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
          phaserInstanceA: this.phaserInstance,
          phaserInstanceB,
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
    phaserInstanceA,
    phaserInstanceB,
    sidesA =[],
    sidesB = []
  }) {
    this.effects.runAccuteEffect({
      relation,
      phaserInstanceA,
      phaserInstanceB,
      sidesA,
      sidesB
    })
  }

  setSize(w, h) {
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
      this.scene.physics.world.wrap(this.phaserInstance.body, entityModel.graphics.width)
    }

    if(this.scene.isPaused) return 

    this.collider.update()
    this.projectileEjector.update(time, delta)
    this.effects.update()
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

  registerRelations() {
    this.collider.registerRelations(this.getTouchRelations())
  }

  registerColliders() {
    this.collider.registerColliders(this.getColliders())
  }

  unregister() {
    this.collider.unregister()
    this.effects.unregister()
  }

  getInnerCoordinateBoundaries(entityModel) {
    const phaserInstance = this.phaserInstance   

    const x = phaserInstance.x - (phaserInstance.displayWidth/2) +  entityModel.graphics.width/4
    const y = phaserInstance.y - (phaserInstance.displayHeight/2) + entityModel.graphics.height/4
    const width = phaserInstance.displayWidth -  entityModel.graphics.width/2
    const height = phaserInstance.displayHeight-  entityModel.graphics.height/2

    return [x, y, width, height]
  }

  reclass(entityModelId) {
    const phaserInstance = this.phaserInstance
    const modifiedEntityData = { spawnX: phaserInstance.x, spawnY: phaserInstance.y, entityModelId }

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
    this.scene.entityInstanceGroup.remove(this.phaserInstance)
    // this.scene.removeInstanceFromPhaserInstanceGroup(this.entityModelId, this.phaserInstance)
    this.graphics.destroy()
    super.destroy()
  }

}