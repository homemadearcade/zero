import { BOUNDARY_DOWN_WALL_ID, BOUNDARY_LEFT_WALL_ID, BOUNDARY_RIGHT_WALL_ID, BOUNDARY_UP_WALL_ID, BOUNDARY_WALL_ID, PLAYER_INSTANCE_ID_PREFIX, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, OBJECT_CLASS_ID_PREFIX, PLAYER_CLASS_TYPE_PREFIX, ZONE_CLASS_TYPE_PREFIX, ZONE_INSTANCE_CANVAS_ID, ZONE_CLASS, PLAYER_INSTANCE_CANVAS_ID, PLAYER_CLASS, BASIC_CLASS, NPC_CLASS } from "../game/constants";
import { GameClientScene } from "../game/scenes/GameClientScene";
import { GameHostScene } from "../game/scenes/GameHostScene";
import { GameLocalScene } from "../game/scenes/GameLocalScene";
import { GamePlayScene } from "../game/scenes/GamePlayScene";
import store from "../store";
import { getCobrowsingState } from "./cobrowsingUtils";
import { getCurrentGameScene } from "./editorUtils";
import Phaser from 'phaser'

export function isGameBoundaryWall(world, body) {
  if(body === world.walls.left || body === world.walls.right || body === world.walls.up || body === world.walls.down) {
    return true
  }

  return false
}

export function getAngleBetweenInstances(obj1, obj2) {
  let sprite1 = obj1.sprite ? obj1.sprite : obj1
  let sprite2 = obj2.sprite ? obj2.sprite : obj2

    //I use the offset because the ship is pointing down
    //at the 6 o'clock position
    //set to 0 if your sprite is facing 3 o'clock
    //set to 180 if your sprite is facing 9 o'clock
    //set to 270 if your sprite is facing 12 o'clock
    //
    // let offSet = 90;
    // angle in radians
    // let angleRadians = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    // angle in degrees
    let angleDeg = (Math.atan2(sprite2.y - sprite1.y, sprite2.x - sprite1.x) * 180 / Math.PI);
    //add the offset
    // angleDeg += offSet;

    return Phaser.Math.DegToRad(angleDeg)
}

export function getClassAandB(classIdA, classIdB) {
  const state = store.getState()
  const gameModel = state.gameModel.gameModel

  let classA = gameModel.classes[classIdA] 
  let classB = gameModel.classes[classIdB]

  return {
    classA, 
    classB
  }
}

export function getTextureIdForLayerCanvasId(gameId, stageId, layerCanvasId) {
   return gameId+'/' + stageId + '_' + layerCanvasId
}

export function isEventMatch({effect, classId, world, objectClass, body}) {
  if(
    (classId === BOUNDARY_DOWN_WALL_ID && body === world.walls.down) ||
    (classId === BOUNDARY_UP_WALL_ID && body === world.walls.up) ||
    (classId === BOUNDARY_LEFT_WALL_ID && body === world.walls.left) ||
    (classId === BOUNDARY_RIGHT_WALL_ID && body === world.walls.right) ||
    (classId === BOUNDARY_WALL_ID && isGameBoundaryWall(world, body))
  ) {
    return true
  }

  if(!objectClass) return false
  
  if(objectClass.classId === classId) {
    return true
  }

  if(classId === PLAYER_INSTANCE_ID_PREFIX) {
    return objectClass.classInterfaceType === PLAYER_INSTANCE_ID_PREFIX
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

export function getOppositeColliderTagId(tagId, collision) {
  if(tagId === collision.event.tagIdA) {
    return collision.event.tagIdB
  }
  if(tagId === collision.event.tagIdB) {
    return collision.event.tagIdA
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

export function isZoneClassId(id) {
  if(id.indexOf(OBJECT_CLASS_ID_PREFIX+ZONE_CLASS_TYPE_PREFIX) === 0) {
    return true
  }
}

export function createGameSceneInstance(key, gameRoom) {
  const { isEdit, isNetworked, isHost } = gameRoom
  if(isEdit) {
    if(isNetworked) {
      if(isHost) {
        return new GameHostScene({ gameRoom: gameRoom, key})
      } else {
        return new GameClientScene({ gameRoom: gameRoom, key})
      }
    } else {
      return new GameLocalScene({ gameRoom: gameRoom, key})
    }
  } else {
    return new GamePlayScene({ gameRoom: gameRoom, key})
  }
}

export function getLayerIdFromClass(objectClass) {
  if(objectClass.classInterfaceType === NPC_CLASS) {
    return NPC_CLASS
  }
  if(objectClass.classInterfaceType === BASIC_CLASS) {
    return BASIC_CLASS
  }
  if(objectClass.classInterfaceType === PLAYER_CLASS) {
    return PLAYER_INSTANCE_CANVAS_ID
  }
  if(objectClass.classInterfaceType === ZONE_CLASS) {
    return ZONE_INSTANCE_CANVAS_ID
  }
}

window.consoleTools = {
  getCurrentScene: () => { return getCurrentGameScene(store.getState().webPage.gameInstance) },
  getCurrentGameModel: () => { return store.getState().gameModel.gameModel },
  getCurrentState: () => { return store.getState() },
  getCobrowsingState: () => { return getCobrowsingState({forceActiveCobrowsing: true }) },
  getCurrentPhaserWorld: () => { return getCurrentGameScene(store.getState().webPage.gameInstance).world }
}