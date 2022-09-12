import { GAME_BOUNDARY_DOWN_WALL_ID, GAME_BOUNDARY_LEFT_WALL_ID, GAME_BOUNDARY_RIGHT_WALL_ID, GAME_BOUNDARY_UP_WALL_ID, GAME_BOUNDARY_WALL_ID } from "../constants";

export function isGameBoundaryWall(world, body) {
  if(body === world.walls.left || body === world.walls.right || body === world.walls.up || body === world.walls.down) {
    return true
  }

  return false
}

export function isEventMatch({effect, classId, world, gameObject, body}) {
  if(
    (classId === GAME_BOUNDARY_DOWN_WALL_ID && body === world.walls.down) ||
    (classId === GAME_BOUNDARY_UP_WALL_ID && body === world.walls.up) ||
    (classId === GAME_BOUNDARY_LEFT_WALL_ID && body === world.walls.left) ||
    (classId === GAME_BOUNDARY_RIGHT_WALL_ID && body === world.walls.right) ||
    (classId === GAME_BOUNDARY_WALL_ID && isGameBoundaryWall(world, body))
  ) {
    return true
  }

  if(!gameObject) return false
  
  if(gameObject.classId === classId) {
    return true
  }

  return false
}

export function getClassDisplayName(objectClass, classId) {
  return objectClass.name || objectClass.descriptors ? objectClass.descriptors[0] : classId
}