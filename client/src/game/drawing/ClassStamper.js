import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import { DEFAULT_TEXTURE_ID } from "../constants";
import { getHexIntFromHexString, snapObjectXY } from "../../utils/editorUtils";

export class ClassStamper extends Phaser.GameObjects.Image {
  constructor(scene, classId, objectClass){

    const textureId = objectClass.graphics.textureId || DEFAULT_TEXTURE_ID

    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)

    if(!spriteSheetName) {
      super(scene, 0, 0, textureId, 0)
    } else {
      super(scene, 0, 0, spriteSheetName, spriteIndex)
    }

    this.scene = scene
    this.classId = classId
    this.objectClass = objectClass
    this.scene.add.existing(this)
    
    this.setDisplaySize(this.objectClass.graphics.width, this.objectClass.graphics.height)
    this.scene.addSpriteToTypeLayer(classId, this)

    if(objectClass.graphics.tint) {
      const colorInt = getHexIntFromHexString(objectClass.graphics.tint)
      this.setTint(colorInt)
    }

    return this
  }

  update(pointer) {
    const { clampedX, clampedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, objectClass: this.objectClass})
    this.setPosition(clampedX, clampedY)
  }

  stamp(pointer) {
    const { clampedX, clampedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, objectClass: this.objectClass})
    this.scene.addObjectInstanceData(this.classId, {
      spawnX: clampedX, 
      spawnY: clampedY
    })
  }

  getCanvasId() {
    return this.objectClass.graphics.layerId
  }
}

