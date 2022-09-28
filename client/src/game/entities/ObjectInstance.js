import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID, ON_DESTROY, ON_SPAWN, WORLD_COLLIDE, WORLD_WRAP, EFFECT_CAMERA_SHAKE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_TELEPORT, EFFECT_STICK_TO, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SIDE_DOWN, OBJECT_INSTANCE_CANVAS_DEPTH } from "../../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { Sprite } from "./members/Sprite";
import { Collider } from "./members/Collider";
import { openCutscene } from "../../store/actions/narrativeActions";

export class ObjectInstance extends Sprite {
  constructor(scene, id, {spawnX, spawnY, classId, unspawned}){
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[classId]

    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    super(scene, { spawnX, spawnY, textureId, spriteIndex, spriteSheetName })
    
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // STORE
    this.id = id
    this.classId = classId
    this.scene = scene
    this.width = objectClass.width
    this.height = objectClass.height
    this.sprite.id = id
    this.sprite.classId = classId
    scene.objectInstanceGroup.add(this.sprite)
    const attributes = objectClass.attributes

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // GRAPHICS
    if(objectClass.tint) this.setTint(objectClass.tint)
    this.setVisible(!attributes.invisible)
    this.setSize(objectClass.width, objectClass.height)
    scene.objectInstanceLayer.add(this.sprite)

    if(attributes.glowing) {
      var pipeline = scene.plugins.get('rexglowfilterpipelineplugin').add(this.sprite);
      this.sprite.glowTask = this.sprite.scene.tweens.add({
        targets: pipeline,
        intensity: 0.05,
        ease: 'Linear',
        duration: 500,
        repeat: -1,
        yoyo: true
      });
    }

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
    .setDisplaySize(objectClass.width + 10, objectClass.height + 10)
    .setVisible(false)
    this.sprite.highlight.setDepth(OBJECT_INSTANCE_CANVAS_DEPTH - 1)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // MOVEMENT
    this.setDrag(objectClass.drag)
    this.setIgnoreGravity(attributes.ignoreGravity)
    this.setVelocity(objectClass.movement.velocity[0], objectClass.movement.velocity[1])

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // RELATIONS
    this.collider = new Collider(scene, this, this)
    this.createSpriteBorder()

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

  setSize(w, h) {
    super.setSize(w, h)
    if(this.sprite.highlight) {
      this.sprite.highlight.setDisplaySize(w + 10, h + 10)
    }
    this.createSpriteBorder()
  }

  createSpriteBorder() {
    if(this.sprite.border) this.sprite.border.destroy()
    const width = this.sprite.displayWidth
    const height = this.sprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    this.sprite.border = this.scene.add.graphics();
    this.sprite.border.lineStyle(4, 0xffffff, 1);
    this.sprite.border.strokeRect(cornerX + 4, cornerY + 4, width - 8, height - 8);
    this.sprite.border.setVisible(false)
    this.scene.uiLayer.add(this.sprite.border)
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

    ////////////////////////////////////////
    ////////////////////////////////////////
    // INTERACT AREA
    this.sprite.border.setPosition(this.sprite.x, this.sprite.y)
    this.sprite.border.setRotation(this.sprite.rotation)


    ////////////////////////////////////////
    ////////////////////////////////////////
    // RELATIONS
    if(objectClass.worldBoundaryRelationship === WORLD_WRAP) {
      this.scene.physics.world.wrap(this.sprite.body, this.width)
    }
    this.updateEffects()

    ////////////////////////////////////////
    ////////////////////////////////////////
    // EDITOR
    this.sprite.highlight.setPosition(this.sprite.x, this.sprite.y)
    this.sprite.highlight.setRotation(this.sprite.rotation)
    
  }

  updateEffects() {
    const objectClass = store.getState().game.gameModel.classes[this.classId]
    
    ////////////////////////////////////////
    ////////////////////////////////////////
    // VISIBLITY AND IGNORE GRAVITY EFFECTS
    if(this.wasIgnoreGravityModified && !this.isIgnoreGravityModified) {
      this.setIgnoreGravity(objectClass.attributes.ignoreGravity)
    }

    this.wasIgnoreGravityModified = this.isIgnoreGravityModified
    this.isIgnoreGravityModified = false

    if(this.wasVisibilityModified && !this.isVisibilityModified) {
      this.setVisible(!objectClass.attributes.invisible)
    }

    this.wasVisibilityModified = this.isVisibilityModified
    this.isVisibilityModified = false

    ////////////////////////////////////////
    ////////////////////////////////////////
    // STICK TO EFFECT
    if (this.sprite.lockedTo) {
      this.sprite.body.position.x += this.sprite.lockedTo.body.deltaX();
      this.sprite.body.position.y += this.sprite.lockedTo.body.deltaY();   
    }
    
    if (this.sprite.lockedTo && this.fallenOff(this.sprite, this.sprite.lockedTo, this.sprite.lockedReleaseSides)) {
      this.sprite.lockedTo = null;   
      this.sprite.lockedReleaseSides = null
      this.setIgnoreGravity(objectClass.attributes.ignoreGravity);
    }
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
    this.sprite.lockedTo = null
  }

  fallenOff(player, platform, sides) {
    // if turns out to be annoying
    // if(Phaser.Math.Distance.Between(player.x, player.y, platform.x, platform.y) > 100) {
    //   return true
    // }

    if(sides.indexOf(SIDE_LEFT) >= 0 || sides.indexOf(SIDE_RIGHT) >= 0) {
      return (
        player.body.bottom <= platform.body.position.y ||
        player.body.position.y >= platform.body.bottom 
      );
    } else if(sides.indexOf(SIDE_UP) >= 0 || sides.indexOf(SIDE_DOWN) >= 0) {
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

  runEffect(effect, agent, sides = []) {
    // MOVEMENT
    if(effect.id === EFFECT_TELEPORT) {
      this.setPosition(effect.x, effect.y)
    } else if(effect.id === EFFECT_IGNORE_GRAVITY && !this.isIgnoreGravityModified) {
      this.isIgnoreGravityModified = true
      this.setIgnoreGravity(true)
    } else if(effect.id === EFFECT_STICK_TO) {
      this.sprite.lockedTo = agent;   
      this.sprite.lockedReleaseSides = sides
      this.setIgnoreGravity(true)
      // if(sides.indexOf(SIDE_LEFT) >= 0 || sides.indexOf(SIDE_RIGHT) >= 0) {
      //   this.sprite.body.setVelocityX(0)
      // } else if(sides.indexOf(SIDE_UP) >= 0 || sides.indexOf(SIDE_DOWN) >= 0) {
      //   this.sprite.body.setVelocityY(0)
      // } else {
        this.sprite.body.setVelocityY(0)
        this.sprite.body.setVelocityX(0)
      // }
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
      store.dispatch(openCutscene(agent.classId, effect.cutsceneId))
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