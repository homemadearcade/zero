import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import { DEFAULT_TEXTURE_ID } from "../constants";
import { getHexIntFromHexString, snapObjectXY } from "../../utils/editorUtils";

export class EntityStamper extends Phaser.GameObjects.Image {
  constructor(scene, entityModelId, entityModel){

    const textureId = entityModel.graphics.textureId || DEFAULT_TEXTURE_ID

    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)

    if(!spriteSheetName) {
      super(scene, 0, 0, textureId, 0)
    } else {
      super(scene, 0, 0, spriteSheetName, spriteIndex)
    }

    this.scene = scene
    this.entityModelId = entityModelId
    this.entityModel = entityModel
    this.scene.add.existing(this)
    
    this.setDisplaySize(this.entityModel.graphics.width, this.entityModel.graphics.height)
    const depth = this.scene.getEntityModelDepth(entityModelId)
    this.setDepth(depth)

    if(entityModel.graphics.textureTint) {
      const colorInt = getHexIntFromHexString(entityModel.graphics.textureTint)
      this.setTint(colorInt)
    }

    return this
  }

  update(pointer) {
    const { clampedX, clampedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, entityModel: this.entityModel})
    this.setPosition(clampedX, clampedY)
  }

  stamp(pointer) {
    const { clampedX, clampedY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, entityModel: this.entityModel})
    this.scene.addEntityInstanceData(this.entityModelId, {
      spawnX: clampedX, 
      spawnY: clampedY
    })
  }
}


