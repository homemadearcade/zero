import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, OBJECT_INSTANCE_ID_PREFIX, STAGE_BACKGROUND_CANVAS_DEPTH, STAGE_BACKGROUND_CANVAS_ID } from "../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";
import { generateUniqueId } from "../../utils/webPageUtils";
import { getCobrowsingState } from "../../utils/cobrowsingUtils";

export class Stage {
  constructor(scene, stageId, { boundaries, gravity }){
    this.scene = scene
    this.physicsType = scene.physicsType
    this.stageId = stageId

    this.setGravity(gravity.x, gravity.y)
    this.setBoundaries(boundaries)
    this.createStageBackgroundColorLayer()

    return this
  }

  createStageBackgroundColorLayer() {    
    const gameModel = store.getState().gameModel.gameModel
    const stage = gameModel.stages[this.stageId]
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

  ensureSpawnZoneExists() {
    const gameModel = store.getState().gameModel.gameModel
    const stage = gameModel.stages[this.stageId]
    const spawnZones = this.scene.getAllInstancesOfClassId(stage.spawnZoneClassId) 
    if(!spawnZones.length) {
      this.scene.initializeObjectInstance(OBJECT_INSTANCE_ID_PREFIX + generateUniqueId(), { spawnX: stage.boundaries.width/2, spawnY: stage.boundaries.height/2, classId: stage.spawnZoneClassId}, true)
    }
  }

  update() {
    const isBackgroundVisible = getCobrowsingState().gameViewEditor.layerVisibility[STAGE_BACKGROUND_CANVAS_ID]
    this.backgroundColorLayer.setVisible(isBackgroundVisible)
  }
}