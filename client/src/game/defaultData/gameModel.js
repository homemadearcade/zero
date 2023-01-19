// import { BACKGROUND_CANVAS_ID } from "../constants";
import { defaultZoneClass } from "./class";
import { nodeSize } from "./general";
import { directionalClass, jumperClass, vehicleClass } from "./players";
import { defaultStage } from "./stage";

export const defaulGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": ""
  },
  "stages": {
    default: {
      'playerClassId': 'oc/pl/vehicle',
      ...defaultStage,
      boundaries: {...defaultStage.boundaries}, 
      gravity: {...defaultStage.gravity}
    },
  },
  "nodeSize": nodeSize,
  colors: {

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
    'initialStageId': 'default'
  },
  "classes": {
    "oc/pl/vehicle": vehicleClass,
    "oc/pl/jumper": jumperClass,
    "oc/pl/directional": directionalClass,
    'oc/z/playerspawnzone': {
      name: 'Player Spawn Zone',
      ...defaultZoneClass,
      graphics: {
        ...defaultZoneClass.graphics,
        tint: '#FFFFFF'
      }
    }
  },
}