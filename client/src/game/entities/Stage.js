import Phaser from "phaser";
import { ARCADE_PHYSICS, MATTER_PHYSICS, ENTITY_INSTANCE_DID, STAGE_LAYER_DEPTH, STAGE_LAYER_ID, STAGE_ZONE_ENTITY_RID, STAGE_ZONE_INSTANCE_RID } from "../constants";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";
import { generateUniqueId } from "../../utils/webPageUtils";
import { getCobrowsingState } from "../../utils/cobrowsingUtils";
import { getGameModelSize } from "../../utils";

export class Stage {
  constructor(scene, stageId){
    this.scene = scene
    this.physicsType = scene.physicsType
    this.stageId = stageId

    const { boundaries, gravity } = store.getState().gameModel.gameModel.stages[stageId]

    this.setGravity(gravity.x, gravity.y)
    this.setBoundaries(boundaries)
    this.createStageColorLayer()
    
    setTimeout(() => {
      this.resetStageInstance()
    });

    return this
  }

  resetStageInstance() {
    const gameModel = this.scene.getGameModel()
    const { height, width } = getGameModelSize(gameModel)

    const initialStageZoneEntityId = STAGE_ZONE_ENTITY_RID
    const initialStageZoneInstanceId = STAGE_ZONE_INSTANCE_RID

    const initialStageZoneInstance = {
      id: initialStageZoneInstanceId,
      entityModelId: initialStageZoneEntityId,
      spawnX: width/2,
      spawnY: height/2,
    }

    this.stageInstance = this.scene.addEntityInstance(initialStageZoneInstanceId, initialStageZoneInstance)
  }

  createStageColorLayer() {    
    const gameModel = store.getState().gameModel.gameModel
    const stage = gameModel.stages[this.stageId]
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
    const stageWidth = boundaries.width
    const stageHeight = boundaries.height
    const gameX = boundaries.x
    const gameY = boundaries.y
    if(this.physicsType === MATTER_PHYSICS) {
      if(!boundaries.loop) {
        this.scene.matter.world.setBounds(gameX, gameY, stageWidth, stageHeight);
      }
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.scene.physics.world.setBounds(gameX, gameY, stageWidth, stageHeight);
    }
  }

  ensureSpawnZoneExists() {
    const gameModel = store.getState().gameModel.gameModel
    const stage = gameModel.stages[this.stageId]
    const spawnZones = this.scene.getAllEntityInstancesOfEntityId(stage.playerSpawnZoneEntityId) 
    if(!spawnZones.length) {
      this.scene.initializeEntityInstance(ENTITY_INSTANCE_DID + generateUniqueId(), { spawnX: stage.boundaries.width/2, spawnY: stage.boundaries.height/2, entityModelId: stage.playerSpawnZoneEntityId}, true)
    }
  }

  update() {
    const isBackgroundVisible = !getCobrowsingState().gameViewEditor.layerInvisibility[STAGE_LAYER_ID]
    this.colorLayer.setVisible(isBackgroundVisible)
  }
}