import Phaser from "phaser";
import { OBJECT_INSTANCE_LAYER_DEPTH, UI_LAYER_DEPTH } from "../../constants";
import store from "../../store";
import { getTextureMetadata } from "../../utils/utils";

export class ObjectInstance extends Phaser.Physics.Matter.Sprite {
  constructor(scene, id, {spawnX, spawnY, classId, classDataOverride}){
    let objectClass
    if(classDataOverride) {
      objectClass = classDataOverride
    } else {
      objectClass = store.getState().game.gameModel.classes[classId]
    }
    // console.log(spawnX, spawnY, id, classId, objectClass, classDataOverride)
    const { spriteSheetName, spriteIndex } = getTextureMetadata(objectClass.textureId)
    
    if(!spriteSheetName) {
      console.log('missing spritesheet', objectClass.textureId)
      super(scene.matter.world, spawnX, spawnY, objectClass.textureId, 0)
      this.outline2 = scene.add.image(spawnX, spawnY, objectClass.textureId)
    } else {
      super(scene.matter.world, spawnX, spawnY, spriteSheetName, spriteIndex)
      this.outline2 = scene.add.image(spawnX, spawnY, spriteSheetName, spriteIndex)
    }

    this.setDisplaySize(objectClass.width, objectClass.height)
    this.setDepth(OBJECT_INSTANCE_LAYER_DEPTH)

    this.outline2.setTintFill(0xffffff)
    .setDisplaySize(objectClass.width + 8, objectClass.height + 8)
    .setVisible(false).setDepth(UI_LAYER_DEPTH)

    this.id = id
    this.classId = classId
   
    this.ship = scene.matter.add.sprite(this);
    scene.add.existing(this)

    // for EDITOR
    this.setInteractive();
    scene.input.setDraggable(this)

    this.setBounce(objectClass.bounciness)
    this.setDensity(objectClass.density)
    this.setFriction(objectClass.friction)
    this.setFrictionAir(objectClass.frictionAir)
    this.setFrictionStatic(objectClass.frictionStatic)
    this.setFixedRotation(objectClass.fixedRotation)
    this.setIgnoreGravity(objectClass.ignoreGravity)


    this.outline = scene.add.graphics();
    this.outline.lineStyle(3, 0xffffff, 1);
    this.outline.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
    this.outline.setVisible(false)
    this.outline.setDepth(UI_LAYER_DEPTH)

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
