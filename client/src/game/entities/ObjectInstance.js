import { DEFAULT_TEXTURE_ID, ON_SPAWN, BOUNDARY_COLLIDE, BOUNDARY_WRAP, ON_DESTROY_ONE, ON_DESTROY_ALL, ON_INTERACT, ON_TOUCH_START, ON_TOUCH_ACTIVE } from "../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { Sprite } from "./members/Sprite";
import { Collider } from "./members/Collider";
import { Graphics } from "./members/Graphics";
import { Effects } from "./members/Effects";
import { Movement } from "./members/Movement";
import { ProjectileEjector } from "./members/ProjectileEjector";

export class ObjectInstance extends Sprite {
  constructor(scene, instanceId, {spawnX, spawnY, classId}, effectSpawned){
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[classId]


    const textureId = objectClass.graphics.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    super(scene, { spawnX, spawnY, textureId, spriteIndex, spriteSheetName })
    
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // STORE
    this.instanceId = instanceId
    this.classId = classId
    this.scene = scene
    this.width = objectClass.graphics.width
    this.height = objectClass.graphics.height
    this.sprite.instanceId = instanceId
    this.sprite.effectSpawned = effectSpawned
    this.effectSpawned = effectSpawned
    this.sprite.classId = classId
    scene.objectInstanceGroup.add(this.sprite)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // GRAPHICAL
    this.graphics = new Graphics(scene, this)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PHYSICS
    this.movement = new Movement(scene, this)
    this.setBounce(objectClass.collisionResponse.bounciness)
    this.setImmovable(objectClass.collisionResponse.immovable)
    this.setPushable(!objectClass.collisionResponse.notPushable)
    this.setMass(objectClass.collisionResponse.mass)
    this.setFriction(objectClass.collisionResponse.friction)
    const boundaryRelation = objectClass.boundaryRelation
    if(objectClass.collisionResponse.ignoreBoundaries) {
      this.setCollideWorldBounds(false)
    } else if(boundaryRelation === BOUNDARY_COLLIDE) {
      this.setCollideWorldBounds(true)
    }
    this.setCollideIgnoreSides(objectClass.collisionResponse.ignoreSides)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // RELATIONS
    this.collider = new Collider(scene, this, this)
    this.effects = new Effects(scene, this)

    setTimeout(() => {
      this.scene.relationsByEvent[ON_SPAWN]?.forEach(this.startRunEventEffects)
    })

    this.projectileEjector = new ProjectileEjector(scene, this)

    return this
  }

  startRunEventEffects = (relation, instanceSpriteB) => {
    const { event } = relation
    if(this.hasTag(event.tagIdA)) {
      Object.keys(relation.effects).forEach((effectId) => {
        const effect = relation.effects[effectId]
        if(!effect) return

        // if(effect.type === 'EFFECT_SPAWN') console.log('we runnin dis effect yo')
        this.runAccuteEffect({
          relation: {
            ...relation,
            effect,
            effects: undefined
          },
          instanceSpriteA: this.sprite,
          instanceSpriteB,
        })
      })
    }
  }

  hasTag(tagId) {
    const objectClass = store.getState().gameModel.gameModel.classes[this.classId]
    return !!objectClass.tags[tagId]
  }

  runAccuteEffect({
    relation, 
    instanceSpriteA,
    instanceSpriteB,
    sidesA =[],
    sidesB = []
  }) {
    this.effects.runAccuteEffect({
      relation,
      instanceSpriteA,
      instanceSpriteB,
      sidesA,
      sidesB
    })
  }

  setSize(w, h) {
    super.setSize(w, h)
    this.graphics.setSize(w, h)
  }

  update(time, delta) {
    const objectClass = store.getState().gameModel.gameModel.classes[this.classId]

    this.graphics.update()

    ////////////////////////////////////////
    ////////////////////////////////////////
    // RELATIONS
    if(objectClass.boundaryRelation === BOUNDARY_WRAP) {
      this.scene.physics.world.wrap(this.sprite.body, objectClass.graphics.width)
    }

    if(this.scene.isPaused) return 

    this.collider.update()
    this.projectileEjector.update(time, delta)
    this.effects.update()
    this.movement.update(time, delta)
  }

  getTouchRelations() {
    const relations = [] 
    const collideStartRelations = this.scene.relationsByEvent[ON_TOUCH_START]
    if(collideStartRelations) relations.push(...collideStartRelations.filter(({event: { tagIdA }}) => {
      return this.hasTag(tagIdA)
    }))

    const collideActiveRelations = this.scene.relationsByEvent[ON_TOUCH_ACTIVE]
    if(collideActiveRelations) relations.push(...collideActiveRelations.filter(({event: { tagIdA }}) => {
      return this.hasTag(tagIdA)
    }))
    return relations
  }

  getColliders() {
    const gameModel = store.getState().gameModel.gameModel
    return Object.keys(gameModel.collisions).map((collisionId) => {
      return gameModel.collisions[collisionId]
    }).filter(({event: { tagIdA }}) => {
      return this.hasTag(tagIdA)
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

  getInnerCoordinateBoundaries(objectClass) {
    const sprite = this.sprite   

    const x = sprite.x - (sprite.displayWidth/2) +  objectClass.graphics.width/4
    const y = sprite.y - (sprite.displayHeight/2) + objectClass.graphics.height/4
    const width = sprite.displayWidth -  objectClass.graphics.width/2
    const height = sprite.displayHeight-  objectClass.graphics.height/2

    return [x, y, width, height]
  }

  reclass(classId) {
    const sprite = this.sprite
    const modifiedClassData = { spawnX: sprite.x, spawnY: sprite.y, classId }

    //issue because as soon as we destroy it, we lose acces to 'this'!
    const instanceId = this.instanceId
    setTimeout(() => { 
      this.scene.addObjectInstance(instanceId, modifiedClassData)
    })

    // calls .destroy()
    this.scene.removeObjectInstance(this.instanceId)
  }

  runDestroyEvents() {
    const classId = this.classId
    this.scene.relationsByEvent[ON_DESTROY_ONE]?.forEach(this.startRunEventEffects)
    const instances = this.scene.getAllInstancesOfClassId(classId)
    if(instances.length === 1) {
      this.scene.relationsByEvent[ON_DESTROY_ALL]?.forEach(this.startRunEventEffects)
    }
  }

  destroyInGame() {
    const instanceId = this.instanceId
    this.runDestroyEvents()
    // calls .destroy()
    this.scene.removeObjectInstance(instanceId)
  }

  resetPhysics() {
    this.movement.resetPhysics()
  }

  destroy() {
    this.destroyed = true
    this.scene.objectInstanceGroup.remove(this.sprite)
    // this.scene.removeInstanceFromSpriteGroup(this.classId, this.sprite)
    this.graphics.destroy()
    super.destroy()
  }

}