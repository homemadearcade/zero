import Phaser from "phaser";

export class CoreObject extends Phaser.Physics.Matter.Sprite {
  constructor(scene, spriteTexture, x, y){
    super(scene.matter.world, x, y, spriteTexture, 0)
   
    this.ship = scene.matter.add.sprite(this);

    this.outline = scene.add.image(x, y, spriteTexture)
      .setTintFill(0xffffff)
      .setDisplaySize(this.width + 8, this.height + 8)
      .setVisible(false)

    scene.add.existing(this)
    this.setInteractive();

    // this.on('pointerover', function () {
    //   const outline = scene.add.graphics();
    //   outline.lineStyle(2, 0xffffff, 1);
    //   outline.strokeRect(this.x, this.y, this.width, this.height);
    // });

    return this
  }
}
