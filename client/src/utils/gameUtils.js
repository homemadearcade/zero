import { BOUNDARY_DOWN_WALL_ID, BOUNDARY_LEFT_WALL_ID, BOUNDARY_RIGHT_WALL_ID, BOUNDARY_UP_WALL_ID, BOUNDARY_WALL_ID, PLAYER_INSTANCE_ID_PREFIX, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, ENTITY_CLASS_ID_PREFIX, PLAYER_CLASS_TYPE_PREFIX, ZONE_CLASS_TYPE_PREFIX } from "../game/constants";
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

export function getClassAandB(entityClassIdA, entityClassIdB) {
  const state = store.getState()
  const gameModel = state.gameModel.gameModel

  let classA = gameModel.entityClasses[entityClassIdA] 
  let classB = gameModel.entityClasses[entityClassIdB]

  return {
    classA, 
    classB
  }
}

export function getTextureIdForLayerId(arcadeGameMongoId, stageId, layerId) {
   return arcadeGameMongoId+'/' + stageId + '_' + layerId
}

export function isEventMatch({effect, entityClassId, world, entityClass, body}) {
  if(
    (entityClassId === BOUNDARY_DOWN_WALL_ID && body === world.walls.down) ||
    (entityClassId === BOUNDARY_UP_WALL_ID && body === world.walls.up) ||
    (entityClassId === BOUNDARY_LEFT_WALL_ID && body === world.walls.left) ||
    (entityClassId === BOUNDARY_RIGHT_WALL_ID && body === world.walls.right) ||
    (entityClassId === BOUNDARY_WALL_ID && isGameBoundaryWall(world, body))
  ) {
    return true
  }

  if(!entityClass) return false
  
  if(entityClass.entityClassId === entityClassId) {
    return true
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

export function getClassDisplayName(visualTags, entityClassId) {
  return visualTags ? visualTags[0] : entityClassId
}

export function getOppositeColliderRelationTagId(relationTagId, collision) {
  if(relationTagId === collision.relationTagIdA) {
    return collision.relationTagIdB
  }
  if(relationTagId === collision.relationTagIdB) {
    return collision.relationTagIdA
  }

  return null
}

export function isPlayerId(id) {
  if(id.indexOf(ENTITY_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX) === 0) {
    return true
  }

  if(id.indexOf(PLAYER_INSTANCE_ID_PREFIX) === 0) {
    return true
  }
}

export function isZoneClassId(id) {
  if(id.indexOf(ENTITY_CLASS_ID_PREFIX+ZONE_CLASS_TYPE_PREFIX) === 0) {
    return true
  }
}

export function createGameSceneInstance(key, gameRoomInstance) {
  const { isEdit, isNetworked, isHost } = gameRoomInstance
  if(isEdit) {
    if(isNetworked) {
      if(isHost) {
        return new GameHostScene({ gameRoomInstance: gameRoomInstance, key})
      } else {
        return new GameClientScene({ gameRoomInstance: gameRoomInstance, key})
      }
    } else {
      return new GameLocalScene({ gameRoomInstance: gameRoomInstance, key})
    }
  } else {
    return new GamePlayScene({ gameRoomInstance: gameRoomInstance, key})
  }
}

window.consoleTools = {
  getCurrentScene: () => { return getCurrentGameScene(store.getState().webPage.gameInstance) },
  getCurrentGameModel: () => { return store.getState().gameModel.gameModel },
  getCurrentState: () => { return store.getState() },
  getCobrowsingState: () => { return getCobrowsingState({forceActiveCobrowsing: true }) },
  getCurrentPhaserWorld: () => { return getCurrentGameScene(store.getState().webPage.gameInstance).world }
}