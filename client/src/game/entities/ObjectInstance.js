import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID, EFFECT_CAMERA_SHAKE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_DIALOGUE, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_NOT_ALLOWED, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_TELEPORT, MOVEMENT_SIDE_TO_SIDE, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, ON_DESTROY, ON_SPAWN } from "../../constants";
import store from "../../store";
import { isEventMatch } from "../../utils/gameUtils";
import { getTextureMetadata } from "../../utils/utils";
import { Entity } from "./Entity";
import { MovingPlatformSensor } from "./MovingPlatformSensor";

export class ObjectInstance extends Entity {
  constructor(scene, id, {spawnX, spawnY, classId, unspawned}){
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[classId]
    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    const attributes = objectClass.attributes

    super(scene, { spawnX, spawnY, textureId, spriteIndex, spriteSheetName }, { useEditor: true })
    
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // OUTLINE
    if(this.sprite.highlight) {
      this.sprite.highlight.setTintFill(0xffffff)
      .setDisplaySize(objectClass.width + 8, objectClass.height + 8)
      .setVisible(false)
    }
    const cornerX = -objectClass.width/2
    const cornerY = -objectClass.height/2
    this.border = scene.add.graphics();
    this.border.lineStyle(4, 0xffffff, 1);
    this.border.strokeRect(cornerX + 4, cornerY + 4, objectClass.width - 8, objectClass.height - 8);
    this.border.setVisible(false)

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

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // SCENE
    scene.uiLayer.add(this.border)
    scene.objectInstanceLayer.add(this.sprite)
    scene.objectInstanceGroup.add(this.sprite)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PHYSICS 
    this.setSize(objectClass.width, objectClass.height)
    this.setBounce(objectClass.bounciness)
    this.setFriction(objectClass.friction)
    this.setDrag(objectClass.drag)
    this.setFrictionStatic(objectClass.frictionStatic)
    if(attributes.useMass) {
      this.setMass(objectClass.mass)
    } else {
      this.setDensity(objectClass.density)
    }
    this.setFixedRotation(attributes.fixedRotation)
    this.setIgnoreGravity(attributes.ignoreGravity)
    this.setImmovable(attributes.immovable)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VFX
    if(objectClass.tint) this.setTint(objectClass.tint)
    this.setVisible(!attributes.invisible)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // Relationships
    this.registerRelationships(objectClass)

    if(objectClass.unspawned) {
      this.setVisible(false)
      this.setCollideable(false);
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
    // var Bodies = Phaser.Physics.Matter.Matter.Bodies;
    // // var rect = Bodies.rectangle(this.width/2, this.height/2, this.width, this.height);
    // var circleD = Bodies.circle(0, 70, 24, { isSensor: true, label: 'bottom' });
    // var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
    //   parts: [ this.body, circleD ],
    // })
    // this.setExistingBody(compoundBody);
    // this.setPosition(spawnX, spawnY)

    // if(objectClass.movement.movingPlatform) {
    //   this.movingPlatformSensor = new MovingPlatformSensor(scene, { color: 0x0000FF, width: this.width, parent: this})
    // }

    return this
  }

  registerRelationships(objectClass) {
    return
  /*
    EFFECTS 
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
    this.setCollideable(true);
    
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
    }
    
    // STATE
    if(effect.id === EFFECT_DESTROY) {
      this.destroyInGame()
    } else if(effect.id === EFFECT_SPAWN) {
      this.spawn()
    } else if(effect.id === EFFECT_RECLASS) {
      this.scene.removeObjectInstance(this.id)
      this.scene.addObjectInstance(this.id, {spawnX: this.x, spawnY: this.y, classId: effect.classId})
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

    // if(this.movingPlatformSensor) {
    //   this.movingPlatformSensor.update(this)
    // }

    if(true || this.border.visible) {
      this.border.setPosition(this.sprite.x, this.sprite.y)
      this.border.setRotation(this.sprite.rotation)
      this.sprite.highlight.setPosition(this.sprite.x, this.sprite.y)
      this.sprite.highlight.setRotation(this.sprite.rotation)
    }

    // const movementPattern = objectClass.movement.pattern
    // if(movementPattern === MOVEMENT_SIDE_TO_SIDE) {
    //   this.setPosition(this.x + .1, this.y)
    // }
  }

  destroy() {
    this.border.destroy()
    this.sprite.highlight.destroy()
    // if(this.movingPlatformSensor) this.movingPlatformSensor.destroy()

    super.destroy()
  }
}

    //  Change the body to a Circle with a radius of 48px
  //   circ.setBody({
  //     type: 'circle',
  //     radius: 48
  // });
