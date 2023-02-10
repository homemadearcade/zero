// import { BACKGROUND_CANVAS_ID } from "../constants";
import { defaultZoneClass } from "./class";
import { nodeSize } from "./general";
import { directionalClass, directionalPlayerClassId, jumperClass, jumperPlayerClassId, vehicleClass, vehiclePlayerClassId } from "./players";
import { initialSpawnZoneClassId, initialStage, initialStageId } from "./stage";

export const defaultGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": "",
    isArchival: false,
    isFeatured: false,
    isPublished: false
  },
  "stages": {
     [initialStageId]: {
      ...initialStage
    }
  },
  "nodeSize": nodeSize,
  colors: {

  },
  defaults: {
    playerClass: '',
    boundaryRelation: '',
    uiThemeColor: ''
  },
  cutscenes: {

  },
  relations: {

  },
  "awsImages": {
    // "url": "xxx",
    // "name": 'name'
    // "type": "layer"
  },
  "player": {
    "lives": 1,
    'startingStageId': initialStageId
  },
  "classes": {
    [vehiclePlayerClassId]: vehicleClass,
    [jumperPlayerClassId]: jumperClass,
    [directionalPlayerClassId]: directionalClass,
    [initialSpawnZoneClassId]: {
      name: 'Player Spawn Zone',
      ...defaultZoneClass,
      classId: [initialSpawnZoneClassId],
      graphics: {
        ...defaultZoneClass.graphics,
        tint: '#FFFFFF'
      }
    },
    // LEGACY this is in here for legacy...
    'oc/z/playerspawnzone': {
      name: 'Legacy Player Spawn Zone',
      ...defaultZoneClass,
      classId: [initialSpawnZoneClassId],
      graphics: {
        ...defaultZoneClass.graphics,
        tint: '#FFFFFF'
      },
      isRemoved: true
    }
  },
  isRemoved: false
}