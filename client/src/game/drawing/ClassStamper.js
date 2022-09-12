import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import { DEFAULT_TEXTURE_ID, OBJECT_INSTANCE_CANVAS_DEPTH } from "../../constants";
import { getHexIntFromHexString, snapObjectXY } from "../../utils/editorUtils";

export class ClassStamper extends Phaser.GameObjects.Image {
  constructor(scene, classId, objectClass){

    const textureId = objectClass.textureId || DEFAULT_TEXTURE_ID

    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)

    if(!spriteSheetName) {
      super(scene, 0, 0, textureId, 0)
    } else {
      super(scene, 0, 0, spriteSheetName, spriteIndex)
    }

    this.scene = scene
    this.classId = classId
    this.class = objectClass
    this.scene.add.existing(this)
    
    this.setDisplaySize(this.class.width, this.class.height)
    this.setDepth(OBJECT_INSTANCE_CANVAS_DEPTH)

    if(objectClass.tint) {
      const colorInt = getHexIntFromHexString(objectClass.tint)
      this.setTint(colorInt)
    }

    return this
  }

  update(pointer) {
    const { snappedX, snappedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY}, this.class)
    this.setPosition(snappedX, snappedY)
  }

  stamp(pointer) {
    const { snappedX, snappedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY}, this.class)
    this.scene.addGameObject(this.classId, {
      spawnX: snappedX, 
      spawnY: snappedY
    })
  }

  getCanvasId() {
    return this.class.canvasId
  }
}

