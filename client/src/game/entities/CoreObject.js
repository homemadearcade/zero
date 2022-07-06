import Phaser from "phaser";
import store from "../../store";

export class CoreObject extends Phaser.Physics.Matter.Sprite {
  constructor(scene, {spriteId = 'ship', spawnX, spawnY, id, bounciness, classId}){
    super(scene.matter.world, spawnX, spawnY, spriteId, 0)

    this.id = id
    this.classId = classId

    const objectClass = store.getState().game.gameModel.classes[this.classId]

    this.outline2 = scene.add.image(spawnX, spawnY, spriteId)
    .setTintFill(0xffffff)
    .setDisplaySize(this.width + 8, this.height + 8)
    .setVisible(false)
   
    this.ship = scene.matter.add.sprite(this);
    scene.add.existing(this)
    this.setInteractive();
    scene.input.setDraggable(this)

    if(objectClass?.bounciness) this.setBounce(objectClass.bounciness)

    this.outline = scene.add.graphics();
    this.outline.lineStyle(3, 0xffffff, 1);
    this.outline.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
    this.outline.setVisible(false)

    return this
  }

  update() {
    if(true || this.outline.visible) {
      this.outline.setPosition(this.x, this.y)
      this.outline.setRotation(this.rotation)
      this.outline2.setPosition(this.x, this.y)
      this.outline2.setRotation(this.rotation)
    }
  }
}
