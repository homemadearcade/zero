import Phaser from "phaser";
import store from "../../store";
import { CameraPreview } from "./CameraPreview";

export class RemoteEditor extends Phaser.GameObjects.Container {
  constructor(scene, {userId, color}){
    super(scene, 0, 0)
    this.userId = userId
    this.color = color

    scene.add.existing(this)
    this.scene = scene

    // this.test = scene.add.graphics();
    // this.test.lineStyle(10, color, 1);
    // this.test.strokeRect(0, 0, 100, 100);
    // this.test.setVisible(true)
    // this.add(this.test)

    return this
  }

  onPhaserViewFound() {
    const phaserView = store.getState().status.phaserViews[this.userId]
    this.cameraPreview = new CameraPreview(this.scene, { zoom: phaserView.cameraZoom, color: this.color})
  }

  onPhaserViewLost() {
    this.cameraPreview.destroy()
    this.cameraPreview = null
  }

  update() {
    if(this.cameraPreview) {
      const phaserView = store.getState().status.phaserViews[this.userId]
      if(phaserView) {
        this.cameraPreview.update({
          x: phaserView.cameraX,
          y: phaserView.cameraY
        })
      }
    }
  }
}
