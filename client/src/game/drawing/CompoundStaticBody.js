import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS } from "../../constants";

export class CompoundStaticBody {
  constructor(scene, {parts, width, height, nodeWidth, nodeHeight}){

    if(scene.physicsType === MATTER_PHYSICS) {
      this.group = new Phaser.Physics.Matter.Sprite(scene.matter.world, 0 + width/2, 0 + width/2, null, { isStatic: true })
    
      const { Body, Bodies } = Phaser.Physics.Matter.Matter;
  
      const compoundBody = Body.create({
        parts: parts.map(({x, y, width}) => {
          return Bodies.rectangle(x + (nodeWidth * width)/2, y + nodeHeight/2, nodeWidth * width, nodeHeight, { isStatic: true })
        }),
        isStatic: true
      })
      
      this.group.setDisplaySize(width, height)
      this.group.setExistingBody(compoundBody)
      this.group.setAlpha(0)
    } else if(scene.physicsType === ARCADE_PHYSICS) {
      
      this.group = new Phaser.Physics.Arcade.StaticGroup(scene.physics.world, scene)

      parts.forEach(({x, y, width}) => {
        const body =  this.scene.add.rectangle(x + (nodeWidth * width)/2, y + nodeHeight/2, nodeWidth * width, nodeHeight)
        // body.setAlpha(0)
        this.group.add(body)
      })

      // this.group = new Phaser.Physics.Arcade.Sprite(scene, 0 + width/2, 0 + width/2, null, { isStatic: true })
    }


    scene.add.existing(this.group, true)

    return this
  }

  destroy() {
    this.group.destroy()
  }
}

