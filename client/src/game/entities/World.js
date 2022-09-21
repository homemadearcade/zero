import Phaser from "phaser";

export class World {
  constructor(scene, { boundaries, gravity }){
    this.scene = scene
    this.physicsType = 'MATTER'

    this.setGravity(gravity.x, gravity.y)
    this.setBoundaries(boundaries)

    return this
  }

  setGravity(x, y) {
    if(this.physicsType === 'MATTER') {
      this.scene.matter.world.setGravity(x, y)
    }
  }

  setBoundaries(boundaries) {
    console.log(this, this.physicsType)
    if(!boundaries.loop) {
      const gameWidth = boundaries.width
      const gameHeight = boundaries.height
      const gameX = boundaries.x
      const gameY = boundaries.y
      if(this.physicsType === 'MATTER') {
        this.scene.matter.world.setBounds(gameX, gameY, gameWidth, gameHeight);
      }
    }
  }

}