import Phaser from "phaser";
import { nodeSize } from "../../defaultData/general";
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

    var circle = new Phaser.Geom.Circle(0, 0, nodeSize);
    // circle.setPosition(400, 200);
    this.mouse = this.scene.add.graphics({ lineStyle: { color: this.color } });
    this.mouse.strokeCircleShape(circle);
    this.scene.uiLayer.add([this.mouse])
  }

  onPhaserViewLost() {
    this.cameraPreview.destroy()
    this.cameraPreview = null
    this.mouse.destroy()
  }

  update() {
    const phaserView = store.getState().status.phaserViews[this.userId]

    if(phaserView)  {
      if(this.cameraPreview) {
        this.cameraPreview.update({
          x: phaserView.cameraX,
          y: phaserView.cameraY
        })
      }
  
      if(this.mouse) {
        this.mouse.setPosition(phaserView.mouseWorldX, phaserView.mouseWorldY)
      }
    }
  }
}
