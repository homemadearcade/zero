import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID, ON_DESTROY_ONE, ON_SPAWN, WORLD_COLLIDE, WORLD_WRAP, EFFECT_CAMERA_SHAKE, EFFECT_CUTSCENE, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_TELEPORT, EFFECT_STICK_TO, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SIDE_DOWN, OBJECT_INSTANCE_CANVAS_DEPTH, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_FOLLOW_PLAYER, EFFECT_WIN_GAME, EFFECT_GAME_OVER, OBJECT_CLASS, HERO_CLASS, ZONE_CLASS, NPC_CLASS, UNSPAWNED_TEXTURE_ID, WIN_GAME_STATE, GAME_OVER_STATE, HERO_INSTANCE_ID, ON_DESTROY_ALL, EFFECT_DESTROY, BACKGROUND_CANVAS_ID, BACKGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, FOREGROUND_CANVAS_ID, FOREGROUND_CANVAS_DEPTH } from "../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";
import { Sprite } from "./members/Sprite";
import { Collider } from "./members/Collider";
import { changeGameState, openCutscene } from "../../store/actions/gameContextActions";
import { getHexIntFromHexString } from "../../utils/editorUtils";
import { shakeCamera } from "../../store/actions/gameViewEditorActions";
import { ANIMATION_CAMERA_SHAKE } from "../../store/types";

export class ObjectInstance extends Sprite {
  constructor(scene, id, {spawnX, spawnY, classId, unspawned}){
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
    this.sprite.classId = classId
    scene.objectInstanceGroup.add(this.sprite)

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
    .setDisplaySize(objectClass.graphics.width + 10, objectClass.graphics.height + 10)
    .setVisible(false).setDepth(OBJECT_INSTANCE_CANVAS_DEPTH-1)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // GRAPHICS
    if(objectClass.graphics.tint) this.setTint(objectClass.graphics.tint)
    this.setVisible(!objectClass.graphics.invisible)
    this.setSize(objectClass.graphics.width, objectClass.graphics.height)
    this.addToTypeLayer(this.sprite)
    this.addToTypeGroup(this.sprite)

    if(objectClass.graphics.glowing) {
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

    // IF EDITOR
    if(objectClass.graphics.invisible) {
      this.setVisible(true) 
      this.setAlpha(0.1)
      this.createInvisibleOutline()
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // COLLISION RESPONSE
    this.setBounce(objectClass.collisionResponse.bounciness)
    this.setImmovable(objectClass.collisionResponse.immovable)
    this.setPushable(!objectClass.collisionResponse.notPushable)
    this.setMass(objectClass.collisionResponse.mass)
    this.setFriction(objectClass.collisionResponse.friction)
    const worldBoundaryRelation = objectClass.worldBoundaryRelation
    if(objectClass.collisionResponse.ignoreWorldBounds) {
      this.setCollideWorldBounds(false)
    } else if(worldBoundaryRelation === WORLD_COLLIDE) {
      this.setCollideWorldBounds(true)
    }
    this.setCollideIgnoreSides(objectClass.collisionResponse.ignoreSides)


    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // MOVEMENT
    this.setDamping(true)
    this.setDragX(objectClass.movement.dragX)
    this.setDragY(objectClass.movement.dragY)
    this.setGravityX(objectClass.movement.gravityX)
    this.setGravityY(objectClass.movement.gravityY)
    this.setIgnoreGravity(objectClass.movement.ignoreGravity)
    this.setVelocity(objectClass.movement.velocityX, objectClass.movement.velocityY)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // RELATIONS
    this.collider = new Collider(scene, this, this)
    this.createInteractBorder()

    return this
  }

  addToTypeLayer(sprite) {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]

    if(objectClass.type === OBJECT_CLASS || objectClass.type === NPC_CLASS || objectClass.type === HERO_CLASS) {
      const layerToDepth = {
        [BACKGROUND_CANVAS_ID]: BACKGROUND_CANVAS_DEPTH,
        [PLAYGROUND_CANVAS_ID]: PLAYGROUND_CANVAS_DEPTH,
        [FOREGROUND_CANVAS_ID]: FOREGROUND_CANVAS_DEPTH
      }
      this.setDepth(layerToDepth[objectClass.graphics.layerId])
    } else if(objectClass.type === ZONE_CLASS) {
      this.scene.zoneInstanceLayer.add(sprite)
    }
  }

  addToTypeGroup(sprite) {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]

    if(objectClass.type === OBJECT_CLASS) {
      this.scene.objectClassGroup.add(sprite)
    } else if(objectClass.type === NPC_CLASS) {
      this.scene.npcClassGroup.add(sprite)
    }
  }

