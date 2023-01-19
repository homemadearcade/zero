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
    const gameMaxWidth = gameModel.stages['default'].boundaries.maxWidth
    const cameraSize = gameMaxWidth/zoom

    this.clear()

    this.cameraSize = cameraSize 

    this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    this.strokeRect(0, 0, cameraSize - (CAMERA_PREVIEW_BORDER_SIZE), cameraSize - (CAMERA_PREVIEW_BORDER_SIZE));
    this.setVisible(true)

    this.zoom = zoom
  }

  update(followingEntity, useGameBoundaries) {
    if(!this.scene) return console.error('camera not destroyed again')
    
    if(this.scene.isGridViewOn) {

      this.setVisible(true)

      let cornerX = followingEntity.x
      let cornerY = followingEntity.y
  
      const gameModel = store.getState().gameModel.gameModel

      if(useGameBoundaries) {
        cornerX = Phaser.Math.Clamp(cornerX, gameModel.stages['default'].boundaries.x, gameModel.stages['default'].boundaries.x + gameModel.stages['default'].boundaries.width - this.cameraSize)
        cornerY = Phaser.Math.Clamp(cornerY, gameModel.stages['default'].boundaries.y, gameModel.stages['default'].boundaries.y + gameModel.stages['default'].boundaries.height - this.cameraSize)
      } else {
        cornerX = Phaser.Math.Clamp(cornerX, 0, gameModel.stages['default'].boundaries.maxWidth - this.cameraSize)
        cornerY = Phaser.Math.Clamp(cornerY, 0, gameModel.stages['default'].boundaries.maxHeight - this.cameraSize)
      }

      this.setPosition(cornerX + (CAMERA_PREVIEW_BORDER_SIZE/2), cornerY + (CAMERA_PREVIEW_BORDER_SIZE/2))  
    } else {
      this.setVisible(false)
    }
  }
}
