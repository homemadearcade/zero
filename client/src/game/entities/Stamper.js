import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import store from "../../store";
import { OBJECT_INSTANCE_LAYER_DEPTH } from "../../constants";

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
    const { snappedX, snappedY } = this.getSnapXY(pointer, this.class)

    this.setPosition(snappedX, snappedY)
    this.setDisplaySize(this.class.width, this.class.height)
    this.setDepth(OBJECT_INSTANCE_LAYER_DEPTH)
  }

  getSnapXY({x, y}, objectClass) {
    const gameModel = store.getState().game.gameModel
    const nodeSize = gameModel.world.nodeSize

    const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x, nodeSize), objectClass.width/2, gameModel.world.boundaries.width - (objectClass.width/2))
    const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y, nodeSize), objectClass.height/2, gameModel.world.boundaries.height - (objectClass.height/2))

    return {
      snappedX,
      snappedY
    }
  }

  stamp(pointer) {
    const { snappedX, snappedY } = this.getSnapXY(pointer, this.class)
    this.scene.addGameObject(this.classId, {
      spawnX: snappedX, 
      spawnY: snappedY
    })
  }

  getLayerId() {
    return this.class.layerId
  }
}