  setSize(w, h) {
    super.setSize(w, h)
    if(this.sprite.highlight) {
      this.sprite.highlight.setDisplaySize(w + 10, h + 10)
    }
    if(this.sprite.unspawnedImage) {
      this.sprite.unspawnedImage.setDisplaySize(w/2, h/2)
    }
    // IF EDITOR
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]
    if(objectClass.graphics.invisible) {
      this.createInvisibleOutline()
    }

    this.createInteractBorder()
  }

  createInteractBorder() {
    if(this.sprite.border) this.sprite.border.destroy()
    const width = this.sprite.displayWidth
    const height = this.sprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    this.sprite.border = this.scene.add.graphics();
    this.sprite.border.lineStyle(4, 0xffffff, 1);
    this.sprite.border.strokeRect(cornerX, cornerY, width, height);
    this.sprite.border.setVisible(false)
    this.scene.uiLayer.add(this.sprite.border)
  }

  createInvisibleOutline() {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]

    if(this.sprite.outline) this.sprite.outline.destroy()
    const width = this.sprite.displayWidth
    const height = this.sprite.displayHeight
    const cornerX = -width/2
    const cornerY = -height/2
    this.sprite.outline = this.scene.add.graphics();
    const colorInt = getHexIntFromHexString(objectClass.graphics.tint || '#FFFFFF')
    this.sprite.outline.lineStyle(4, colorInt, 1);
    this.sprite.outline.setAlpha(0.5)
    this.sprite.outline.strokeRect(cornerX + 2, cornerY + 2, width - 4, height - 4);
    this.addToTypeLayer(this.sprite.outline)
  }

  spawn() {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]
    if(this.sprite.unspawnedImage) {
      this.sprite.unspawnedImage.destroy()
    }
    this.setCollideable(true);
    this.setVisible(!objectClass.graphics.invisible)

    // IF EDITOR
    if(objectClass.graphics.invisible) {
      this.setVisible(true) 
      this.setAlpha(0.1)
      this.createInvisibleOutline()
    }

    Object.keys(gameModel.relations).map((relationId) => {
      return gameModel.relations[relationId]
    }).forEach(({event, effect}) => {
      if(event.type === ON_SPAWN && event.classIdA === this.classId) {
        this.runEffect(effect)
      }
    })
  }

  unspawn() {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]
    this.setCollideable(false);

    // IF EDITOR
    this.setAlpha(0.2)
    this.sprite.unspawnedImage = this.scene.add.image(0, 0, UNSPAWNED_TEXTURE_ID)
    this.sprite.unspawnedImage.setDisplaySize(objectClass.graphics.width/2, objectClass.graphics.height/2)
    .setAlpha(0.5)
    this.addToTypeLayer(this.sprite.unspawnedImage)
  }

  destroyInGame() {
    const gameModel = store.getState().gameModel.gameModel
    let eventType = ON_DESTROY_ONE

    const instances = this.scene.getAllInstancesOfClassId(this.classId)
    if(instances.length === 1) {
      eventType = ON_DESTROY_ALL
    }

    Object.keys(gameModel.relations).map((relationId) => {
      return gameModel.relations[relationId]
    }).forEach(({event, effect}) => {
      if(event.type === eventType && event.classIdA === this.classId) {
        this.runEffect(effect)
      }
    })

    this.scene.removeObjectInstance(this.id)
  }

  update(time, delta) {
    const objectClass = store.getState().gameModel.gameModel.classes[this.classId]

    ////////////////////////////////////////
    ////////////////////////////////////////
    // GRAPHICS
    if(this.sprite.outline) {
      this.sprite.outline.setPosition(this.sprite.x, this.sprite.y)
      this.sprite.outline.setRotation(this.sprite.rotation)
    }

    ////////////////////////////////////////
    ////////////////////////////////////////
    // INTERACT AREA
    this.sprite.border.setPosition(this.sprite.x, this.sprite.y)
    this.sprite.border.setRotation(this.sprite.rotation)


    ////////////////////////////////////////
    ////////////////////////////////////////
    // RELATIONS
    if(objectClass.worldBoundaryRelation === WORLD_WRAP) {
      this.scene.physics.world.wrap(this.sprite.body, objectClass.graphics.width)
    }
    
    this.updateEffects()

    ////////////////////////////////////////
    ////////////////////////////////////////
    // EDITOR
    this.sprite.highlight.setPosition(this.sprite.x, this.sprite.y)
    this.sprite.highlight.setRotation(this.sprite.rotation)

    ////////////////////////////////////////
    ////////////////////////////////////////
    // MOVEMENT
    this.updateMovement()

    ////////////////////////////////////////
    ////////////////////////////////////////
    // LIFECYCLE
    if(this.sprite.unspawnedImage) {
      this.sprite.unspawnedImage.setPosition(this.sprite.x, this.sprite.y)
    }
  }


  updateMovement() {
    const objectClass = store.getState().gameModel.gameModel.classes[this.classId]
    const pattern = objectClass.movement.pattern 

    if(pattern === MOVEMENT_TURN_ON_COLLIDE) {
      if(this.sprite.body.blocked.none === false || this.sprite.justCollided) {
        const objectClass = store.getState().gameModel.gameModel.classes[this.classId]
        const speed = objectClass.movement.speed
        const check = Math.random()
    
        if(check < 0.25) {
          this.setVelocity(speed, 0)
        } else if(check < 0.5) {
          this.setVelocity(0, speed)
        } else if(check < 0.75) {
          this.setVelocity(-speed, 0)
        } else {
          this.setVelocity(0, -speed)
        }      
      }
    }

    if(pattern === MOVEMENT_FOLLOW_PLAYER) {
      const speed = objectClass.movement.speed
      const player = this.scene.player.sprite
      
      if(Math.abs(this.sprite.x - player.x) < (speed/2)) {

      } else if(this.sprite.x > player.x) {
        this.setVelocityX(-speed)
      } else {
        this.setVelocityX(speed)
      }

      if(Math.abs(this.sprite.y - player.y) < (speed/2)) {

      } else if(this.sprite.y > player.y) {
        this.setVelocityY(-speed)
      } else {
        this.setVelocityY(speed)
      }

    }

    this.sprite.justCollided = false
  }

  updateEffects() {
    const objectClass = store.getState().gameModel.gameModel.classes[this.classId]
    
    ////////////////////////////////////////
    ////////////////////////////////////////
    // VISIBLITY AND IGNORE GRAVITY EFFECTS
    if(this.wasIgnoreGravityModified && !this.isIgnoreGravityModified) {
      this.setIgnoreGravity(objectClass.movement.ignoreGravity)
    }

    this.wasIgnoreGravityModified = this.isIgnoreGravityModified
    this.isIgnoreGravityModified = false

    if(this.wasVisibilityModified && !this.isVisibilityModified) {
      this.setVisible(!objectClass.graphics.invisible)
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
      this.setIgnoreGravity(objectClass.movement.ignoreGravity);
    }

    this.lastCollidedWithClassId = this.collidedWithClassId

    if(this.sprite.body.touching.none && this.sprite.body.blocked.none) {
      this.collidedWithClassId = null
    }
  }

  destroy() {
    if(this.sprite.outline) this.sprite.outline.destroy()
    if(this.sprite.unspawnedImage) this.sprite.unspawnedImage.destroy()
    this.sprite.highlight.destroy()
    this.sprite.border.destroy()
    super.destroy()
  }

  getRelations() {
    const gameModel = store.getState().gameModel.gameModel

    return Object.keys(gameModel.relations).map((relationId) => {
      return gameModel.relations[relationId]
    }).filter(({event: { classIdA }}) => {
      return classIdA === this.classId
    })
  }

  registerRelations() {
    this.collider.register(this.getRelations())
  }

  unregisterRelations() {
    this.collider.unregister()
    this.sprite.lockedTo = null
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

  resetPhysics() {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.classId]
    this.setAcceleration(0,0)
    this.setVelocity(objectClass.movement.velocityX, objectClass.movement.velocityY)
    this.setRotation(0)
  }

  runEffect(effect, instanceB, sides = []) {
    if(effect.effectedClassId) {
      this.scene.forAllObjectInstancesMatchingClassId(effect.effectedClassId, (object) => {
        object.runEffect({...effect, effectedClassId: null}, instanceB, sides)
      })
      return
    }

    this.collidedWithClassId = instanceB?.classId

    if(effect.type === EFFECT_INVISIBLE && !this.isVisibilityModified) {
      this.isVisibilityModified = true
      this.setVisible(false)
    }

    if(effect.type === EFFECT_IGNORE_GRAVITY && !this.isIgnoreGravityModified) {
      this.isIgnoreGravityModified = true
      this.setIgnoreGravity(true)
    }

    if(effect.type === EFFECT_STICK_TO) {
      this.sprite.lockedTo = instanceB;   
      this.sprite.lockedReleaseSides = sides
      this.isIgnoreGravityModified = true
      this.setIgnoreGravity(true)
    }

    if(effect.type === EFFECT_WIN_GAME) {
      store.dispatch(changeGameState(WIN_GAME_STATE, effect.text))
      this.scene.reload()
    } else if(effect.type === EFFECT_GAME_OVER) {
      store.dispatch(changeGameState(GAME_OVER_STATE, effect.text))
      this.scene.reload()
    }

    if(instanceB && this.lastCollidedWithClassId === instanceB.classId) return

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // ONLY ONCE 

    if(effect.type === EFFECT_STICK_TO) {
      this.sprite.body.setVelocityY(0)
      this.sprite.body.setVelocityX(0)
    }

    if(effect.type === EFFECT_CAMERA_SHAKE) {
      this.scene.callAnimation({
        type: ANIMATION_CAMERA_SHAKE,
        data: {
          intensity: 200,
        }
      })
    }

    if(effect.type === EFFECT_TELEPORT) {
      const gameModel = store.getState().gameModel.gameModel
      const objectClass = gameModel.classes[this.classId]
      const zone = this.scene.getRandomInstanceOfClassId(effect.zoneClassId)
      if(!zone) return
      this.setRandomPosition(zone.sprite.x, zone.sprite.y, zone.sprite.displayWidth - objectClass.graphics.width, zone.sprite.displayHeight - objectClass.graphics.height)
    }
    
    if(effect.type === EFFECT_DESTROY) {
      this.destroyInGame()
    } else if(effect.type === EFFECT_SPAWN) {
      // const zone = this.scene.getRandomInstanceOfClassId(effect.zoneClassId)
      // if(!zone) return
      // this.setRandomPosition(zone.x, zone.y, zone.displayWidth, zone.displayHeight)
      // this.spawn()
    } else if(effect.type === EFFECT_RECLASS) {
      setTimeout(() => {
        const modifiedClassData = { spawnX: this.sprite.x, spawnY: this.sprite.y, classId: effect.classId }
        if(this.id === HERO_INSTANCE_ID) {
          this.scene.removePlayerInstance()
          this.scene.addPlayerInstance(modifiedClassData)
        } else {
          this.scene.removeObjectInstance(this.id)
          this.scene.addObjectInstance(this.id, modifiedClassData)
        }
      })
    }

    // NARRATIVE
    if(effect.type === EFFECT_CUTSCENE) {
      if(effect.cutsceneId) store.dispatch(openCutscene(instanceB?.classId, effect.cutsceneId))
    }
  }
}