import Phaser from "phaser";
import { nodeSize } from "../constants";
import store from "../../store";
import { CameraPreview } from "./members/CameraPreview";
import { getHexIntFromHexString } from "../../utils";

export class RemoteEditor extends Phaser.GameObjects.Container {
  constructor(scene, {userMongoId, color}){
    super(scene, 0, 0)
    this.userMongoId = userMongoId
    this.color = getHexIntFromHexString(color)

    scene.add.existing(this)
    this.scene = scene

    // this.test = scene.add.graphics();
    // this.test.lineStyle(10, color, 1);
    // this.test.strokeRect(0, 0, 100, 100);
    // this.test.setVisible(true)
    // this.add(this.test)

    return this
  }

  onPhaserViewFound(scene) {
    const phaserView = store.getState().status.phaserViews[this.userMongoId]
    if(!this.scene) return console.log('we dont have a scene here... preventing phaser breakdown')
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
    this.mouse = null
  }

  update() {
    const phaserView = store.getState().status.phaserViews[this.userMongoId]

    if(phaserView)  {
      if(this.cameraPreview) {
        if(phaserView.isGridViewOn) {
          this.cameraPreview.update({
            x: phaserView.cameraX,
            y: phaserView.cameraY
          })
        } else {
          this.cameraPreview.setVisible(false)
        }
      }
  
      if(this.mouse) {
        this.mouse.setPosition(phaserView.mouseWorldX, phaserView.mouseWorldY)
      }
    }
  }
}
