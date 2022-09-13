import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID, EFFECT_CAMERA_SHAKE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_DIALOGUE, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_NOT_ALLOWED, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_TELEPORT, GAME_BOUNDARY_DOWN_WALL_ID, GAME_BOUNDARY_LEFT_WALL_ID, GAME_BOUNDARY_RIGHT_WALL_ID, GAME_BOUNDARY_UP_WALL_ID, GAME_BOUNDARY_WALL_ID, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, ON_DESTROY, ON_SPAWN } from "../../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";
import { isEventMatch } from "../../utils/gameUtils";
import { getTextureMetadata } from "../../utils/utils";
import { MovingPlatformSensor } from "./MovingPlatformSensor";

export class ObjectInstance extends Phaser.Physics.Matter.Sprite {
  constructor(scene, id, {spawnX, spawnY, classId, unspawned}){
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[classId]
    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    const attributes = objectClass.attributes
    
    const plugin = { 
      wrap: {
        min: {
          x: gameModel.world.boundaries.x,
          y: gameModel.world.boundaries.y
        },
        max: {
          x: gameModel.world.boundaries.width,
          y: gameModel.world.boundaries.height
        }            
      }
    }

    if(!spriteSheetName) {
      super(scene.matter.world, spawnX, spawnY, textureId, 0, { plugin: gameModel.world.boundaries.loop ? plugin : {} })
      this.outline2 = scene.add.image(spawnX, spawnY, textureId)
    } else {
      super(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex, { plugin: gameModel.world.boundaries.loop ? plugin : {} })
      this.outline2 = scene.add.image(spawnX, spawnY, spriteSheetName, spriteIndex)
    }
    
    // this.scene.matter.add.rectangle(spawnX, spawnY, objectClass.width, objectClass.height, { restitution: 0.9, plugin });

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // EDITOR
    this.setInteractive();
    scene.input.setDraggable(this)
    this.outline2.setTintFill(0xffffff)
    .setDisplaySize(objectClass.width + 8, objectClass.height + 8)
    .setVisible(false)
    const cornerX = -objectClass.width/2
    const cornerY = -objectClass.height/2
    this.outline = scene.add.graphics();
    this.outline.lineStyle(4, 0xffffff, 1);
    this.outline.strokeRect(cornerX + 4, cornerY + 4, objectClass.width - 8, objectClass.height - 8);
    this.outline.setVisible(false)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // STORE
    this.id = id
    this.classId = classId
    this.scene = scene
    this.width = objectClass.width
    this.height = objectClass.height
    scene.add.existing(this)
    scene.uiLayer.add([this.outline, this.outline2])
    scene.objectInstanceLayer.add(this)
    scene.objectInstanceGroup.add(this)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PHYSICS 
    this.setDisplaySize(objectClass.width, objectClass.height)
    this.setBounce(objectClass.bounciness)
    this.setFriction(objectClass.friction)
    this.setFrictionAir(objectClass.frictionAir)
    this.setFrictionStatic(objectClass.frictionStatic)
    if(attributes.useMass) {
      this.setMass(objectClass.mass)
    } else {
      this.setDensity(objectClass.density)
    }
    this.setFixedRotation(attributes.fixedRotation)
    this.setIgnoreGravity(attributes.ignoreGravity)
    this.setStatic(attributes.static)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VFX
    if(objectClass.tint) {
      const colorInt = getHexIntFromHexString(objectClass.tint)
      this.setTint(colorInt)
    }
    this.setVisible(!attributes.invisible)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // Relationships
    this.registerRelationships(objectClass)

    if(objectClass.unspawned) {
      this.setVisible(false)
      this.setCollisionCategory(null);
    } else {
      this.spawn()
    }

    // this.scene.matterCollision.addOnCollideEnd({
    //   objectA: this,
    //   callback: eventData => {
    //     const { bodyB, bodyA, gameObjectB, } = eventData;
    //     console.log(eventData)
    //   }
    // })

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // Movement
    if(objectClass.movement.movingPlatform) {
      this.movingPlatformSensor = new MovingPlatformSensor(scene, { color: 0x0000FF, width: this.width, parent: this})
    }


    return this
  }

