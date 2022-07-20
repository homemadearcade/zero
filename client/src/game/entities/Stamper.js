import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import { OBJECT_INSTANCE_LAYER_DEPTH } from "../../constants";
import { snapObjectXY } from "../../utils/editor";

export class Stamper extends Phaser.GameObjects.Image {
  constructor(scene, classId, objectClass){
    const { spriteSheetName, spriteIndex } = getTextureMetadata(objectClass.textureId)
    super(scene, 0,0, spriteSheetName, spriteIndex)

    this.scene = scene
    this.classId = classId
    this.class = objectClass
    this.scene.add.existing(this)
    
    return this
  }

  update(pointer) {
    const { snappedX, snappedY } = snapObjectXY(pointer, this.class)

    this.setPosition(snappedX, snappedY)
    this.setDisplaySize(this.class.width, this.class.height)
    this.setDepth(OBJECT_INSTANCE_LAYER_DEPTH)
  }

  stamp(pointer) {
    const { snappedX, snappedY } = snapObjectXY(pointer, this.class)
    this.scene.addGameObject(this.classId, {
      spawnX: snappedX, 
      spawnY: snappedY
    })
  }

  getLayerId() {
    return this.class.layerId
  }
}

