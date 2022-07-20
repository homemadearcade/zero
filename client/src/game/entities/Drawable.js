import Phaser from "phaser";

export class Drawable extends Phaser.GameObjects.Image {
  constructor(scene, {parts, width, height, nodeWidth, nodeHeight}){
    super(scene.matter.world, 0 + width/2, 0 + width/2, null, { isStatic: true })

    return this
  }
}

