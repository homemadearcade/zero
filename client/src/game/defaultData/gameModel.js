// import { BACKGROUND_CANVAS_ID } from "../constants";
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
      objects: {},
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
    spawnX: gameSize/2,
    spawnY: gameSize/2,
    'initialClassId': 'vehicle'
  },
  "classes": {
    "vehicle": vehicleClass,
    "jumper": jumperClass,
    "directional": directionalClass
  },
}