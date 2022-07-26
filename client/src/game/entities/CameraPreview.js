import { CAMERA_PREVIEW_BORDER_SIZE } from "../../constants";
import store from "../../store";
import Phaser from "phaser";

export class CameraPreview extends Phaser.GameObjects.Graphics {
  constructor(scene, { zoom, color }){
    super(scene)

    this.scene = scene
    this.color = color
    scene.add.existing(this)

    this.setZoom(zoom)

    scene.uiLayer.add([this])
    return this
  }

  setZoom(zoom) {
    const gameModel = store.getState().game.gameModel
    const gameWidth = gameModel.world.boundaries.width
    const cameraSize = gameWidth/zoom

    this.clear()

    this.cameraSize = cameraSize 

    this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    this.strokeRect(0, 0, cameraSize - (CAMERA_PREVIEW_BORDER_SIZE), cameraSize - (CAMERA_PREVIEW_BORDER_SIZE));
    this.setVisible(true)

    this.zoom = zoom
  }

  update(followingEntity) {
    if(this.scene.isEditModeOn) {

      this.setVisible(true)

      let cornerX = followingEntity.x
      let cornerY = followingEntity.y
  
      const gameModel = store.getState().game.gameModel
      cornerX = Phaser.Math.Clamp(cornerX, 0, gameModel.world.boundaries.width - this.cameraSize)
      cornerY = Phaser.Math.Clamp(cornerY, 0, gameModel.world.boundaries.height - this.cameraSize)
    
      this.setPosition(cornerX + (CAMERA_PREVIEW_BORDER_SIZE/2), cornerY + (CAMERA_PREVIEW_BORDER_SIZE/2))  
    } else {
      this.setVisible(false)
    }
  }
}
