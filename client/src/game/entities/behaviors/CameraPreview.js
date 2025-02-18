import { CAMERA_PREVIEW_BORDER_SIZE } from "../../constants";
import store from "../../../store";
import Phaser from "phaser";

export class CameraPreview extends Phaser.GameObjects.Graphics {
  constructor(scene, { zoom, color }){
    super(scene)

    this.scene = scene
    this.color = color
    scene.add.existing(this)

    this.setZoom(zoom)
    this.setVisible(false)

    scene.uiLayer.add([this])
    return this
  }

  setZoom(zoom) {
    const gameModel = store.getState().gameModel.gameModel
    const gameMaxWidth = gameModel.stages[this.scene?.stage.stageId].boundaries.maxWidth
    const cameraSize = gameMaxWidth/zoom

    this.clear()

    this.cameraSize = cameraSize 

    this.width = cameraSize - (CAMERA_PREVIEW_BORDER_SIZE)
    this.height = cameraSize - (CAMERA_PREVIEW_BORDER_SIZE)

    this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    this.strokeRect(0, 0, this.width, this.height);
    this.setVisible(true)

    this.zoom = zoom
  }

  update(followingEntity, useGameBoundaries) {
    if(!this.scene) {
      this.destroy()
      return console.error('camera not destroyed again')
    }
    
    if(this.scene.isGridViewOn) {

      this.setVisible(true)

      let cornerX = followingEntity.x
      let cornerY = followingEntity.y
  
      const gameModel = store.getState().gameModel.gameModel

      if(useGameBoundaries) {
        cornerX = Phaser.Math.Clamp(cornerX, gameModel.stages[this.scene.stage.stageId].boundaries.x, gameModel.stages[this.scene.stage.stageId].boundaries.x + gameModel.stages[this.scene.stage.stageId].boundaries.width - this.cameraSize)
        cornerY = Phaser.Math.Clamp(cornerY, gameModel.stages[this.scene.stage.stageId].boundaries.y, gameModel.stages[this.scene.stage.stageId].boundaries.y + gameModel.stages[this.scene.stage.stageId].boundaries.height - this.cameraSize)
      } else {
        cornerX = Phaser.Math.Clamp(cornerX, 0, gameModel.stages[this.scene.stage.stageId].boundaries.maxWidth - this.cameraSize)
        cornerY = Phaser.Math.Clamp(cornerY, 0, gameModel.stages[this.scene.stage.stageId].boundaries.maxHeight - this.cameraSize)
      }

      this.setPosition(cornerX + (CAMERA_PREVIEW_BORDER_SIZE/2), cornerY + (CAMERA_PREVIEW_BORDER_SIZE/2))  
    } else {
      this.setVisible(false)
    }
  }
}
