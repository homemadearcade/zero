// import { BACKGROUND_CANVAS_ID } from "../constants";
import { defaultZoneClass } from "./class";
import { gameSize, nodeSize } from "./general";
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
      'playerClassId': 'vehicle',
      'playerSpawnZoneId': 'objectclass/playerspawnzone',
      objects: {
        'objectinstance/playerspawnzone': {
          id: 'objectinstance/playerspawnzone',
          classId: 'objectclass/playerspawnzone',
          spawnX: gameSize/2,
          spawnY: gameSize/2,
        }
      },
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
    "vehicle": vehicleClass,
    "jumper": jumperClass,
    "directional": directionalClass,
    'objectclass/playerspawnzone': {
      name: 'Player Spawn Zone',
      ...defaultZoneClass,
      graphics: {
        ...defaultZoneClass.graphics,
        tint: '#FFFFFF'
      }
    }
  },
}