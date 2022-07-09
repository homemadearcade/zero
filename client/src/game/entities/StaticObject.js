import Phaser from "phaser";

export class StaticObject extends Phaser.Physics.Matter.Image {
  constructor(scene, {x, y, width, height, spriteId}){
    super(scene.matter.world, x + width/2, y + width/2, null, null, { restitution: 0, isStatic: true })

    this.setAlpha(0)
    this.setStatic(true)
    
    this.setDisplaySize(width, height)

    scene.add.existing(this, true)

    return this
  }

  update() {

  }
}
