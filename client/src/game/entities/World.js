import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, WORLD_BACKGROUND_CANVAS_DEPTH } from "../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";

export class World {
  constructor(scene, { boundaries, gravity }){
    this.scene = scene
    this.physicsType = scene.physicsType

    this.setGravity(gravity.x, gravity.y)
    this.setBoundaries(boundaries)
    this.createWorldBackgroundColorLayer()

    return this
  }

  createWorldBackgroundColorLayer() {
    const gameModel = store.getState().gameModel.gameModel
    const colorInt = getHexIntFromHexString(gameModel.world.backgroundColor || '#000000')
    if(this.backgroundColorLayer) this.backgroundColorLayer.destroy()
    this.backgroundColorLayer = this.scene.add.rectangle(0, 0, gameModel.world.boundaries.maxWidth * 2, gameModel.world.boundaries.maxHeight * 2, colorInt)
    this.backgroundColorLayer.setDepth(WORLD_BACKGROUND_CANVAS_DEPTH)
  }

  setGravity(x, y) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.scene.matter.world.setGravity(x, y)
    } else if(this.physicsType === ARCADE_PHYSICS) {
      this.scene.physics.world.gravity.x = x * 20
      this.scene.physics.world.gravity.y = y * 20
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