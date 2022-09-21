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
      scene.add.existing(this.group, true)

    } else if(scene.physicsType === ARCADE_PHYSICS) {
      
      this.group = []

      parts.forEach(({x, y, width}) => {
        
        const rect =  scene.add.rectangle(x + (nodeWidth * width)/2, y + nodeHeight/2, nodeWidth * width, nodeHeight)
        // rect.setAlpha(0)
        scene.physics.world.enable(rect)
        rect.body.setAllowGravity(false)
        rect.body.setImmovable(true)
        this.group.push(rect)
      })

      // scene.physics.add.existing(this.group)

      // this.group = new Phaser.Physics.Arcade.Sprite(scene, 0 + width/2, 0 + width/2, null, { isStatic: true })
    }

    return this
  }

  destroy() {
    this.group.destroy()
  }
}

