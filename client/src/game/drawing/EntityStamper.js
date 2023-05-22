import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import { DEFAULT_TEXTURE_ID } from "../constants";
import { getHexIntFromHexString, snapObjectXY } from "../../utils/editorUtils";

export class EntityStamper extends Phaser.GameObjects.Image {
  constructor(scene, entityModel, entityInstanceData){

    const textureId = entityModel.graphics.textureId || DEFAULT_TEXTURE_ID

    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)

    if(!spriteSheetName) {
      super(scene, 0, 0, textureId, 0)
    } else {
      super(scene, 0, 0, spriteSheetName, spriteIndex)
    }

    this.scene = scene
    this.entityModelId = entityModel.entityModelId
    this.entityModel = entityModel
    this.scene.add.existing(this)
    
    this.setDisplaySize(
      entityInstanceData?.width || this.entityModel.graphics.width, 
      entityInstanceData?.height || this.entityModel.graphics.height
    )
    const depth = this.scene.getEntityModelDepth(entityModel.entityModelId)
    this.setDepth(depth)

    if(entityModel.graphics.textureTint) {
      const colorInt = getHexIntFromHexString(entityModel.graphics.textureTint)
      this.setTint(colorInt)
    }

    return this
  }

  update(pointer) {
    const { clampedX, clampedY, freeX, freeY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, entityModel: this.entityModel})
    const isPixelPerfectModeOn = this.scene.isPixelPerfectModeOn()
    if(isPixelPerfectModeOn) {
      this.setPosition(freeX, freeY)
    } else {
      this.setPosition(clampedX, clampedY)
    }
  }

  stamp(pointer) {
    const { clampedX, clampedY, freeX, freeY } = snapObjectXY({x: pointer.worldX, y: pointer.worldY, entityModel: this.entityModel})

    const isPixelPerfectModeOn = this.scene.isPixelPerfectModeOn()
    let x, y;
    if(isPixelPerfectModeOn) {
      x = freeX
      y = freeY
    } else {
      x = clampedX
      y = clampedY
    }

    this.scene.addEntityInstanceToStageModel(this.entityModelId, {
      spawnX: x, 
      spawnY: y
    })
  }
}


