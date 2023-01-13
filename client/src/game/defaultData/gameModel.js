// import { BACKGROUND_CANVAS_ID } from "../constants";
import { gameSize, nodeSize } from "./general";
import { directionalClass, jumperClass, vehicleClass } from "./heros";

export const defaulGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": ""
  },
  "world": {
    "nodeSize": nodeSize,
    "boundaries": {
      loop: false,
      "maxWidth": gameSize,
      "maxHeight": gameSize,
      "height": (gameSize/3) * 1,
      "width": (gameSize/3) * 1,
      "x": gameSize/3,
      "y": gameSize/3
    },
    "gravity": {
      "y": 12,
      "x": 0
    },
  },
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
  "hero": {
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
  "objects": {
  }
}