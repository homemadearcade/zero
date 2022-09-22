// import { BACKGROUND_CANVAS_ID } from "../constants";
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
      loop: false,
      "maxWidth": gameSize,
      "maxHeight": gameSize,
      "height": (gameSize/3) * 1,
      "width": (gameSize/3) * 1,
      "x": gameSize/3,
      "y": gameSize/3
    },
    "gravity": {
      "y": 0,
      "x": 0
    },
  },
  colors: {

  },
  cutscenes: {
    'cutscene1': {
      pauseGame: true,
      scenes: [
        {
          // imageUrl: 'https://i.imgur.com/6icjnbZ.jpeg',
          text: 'This is the first scene text'
        },
        {
          // imageUrl: 'https://i.imgur.com/6icjnbZ.jpeg',
          text: 'This is the first scene text 2. This is the first scene text 2. This is the first scene text 2. This is the first scene text 2'
        },
        {
          // imageUrl: 'https://i.imgur.com/6icjnbZ.jpeg',
          text: 'This is the first scene text 3'
        }
      ]
    }
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
    'initialClassId': 'spaceship'
  },
  "classes": {
    "spaceship": spaceshipClass
  },
  "objects": {
  }
}