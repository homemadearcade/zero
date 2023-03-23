import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import { DEFAULT_TEXTURE_ID } from "../constants";
import { getHexIntFromHexString, snapObjectXY } from "../../utils/editorUtils";

export class ClassStamper extends Phaser.GameObjects.Image {
  constructor(scene, entityClassId, entityClass){

    const textureId = entityClass.graphics.textureId || DEFAULT_TEXTURE_ID

    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)

    if(!spriteSheetName) {
      super(scene, 0, 0, textureId, 0)
    } else {
      super(scene, 0, 0, spriteSheetName, spriteIndex)
    }

    this.scene = scene
    this.entityClassId = entityClassId
    this.entityClass = entityClass
    this.scene.add.existing(this)
    
    this.setDisplaySize(this.entityClass.graphics.width, this.entityClass.graphics.height)
    this.setDepth(this.scene.getEntityClassDepth(entityClassId))

    if(entityClass.graphics.textureTint) {
      const colorInt = getHexIntFromHexString(entityClass.graphics.textureTint)
      this.setTint(colorInt)
    }

    return this
  }

  update(pointer) {
    const { clampedX, clampedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, entityClass: this.entityClass})
    this.setPosition(clampedX, clampedY)
  }

  stamp(pointer) {
    const { clampedX, clampedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, entityClass: this.entityClass})
    this.scene.addEntityInstanceData(this.entityClassId, {
      spawnX: clampedX, 
      spawnY: clampedY
    })
  }

  getCanvasId() {
    return this.entityClass.graphics.layerId
  }
}

