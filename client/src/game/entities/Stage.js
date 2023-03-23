import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, OBJECT_INSTANCE_ID_PREFIX, STAGE_LAYER_DEPTH, STAGE_LAYER_ID } from "../constants";
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
    this.createStageColorLayer()

    return this
  }

  createStageColorLayer() {    
    const stage = this.scene.getCurrentStage()
    const boundaries = stage.boundaries
    const colorInt = getHexIntFromHexString(stage.color || '#000000')
    if(this.colorLayer) this.colorLayer.destroy()
    this.colorLayer = this.scene.add.rectangle(0, 0, boundaries.maxWidth * 2, boundaries.maxHeight * 2, colorInt)
    this.colorLayer.setDepth(STAGE_LAYER_DEPTH)
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
    const stage = this.scene.getCurrentStage()
    const spawnZones = this.scene.getAllEntityInstancesOfClassId(stage.playerSpawnZoneClassId) 
    if(!spawnZones.length) {
      this.scene.initializeEntityInstance(OBJECT_INSTANCE_ID_PREFIX + generateUniqueId(), { spawnX: stage.boundaries.width/2, spawnY: stage.boundaries.height/2, entityClassId: stage.playerSpawnZoneClassId}, true)
    }
  }

  update() {
    const isBackgroundVisible = !getCobrowsingState().gameViewEditor.layerInvisibility[STAGE_LAYER_ID]
    this.colorLayer.setVisible(isBackgroundVisible)
  }
}