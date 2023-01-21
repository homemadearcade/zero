import { BOUNDARY_DOWN_WALL_ID, BOUNDARY_LEFT_WALL_ID, BOUNDARY_RIGHT_WALL_ID, BOUNDARY_UP_WALL_ID, BOUNDARY_WALL_ID, PLAYER_INSTANCE_ID_PREFIX, PLAY_STATE, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, OBJECT_CLASS_ID_PREFIX, PLAYER_CLASS_TYPE_PREFIX } from "../game/constants";
import { GameClientScene } from "../game/scenes/GameClientScene";
import { GameHostScene } from "../game/scenes/GameHostScene";
import { GameLocalScene } from "../game/scenes/GameLocalScene";
import { GamePlayScene } from "../game/scenes/GamePlayScene";
import store from "../store";
import { getCurrentGameScene } from "./editorUtils";

export function isGameBoundaryWall(world, body) {
  if(body === world.walls.left || body === world.walls.right || body === world.walls.up || body === world.walls.down) {
    return true
  }

  return false
}

export function getClassAandB(classIdA, classIdB) {
 // if the class dont exist, its the playerclass ( as of now thats the only generalized one)

  const state = store.getState()
  const gameContext = state.gameContext
  const gameModel = state.gameModel.gameModel

  let classA = gameModel.classes[classIdA] 
  let classB = gameModel.classes[classIdB]

  const playerClassId= gameContext.player.classId

  // if(classIdA === PLAYER_INSTANCE_ID_PREFIX) {
  //   classA = gameModel.classes[stage.playerClassId].playerClassId]
  //   classA.name = 'Player'
  // }

  if(classIdB === PLAYER_INSTANCE_ID_PREFIX) {
    classB = {...gameModel.classes[playerClassId], name: 'Player'}
  }

  return {
    classA, 
    classB
  }
}

export function isEventMatch({effect, classId, world, gameObject, body}) {
  if(
    (classId === BOUNDARY_DOWN_WALL_ID && body === world.walls.down) ||
    (classId === BOUNDARY_UP_WALL_ID && body === world.walls.up) ||
    (classId === BOUNDARY_LEFT_WALL_ID && body === world.walls.left) ||
    (classId === BOUNDARY_RIGHT_WALL_ID && body === world.walls.right) ||
    (classId === BOUNDARY_WALL_ID && isGameBoundaryWall(world, body))
  ) {
    return true
  }

  if(!gameObject) return false
  
  if(gameObject.classId === classId) {
    return true
  }

  if(classId === PLAYER_INSTANCE_ID_PREFIX) {
    return gameObject.type === PLAYER_INSTANCE_ID_PREFIX
  }

  return false
}

export function areBSidesHit(sidesList, a, b) {
  const verdict = sidesList.some((side) => {
    if(side === SIDE_UP) {
      if (b.body.touching.up && a.body.touching.down) {
        return true
      }
    } else if(side === SIDE_DOWN) {
      if (b.body.touching.down && a.body.touching.up) {
        return true
      }
    } else if(side === SIDE_RIGHT) {
      if (b.body.touching.right && a.body.touching.left) {
        return true
      }
    } else if(side === SIDE_LEFT) {
      if (b.body.touching.left && a.body.touching.right) {
        return true
      }
    }

    return false
  })

  return verdict
}

export function getClassDisplayName(descriptors, classId) {
  return descriptors ? descriptors[0] : classId
}

export function getOppositeRelationClassId(classId, relation) {
  if(classId === relation.event.classIdA) {
    return relation.event.classIdB
  }
  if(classId === relation.event.classIdB) {
    return relation.event.classIdA
  }

  return null
}

export function isPlayerId(id) {
  if(id.indexOf(OBJECT_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX) === 0) {
    return true
  }

  if(id.indexOf(PLAYER_INSTANCE_ID_PREFIX) === 0) {
    return true
  }
}

export function createGameSceneInstance(key, sceneInstanceData) {
  const { isPlay, isNetworked, isHost } = sceneInstanceData
  if(isPlay) {
    return new GamePlayScene({ sceneInstanceData: sceneInstanceData, key})
  } else if(isNetworked) {
    if(isHost) {
      return new GameHostScene({ sceneInstanceData: sceneInstanceData, key})
    } else {
      return new GameClientScene({ sceneInstanceData: sceneInstanceData, key})
    }
  } else {
    return new GameLocalScene({ sceneInstanceData: sceneInstanceData, key})
  }
}

window.consoleTools = {
  getCurrentScene: () => { return getCurrentGameScene(store.getState().webPage.gameInstance) },
  getCurrentGameModel: () => { return store.getState().gameModel.gameModel },
  getCurrentState: () => { return store.getState() }
}