  registerRelationships(objectClass) {

  /*
    EFFECTS 
      MOVEMENT
      stickTo ( While Touching Exclusive )
      notAllowed ( While Touching Exclusive )

      NARRATIVE
      cutscene
      dialogue
  */

    const world = this.scene.matter.world

    objectClass.relationships.forEach(({classId, event, effect}) => {
      const eventEffect = {
        objectA: this,
        callback: eventData => {
          const { gameObjectB, bodyB } = eventData;

          if(isEventMatch({
            gameObject: gameObjectB,
            body: bodyB,
            classId,
            event,
            world
          })){
            this.runEffect(effect, gameObjectB)
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
            classId,
            event,
            world
          })){
            this.runRestore(effect, gameObjectB)
          }
        }
      }

      if(event === ON_COLLIDE_START) {
        this.scene.matterCollision.addOnCollideStart(eventEffect);
      }
      if(event === ON_COLLIDE_END) {
        this.scene.matterCollision.addOnCollideEnd(eventEffect);
      }
      if(event === ON_COLLIDE_ACTIVE) {
        this.scene.matterCollision.addOnCollideActive(eventEffect);
        this.scene.matterCollision.addOnCollideEnd(eventRestore)
      }
    })
  }

  runRestore(effect, agent) {
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[this.classId]
    this.setCollisionCategory(1);
    
    // MOVEMENT
    if(effect.id === EFFECT_IGNORE_GRAVITY) {
      this.setIgnoreGravity(objectClass.attributes.ignoreGravity)
    }
      
    // VFX
    if(effect.id === EFFECT_INVISIBLE) {
      this.setVisible(!objectClass.attributes.invisible)
    }
  }


  runEffect(effect, agent) {
    console.log(effect, agent)
    
    // MOVEMENT
    if(effect.id === EFFECT_TELEPORT) {
      this.setPosition(effect.x, effect.y)
    } else if(effect.id === EFFECT_IGNORE_GRAVITY) {
      this.setIgnoreGravity(true)
    } else if(effect.id === EFFECT_STICK_TO) {
      
    }
    
    // STATE
    if(effect.id === EFFECT_DESTROY) {
      this.destroyInGame()
    } else if(effect.id === EFFECT_SPAWN) {
      this.spawn()
    } else if(effect.id === EFFECT_RECLASS) {
      this.scene.removeObjectInstance(this.id)
      this.scene.addObjectInstance(this.id, {x: this.x, y: this.y, classId: effect.classId})
    }

    // NARRATIVE
    if(effect.id === EFFECT_CUTSCENE) {

    } else if(effect.id === EFFECT_DIALOGUE) {

    }
    
    // VFX
    if(effect.id === EFFECT_INVISIBLE) {
      this.setVisible(false)
    } else if(effect.id === EFFECT_CAMERA_SHAKE) {
      this.scene.cameras.main.shake(20)
    }
  }

  spawn() {
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[this.classId]
    this.setCollisionCategory(1);
    this.setVisible(!objectClass.attributes.invisible)
    objectClass.relationships.forEach(({classId, event, effect}) => {
      if(event === ON_SPAWN) {
        this.runEffect(effect)
      }
    })
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

  update() {
    const objectClass = store.getState().game.gameModel.classes[this.classId]

    if(objectClass.movement.movingPlatform) {
      this.movingPlatformSensor.update(this)
    }

    if(true || this.outline.visible) {
      this.outline.setPosition(this.x, this.y)
      this.outline.setRotation(this.rotation)
      this.outline2.setPosition(this.x, this.y)
      this.outline2.setRotation(this.rotation)
    }
  }

  destroy() {
    this.outline.destroy()
    this.outline2.destroy()
    if(this.movingPlatformSensor) this.movingPlatformSensor.destroy()

    super.destroy()
  }
}

    //  Change the body to a Circle with a radius of 48px
  //   circ.setBody({
  //     type: 'circle',
  //     radius: 48
  // });
