import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, STAGE_BACKGROUND_CANVAS_DEPTH } from "../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";

export class Stage {
  constructor(scene, id, { boundaries, gravity }){
    this.scene = scene
    this.physicsType = scene.physicsType
    this.id = id

    this.setGravity(gravity.x, gravity.y)
    this.setBoundaries(boundaries)
    this.createWorldBackgroundColorLayer()

    return this
  }

  createWorldBackgroundColorLayer() {    
    const gameModel = store.getState().gameModel.gameModel
    const stage = gameModel.stages[this.id]
    const boundaries = stage.boundaries
    const colorInt = getHexIntFromHexString(stage.backgroundColor || '#000000')
    if(this.backgroundColorLayer) this.backgroundColorLayer.destroy()
    this.backgroundColorLayer = this.scene.add.rectangle(0, 0, boundaries.maxWidth * 2, boundaries.maxHeight * 2, colorInt)
    this.backgroundColorLayer.setDepth(STAGE_BACKGROUND_CANVAS_DEPTH)
  }

  setGravity(x, y) {
    if(this.physicsType === MATTER_PHYSICS) {
      this.scene.matter.world.setGravity(x, y)
    } else if(this.physicsType === ARCADE_PHYSICS) {
      this.scene.physics.world.gravity.x = x * 40
      this.scene.physics.world.gravity.y = y * 40
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