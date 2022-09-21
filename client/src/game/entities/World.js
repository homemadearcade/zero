import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS } from "../../constants";

export class World {
  constructor(scene, { boundaries, gravity }){
    this.scene = scene
    this.physicsType = scene.physicsType

    this.setGravity(gravity.x, gravity.y)
    this.setBoundaries(boundaries)

    return this
  }

  setGravity(x, y) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.scene.matter.world.setGravity(x, y)
    } else if(this.physicsType === ARCADE_PHYSICS) {
      console.log(this.scene.physics)
      this.scene.physics.world.gravity.x = x
      this.scene.physics.world.gravity.y = y
    }
  }

  setBoundaries(boundaries) {
    const gameWidth = boundaries.width
    const gameHeight = boundaries.height
    const gameX = boundaries.x
    const gameY = boundaries.y
    if(this.physicsType === MATTER_PHYSICS) {
      if(!boundaries.loop) {
        this.scene.matter.world.setBounds(gameX, gameY, gameWidth, gameHeight);
      }
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.scene.physics.world.setBounds(gameX, gameY, gameWidth, gameHeight);
    }
  }
}