import Phaser from "phaser";

export class WorldCollisionBody extends Phaser.Physics.Matter.Sprite {
  constructor(scene, {parts, width, height, nodeWidth, nodeHeight}){
    super(scene.matter.world, 0 + width/2, 0 + width/2, null, { isStatic: true })
    
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;

    const compoundBody = Body.create({
      parts: parts.map(({x, y, width}) => {
        return Bodies.rectangle(x + (nodeWidth * width)/2, y + nodeHeight/2, nodeWidth * width, nodeHeight, { isStatic: true })
      }),
      isStatic: true
    })
    
    this.setDisplaySize(width, height)
    this.setExistingBody(compoundBody)
    this.setAlpha(0)

    scene.add.existing(this, true)

    return this
  }
}

