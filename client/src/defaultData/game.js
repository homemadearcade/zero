import { BACKGROUND_CANVAS_ID } from "../constants";
import { gameSize, nodeSize } from "./general";
import { spaceshipClass } from "./heros";

export const defaultGame = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": ""
  },
  "world": {
    "nodeSize": nodeSize,
    "boundaries": {
      "width": gameSize,
      "height": gameSize,
    },
    "gravity": {
      "y": 0,
      "x": 0
    },
  },
  colors: {

  },
  "awsImages": {
    // "url": "xxx",
    // "name": 'name'
    // "type": "layer"
  },
  "hero": {
    "lives": 1,
    "spawnX": 500,
    "spawnY": 500,
    'initialClassId': 'spaceship'
  },
  "classes": {
    "spaceship": spaceshipClass
  },
  "objects": {
  }
}
