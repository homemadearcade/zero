import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID, HERO_INSTANCE_ID, ON_DESTROY, ON_SPAWN, WORLD_COLLIDE, WORLD_WRAP, EFFECT_CAMERA_SHAKE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_DIALOGUE, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_TELEPORT } from "../../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { Sprite } from "./members/Sprite";
import { Collider } from "./members/Collider";

export class ObjectInstance extends Sprite {
  constructor(scene, id, {spawnX, spawnY, classId, unspawned}){
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[classId]

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // GRAPHICS
    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    const attributes = objectClass.attributes
    super(scene, { spawnX, spawnY, textureId, spriteIndex, spriteSheetName })
    if(objectClass.tint) this.setTint(objectClass.tint)
    this.setVisible(!attributes.invisible)
    this.setSize(objectClass.width, objectClass.height)
    scene.objectInstanceLayer.add(this.sprite)

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
    // EDITOR
    this.sprite.setInteractive();
    scene.input.setDraggable(this.sprite)
    if(!spriteSheetName) {
      this.sprite.highlight = scene.add.image(spawnX, spawnY, textureId)
    } else {
      this.sprite.highlight = scene.add.image(spawnX, spawnY, spriteSheetName, spriteIndex)
    }
    this.sprite.highlight.setTintFill(0xffffff)
    .setDisplaySize(objectClass.width + 8, objectClass.height + 8)
    .setVisible(false)
    scene.uiLayer.add(this.sprite.highlight)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // MOVEMENT
    this.setDrag(objectClass.drag)
    this.setIgnoreGravity(attributes.ignoreGravity)

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
    // RELATIONS
    if(id === HERO_INSTANCE_ID) {
      this.collider = new Collider(scene, this, this)
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
    objectClass.relations.forEach(({classId, event, effect}) => {
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
    objectClass.relations.forEach(({classId, event, effect}) => {
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

    if(this.wasIgnoreGravityModified && !this.isIgnoreGravityModified) {
      this.setIgnoreGravity(objectClass.attributes.ignoreGravity)
      console.log(objectClass.attributes.ignoreGravity)
    }

    this.wasIgnoreGravityModified = this.isIgnoreGravityModified
    this.isIgnoreGravityModified = false

    if(this.wasVisibilityModified && !this.isVisibilityModified) {
      this.setVisible(!objectClass.attributes.invisible)
    }

    this.wasVisibilityModified = this.isVisibilityModified
    this.isVisibilityModified = false
  }

  destroy() {
    this.sprite.highlight.destroy()
    this.sprite.border.destroy()
    super.destroy()
  }

  registerRelations() {
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[this.classId]
    this.collider.register(objectClass.relations)
  }

  unregisterRelations() {
    this.collider.unregister()
  }


  runEffect(effect, agent) {
    // MOVEMENT
    if(effect.id === EFFECT_TELEPORT) {
      this.setPosition(effect.x, effect.y)
    } else if(effect.id === EFFECT_IGNORE_GRAVITY && !this.isIgnoreGravityModified) {
      this.isIgnoreGravityModified = true
      this.setIgnoreGravity(true)
    }
    
    // LIFE
    if(effect.id === EFFECT_DESTROY) {
      this.destroyInGame()
    } else if(effect.id === EFFECT_SPAWN) {
      this.spawn()
    } else if(effect.id === EFFECT_RECLASS) {
      this.scene.removeObjectInstance(this.id)
      this.scene.addObjectInstance(this.id, {spawnX: this.sprite.x, spawnY: this.sprite.y, classId: effect.classId})
    }

    // NARRATIVE
    if(effect.id === EFFECT_CUTSCENE) {

    } else if(effect.id === EFFECT_DIALOGUE) {

    }
    
    // GRAPHICS
    if(effect.id === EFFECT_INVISIBLE &&!this.isVisibilityModified) {
      this.isVisibilityModified = true
      this.setVisible(false)
    } else if(effect.id === EFFECT_CAMERA_SHAKE) {
      this.scene.cameras.main.shake(20)
    }
  }
}