import { BOUNDARY_DOWN_WALL_ID, BOUNDARY_LEFT_WALL_ID, BOUNDARY_RIGHT_WALL_ID, BOUNDARY_UP_WALL_ID, BOUNDARY_WALL_ID, PLAYER_INSTANCE_DID, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, ENTITY_MODEL_DID, PLAYER_ENTITY_TYPE_PREFIX, ZONE_ENTITY_TYPE_PREFIX } from "../game/constants";
import { GameClientScene } from "../game/scenes/GameClientScene";
import { GameHostScene } from "../game/scenes/GameHostScene";
import { GameLocalScene } from "../game/scenes/GameLocalScene";
import { GamePlayScene } from "../game/scenes/GamePlayScene";
import store from "../store";
import { getCobrowsingState } from "./cobrowsingUtils";
import { getCurrentGameScene } from "./editorUtils";
import Phaser from 'phaser'


export const getGameModelSize = (gameModel) => {
  const width = gameModel.size.nodeSize * gameModel.size.gridWidth
  const height = gameModel.size.nodeSize * gameModel.size.gridHeight
  const aspectRatio = width / height

  return {
    width,
    height,
    aspectRatio
  }
}

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

export function getEntityAandB(entityModelIdA, entityModelIdB) {
  const state = store.getState()
  const gameModel = state.gameModel.gameModel

  let classA = gameModel.entityModels[entityModelIdA] 
  let classB = gameModel.entityModels[entityModelIdB]

  return {
    classA, 
    classB
  }
}

export function getTextureIdForLayerId(arcadeGameMongoId, stageId, layerId) {
   return arcadeGameMongoId+'/' + stageId + '_' + layerId
}

export function isEventMatch({effect, entityModelId, world, entityModel, body}) {
  if(
    (entityModelId === BOUNDARY_DOWN_WALL_ID && body === world.walls.down) ||
    (entityModelId === BOUNDARY_UP_WALL_ID && body === world.walls.up) ||
    (entityModelId === BOUNDARY_LEFT_WALL_ID && body === world.walls.left) ||
    (entityModelId === BOUNDARY_RIGHT_WALL_ID && body === world.walls.right) ||
    (entityModelId === BOUNDARY_WALL_ID && isGameBoundaryWall(world, body))
  ) {
    return true
  }

  if(!entityModel) return false
  
  if(entityModel.entityModelId === entityModelId) {
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

export function getEntityDisplayName(visualTags, entityModelId) {
  return visualTags ? visualTags[0] : entityModelId
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
  if(id.indexOf(ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX) === 0) {
    return true
  }

  if(id.indexOf(PLAYER_INSTANCE_DID) === 0) {
    return true
  }
}

export function isZoneEntityId(id) {
  if(id.indexOf(ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX) === 0) {
    return true
  }
}

export function createGameSceneInstance(key, gameRoomInstance) {
  const { isEdit, isOnlineMultiplayer, isHost } = gameRoomInstance
  if(isEdit) {
    if(isOnlineMultiplayer) {
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