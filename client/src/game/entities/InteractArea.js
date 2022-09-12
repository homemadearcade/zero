import { CAMERA_PREVIEW_BORDER_SIZE, DEFAULT_TEXTURE_ID } from "../../constants";
import store from "../../store";
import Phaser from "phaser";

export class InteractArea extends Phaser.Physics.Matter.Image {
  constructor(scene, { color, size }){
    super(scene.matter.world, 0, 0, DEFAULT_TEXTURE_ID, 0, { isSensor: true })

    this.scene = scene
    this.color = color
    this.size = size

    this.setOrigin(0.5, 0.5)
    this.setAlpha(0.3)
    this.setTint(0x0000FF)
    this.setDisplaySize(this.size, this.size)

    scene.add.existing(this)
    scene.uiLayer.add([this])

    // this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    // this.strokeRect(-size/2, -size/2, size - (CAMERA_PREVIEW_BORDER_SIZE), size - (CAMERA_PREVIEW_BORDER_SIZE));

    return this
  }

  update(followingEntity) {
    if(!this.scene) return console.error('interact area not destroyed again')
    
    let cornerX = followingEntity.x
    let cornerY = followingEntity.y
      
    this.setAngle(followingEntity.angle)
    this.setPosition(cornerX, cornerY)  

    if(this.scene.isGridViewOn) {
      this.setVisible(true)
    } else {
      this.setVisible(false)
    }
  }
}
