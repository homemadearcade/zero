// import { BACKGROUND_CANVAS_ID } from "../constants";
import { defaultZoneClass } from "./class";
import { nodeSize } from "./general";
import { directionalClass, jumperClass, vehicleClass } from "./players";
import { defaultStage } from "./stage";

export const defaultGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": ""
  },
  "stages": {
    'stage/default': {
      name: 'Stage # 1',
      'playerClassId': 'oc/pl/vehicle',
      ...defaultStage,
      boundaries: {...defaultStage.boundaries}, 
      gravity: {...defaultStage.gravity}
    },
  },
  "nodeSize": nodeSize,
  colors: {

  },
  defaults: {
    playerClass: '',
    boundaryRelation: ''
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
    'initialStageId': 'stage/default'
  },
  "classes": {
    "oc/pl/vehicle": vehicleClass,
    "oc/pl/jumper": jumperClass,
    "oc/pl/directional": directionalClass,
    'oc/z/playerspawnzone': {
      name: 'Player Spawn Zone',
      ...defaultZoneClass,
      classId: 'oc/z/playerspawnzone',
      graphics: {
        ...defaultZoneClass.graphics,
        tint: '#FFFFFF'
      }
    }
  },
}