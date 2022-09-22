import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, WORLD_BACKGROUND_CANVAS_DEPTH } from "../../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";

export class World {
  constructor(scene, { boundaries, gravity }){
    this.scene = scene
    this.physicsType = scene.physicsType

    this.setGravity(gravity.x, gravity.y)
    this.setBoundaries(boundaries)

    const gameModel = store.getState().game.gameModel
    const colorInt = getHexIntFromHexString(gameModel.world.backgroundColor || '#000000')
    this.backgroundColorLayer = this.scene.add.rectangle(0, 0, gameModel.world.boundaries.maxWidth * 2, gameModel.world.boundaries.maxHeight * 2, colorInt)
    this.backgroundColorLayer.setDepth(WORLD_BACKGROUND_CANVAS_DEPTH)

    return this
  }

  setGravity(x, y) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.scene.matter.world.setGravity(x, y)
    } else if(this.physicsType === ARCADE_PHYSICS) {
      this.scene.physics.world.gravity.x = x * 100
      this.scene.physics.world.gravity.y = y * 100
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