import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID } from "../../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";
import { getTextureMetadata } from "../../utils/utils";

export class ObjectInstance extends Phaser.Physics.Matter.Sprite {
  constructor(scene, id, {spawnX, spawnY, classId}){
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[classId]
    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    const behaviors = objectClass.behaviors
    
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
    console.log(this.scene)
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
    if(behaviors.useMass) {
      this.setMass(objectClass.mass)
    } else {
      this.setDensity(objectClass.density)
    }
    this.setFixedRotation(behaviors.fixedRotation)
    this.setIgnoreGravity(behaviors.ignoreGravity)
    this.setStatic(behaviors.static)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VFX
    if(objectClass.tint) {
      const colorInt = getHexIntFromHexString(objectClass.tint)
      this.setTint(colorInt)
    }
    this.setVisible(!behaviors.invisible)

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // Relationships
    this.registerRelationships(objectClass)

    return this
  }

  registerRelationships(objectClass) {
    const world = this.scene.matter.world

    objectClass.relationships.forEach(({classId, event, effect}) => {

      // if(event === 'collide') {
      //   this.scene.matterCollision.addOnCollideStart({
      //     objectA: this,
      //     callback: eventData => {
      //       const { gameObjectB } = eventData;

      //       if(gameObjectB.classId === classId) {
      //         if(effect === 'destroy') {
      //           this.destroy()
      //         }
      //       }
      //     }
      //   });
      // }
    })    
    
    this.unregister = this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: eventData => {
        const { gameObjectB } = eventData;

        // if(gameObjectB.classId === classId) {
        //   if(effect === 'destroy') {
          console.log(eventData)
          console.log('XX')
          console.log(this)
            this.destroyInGame()

          // }
      }
    });
  }

  destroyInGame() {
    console.log(this.id)
    console.log(this)
    this.scene.removeObjectInstance(this.id)
  }

  update() {
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

    super.destroy()
  }
}

    //  Change the body to a Circle with a radius of 48px
  //   circ.setBody({
  //     type: 'circle',
  //     radius: 48
  // });
