import { GAME_BOUNDARY_DOWN_WALL_ID, GAME_BOUNDARY_LEFT_WALL_ID, GAME_BOUNDARY_RIGHT_WALL_ID, GAME_BOUNDARY_UP_WALL_ID, GAME_BOUNDARY_WALL_ID, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from "../constants";

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

export function areBSidesHit(sides, a, b) {
  return sides.some((side) => {
    if(side === SIDE_UP) {
      if (b.body.touching.down && a.body.touching.up) {
        return true
      }
    } else if(side === SIDE_DOWN) {
      if (b.body.touching.up && a.body.touching.down) {
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
}

export function getClassDisplayName(objectClass, classId) {
  return objectClass.name || objectClass.descriptors ? objectClass.descriptors[0] : classId
}