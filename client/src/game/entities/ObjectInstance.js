import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID, HERO_INSTANCE_ID, ON_DESTROY, ON_SPAWN, WORLD_COLLIDE, WORLD_WRAP } from "../../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { Entity } from "./Entity";
import { Relations } from "./members/Relations";

export class ObjectInstance extends Entity {
  constructor(scene, id, {spawnX, spawnY, classId, unspawned}){
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[classId]

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // GRAPHICS
    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    const attributes = objectClass.attributes
    super(scene, { spawnX, spawnY, textureId, spriteIndex, spriteSheetName }, { useEditor: true })
    if(objectClass.tint) this.setTint(objectClass.tint)
    this.setVisible(!attributes.invisible)
    this.setSize(objectClass.width, objectClass.height)
    scene.objectInstanceLayer.add(this.sprite)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // EDITOR
    if(this.sprite.highlight) {
      this.sprite.highlight.setTintFill(0xffffff)
      .setDisplaySize(objectClass.width + 8, objectClass.height + 8)
      .setVisible(false)
    }
    const cornerX = -objectClass.width/2
    const cornerY = -objectClass.height/2
    this.sprite.border = scene.add.graphics();
    this.sprite.border.lineStyle(4, 0xffffff, 1);
    this.sprite.border.strokeRect(cornerX + 4, cornerY + 4, objectClass.width - 8, objectClass.height - 8);
    this.sprite.border.setVisible(false)
    scene.uiLayer.add(this.sprite.border)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // STORE
    this.id = id
    this.classId = classId
    this.scene = scene
    this.sprite.id = id
    this.sprite.classId = classId
    this.width = objectClass.width
    this.height = objectClass.height
    scene.objectInstanceGroup.add(this.sprite)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // COLLISION RESPONSE
    this.setBounce(objectClass.bounciness)
    this.setImmovable(attributes.immovable)
    this.setPushable(!attributes.notPushable)
    this.setMass(objectClass.mass)
    this.setFriction(objectClass.friction)
    const worldBoundaryRelationship = objectClass.worldBoundaryRelationship
    if(attributes.ignoreWorldBounds) {
      this.setCollideWorldBounds(false)
    } else if(worldBoundaryRelationship === WORLD_COLLIDE) {
      this.setCollideWorldBounds(true)
    }
    this.setCollideIgnoreSides(objectClass.collisionResponse.ignoreSides)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // MOVEMENT
    this.setDrag(objectClass.drag)
    this.setIgnoreGravity(attributes.ignoreGravity)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // RELATIONS
    if(id === HERO_INSTANCE_ID) {
      this.relations = new Relations(scene, this, this)
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // LIFECYCLE
    if(objectClass.unspawned) {
      this.setVisible(false)
      this.setCollideable(false);
    } else {
      this.spawn()
    }

    return this
  }

  spawn() {
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[this.classId]
    this.setCollideable(true);
    this.setVisible(!objectClass.attributes.invisible)
    objectClass.relationships.forEach(({classId, event, effect}) => {
      if(event === ON_SPAWN) {
        this.runEffect(effect)
      }
    })

    // const movementPattern = objectClass.movement.pattern
    // if(movementPattern === MOVEMENT_SIDE_TO_SIDE) {
    //   this.setVelocityX(10)
    // }
  }

  destroyInGame() {
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[this.classId]
    objectClass.relationships.forEach(({classId, event, effect}) => {
      if(event === ON_DESTROY) {
        this.runEffect(effect)
      }
    })
    this.scene.removeObjectInstance(this.id)
  }

  update(time, delta) {
    const objectClass = store.getState().game.gameModel.classes[this.classId]

    if(objectClass.worldBoundaryRelationship === WORLD_WRAP) {
      this.scene.physics.world.wrap(this.sprite.body, this.width)
    }

    if(true || this.border.visible) {
      this.sprite.border.setPosition(this.sprite.x, this.sprite.y)
      this.sprite.border.setRotation(this.sprite.rotation)
      this.sprite.highlight.setPosition(this.sprite.x, this.sprite.y)
      this.sprite.highlight.setRotation(this.sprite.rotation)
    }

    // const movementPattern = objectClass.movement.pattern
    // if(movementPattern === MOVEMENT_SIDE_TO_SIDE) {
    //   this.setPosition(this.x + .1, this.y)
    // }
  }

  destroy() {
    this.sprite.border.destroy()

    super.destroy()
  }
}