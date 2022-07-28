import Phaser from "phaser";
import { DEFAULT_TEXTURE_ID } from "../../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editor";
import { getTextureMetadata } from "../../utils/utils";

export class ObjectInstance extends Phaser.Physics.Matter.Sprite {
  constructor(scene, id, {spawnX, spawnY, classId}){
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[classId]

    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID
    // console.log(spawnX, spawnY, id, classId, objectClass, classDataOverride)
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    
    if(!spriteSheetName) {
      super(scene.matter.world, spawnX, spawnY, textureId, 0)
      this.outline2 = scene.add.image(spawnX, spawnY, textureId)
    } else {
      super(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex)
      this.outline2 = scene.add.image(spawnX, spawnY, spriteSheetName, spriteIndex)
    }
    
    this.setDisplaySize(objectClass.width, objectClass.height)

    this.outline2.setTintFill(0xffffff)
    .setDisplaySize(objectClass.width + 8, objectClass.height + 8)
    .setVisible(false)

    this.id = id
    this.classId = classId
   
    scene.add.existing(this)

    // for EDITOR
    this.setInteractive();
    scene.input.setDraggable(this)

    this.setBounce(objectClass.bounciness)
    if(objectClass.useMass) {
      this.setMass(objectClass.mass)
    } else {
      this.setDensity(objectClass.density)
    }
    this.setFriction(objectClass.friction)
    this.setFrictionAir(objectClass.frictionAir)
    this.setFrictionStatic(objectClass.frictionStatic)
    this.setFixedRotation(objectClass.fixedRotation)
    this.setIgnoreGravity(objectClass.ignoreGravity)

    if(objectClass.tint) {
      const colorInt = getHexIntFromHexString(objectClass.tint)
      this.setTint(colorInt)
    }

    const cornerX = -objectClass.width/2
    const cornerY = -objectClass.height/2
    this.outline = scene.add.graphics();
    this.outline.lineStyle(4, 0xffffff, 1);
    this.outline.strokeRect(cornerX + 4, cornerY + 4, objectClass.width - 8, objectClass.height - 8);
    this.outline.setVisible(false)

    scene.uiLayer.add([this.outline, this.outline2])
    scene.objectInstanceLayer.add(this)
    scene.objectInstanceGroup.add(this)

    this.scene = scene

    return this
  }

  update() {
    if(true || this.outline.visible) {
      this.outline.setPosition(this.x, this.y)
      this.outline.setRotation(this.rotation)
      this.outline2.setPosition(this.x, this.y)
      this.outline2.setRotation(this.rotation)
    }
  }
}


    //  Change the body to a Circle with a radius of 48px
  //   circ.setBody({
  //     type: 'circle',
  //     radius: 48
  // });
