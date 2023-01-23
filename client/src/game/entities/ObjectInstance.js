import { DEFAULT_TEXTURE_ID, ON_SPAWN, BOUNDARY_COLLIDE, BOUNDARY_WRAP,PLAYER_INSTANCE_ID_PREFIX,ON_INTERACT, ON_DESTROY_ONE, ON_DESTROY_ALL, EFFECT_COLLIDE } from "../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { Sprite } from "./members/Sprite";
import { Collider } from "./members/Collider";
import { Graphics } from "./members/Graphics";
import { Effects } from "./members/Effects";
import { Movement } from "./members/Movement";

export class ObjectInstance extends Sprite {
  constructor(scene, id, {spawnX, spawnY, classId}, effectSpawned){
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[classId]

    const textureId = objectClass.graphics.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    super(scene, { spawnX, spawnY, textureId, spriteIndex, spriteSheetName })
    
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // STORE
    this.id = id
    this.classId = classId
    this.scene = scene
    this.width = objectClass.graphics.width
    this.height = objectClass.graphics.height
    this.sprite.id = id
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

    Object.keys(gameModel.relations).map((relationId) => {
      return gameModel.relations[relationId]
    }).forEach((relation) => {
      const {event, effect} = relation

      if(event.type === ON_SPAWN && event.classIdA === this.classId) {
        this.runAccuteEffect(relation)
      }
    })

    return this
  }

  runAccuteEffect(relation, instanceB, sides = []) {
    this.effects.runAccuteEffect(relation, instanceB, sides)
  }

  setSize(w, h) {
    super.setSize(w, h)
    this.graphics.setSize(w, h)
  }

  update(time, delta) {
    const objectClass = store.getState().gameModel.gameModel.classes[this.classId]

    this.graphics.update()
    this.collider.update()

    ////////////////////////////////////////
    ////////////////////////////////////////
    // RELATIONS
    if(objectClass.boundaryRelation === BOUNDARY_WRAP) {
      this.scene.physics.world.wrap(this.sprite.body, objectClass.graphics.width)
    }

    this.effects.update()
    this.movement.update(time, delta)
  }

  getRelations() {
    const gameModel = store.getState().gameModel.gameModel

    return Object.keys(gameModel.relations).map((relationId) => {
      return gameModel.relations[relationId]
    }).filter(({event: { classIdA, classIdB, type }, effect}) => {
      if(effect.type === EFFECT_COLLIDE) return false
      if(classIdB === PLAYER_INSTANCE_ID_PREFIX && this.id === PLAYER_INSTANCE_ID_PREFIX) return true
      if(type === ON_INTERACT) {
        return classIdA === this.classId || classIdB === this.classId
      } else {
        return classIdA === this.classId
      }
    })
  }

  getColliders() {
    const gameModel = store.getState().gameModel.gameModel
    return Object.keys(gameModel.relations).map((relationId) => {
      return gameModel.relations[relationId]
    }).filter(({event: { classIdA, classIdB, type }, effect}) => {
      if(effect.type !== EFFECT_COLLIDE) return false
      return classIdA === this.classId
    })
  }

  registerRelations() {
    this.collider.registerRelations(this.getRelations())
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

    return [ x, y, width, height]
  }

  reclass(classId) {
    const sprite = this.sprite
    const modifiedClassData = { spawnX: sprite.x, spawnY: sprite.y, classId }

    //issue because as soon as we destroy it, we lose acces to 'this'!
    const id = this.id
    setTimeout(() => { this.scene.addObjectInstance(id, modifiedClassData)})

    this.scene.removeObjectInstance(this.id)
  }

  destroyInGame() {
    const instanceId = this.id
    const classId = this.classId
    const gameModel = store.getState().gameModel.gameModel

    Object.keys(gameModel.relations).map((relationId) => {
      return gameModel.relations[relationId]
    }).forEach((relation) => {
      const {event, effect} = relation
      if(event.type === ON_DESTROY_ONE && event.classIdA === classId) {
        this.runAccuteEffect(relation)
      }
    })
    
    const instances = this.scene.getAllInstancesOfClassId(classId)
    if(instances.length === 1) {
      Object.keys(gameModel.relations).map((relationId) => {
        return gameModel.relations[relationId]
      }).forEach((relation) => {
        const {event, effect} = relation
        if(event.type === ON_DESTROY_ALL && event.classIdA === classId) {
          this.runAccuteEffect(relation)
        }
      })
    }

    this.destroyed = true
    this.scene.removeObjectInstance(instanceId)
  }

  resetPhysics() {
    this.movement.resetPhysics()
  }

  destroy() {
    this.graphics.destroy()
    super.destroy()
  }

}