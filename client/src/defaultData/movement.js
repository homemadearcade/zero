import { MOVEMENT_DOWN_TO_UP, MOVEMENT_LEFT_TO_RIGHT, MOVEMENT_RIGHT_TO_LEFT, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_UP_TO_DOWN, WORLD_COLLIDE } from "../constants"

export const leftToRight = {
  // worldBoundaryRelationship: WORLD_COLLIDE,
  movement: {
    pattern: MOVEMENT_LEFT_TO_RIGHT,
    initialVelocityX: 50,
    initialVelocityY: 0,
    dragX: 1,
    dragY: 1,
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const rightToLeft = {
  // worldBoundaryRelationship: WORLD_COLLIDE,
  movement: {
    pattern: MOVEMENT_RIGHT_TO_LEFT,
    initialVelocityX: -50,
    initialVelocityY: 0,
    dragX: 1,
    dragY: 1,
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const upToDown = {
  // worldBoundaryRelationship: WORLD_COLLIDE,
  movement: {
    pattern: MOVEMENT_UP_TO_DOWN,
    initialVelocityX: 0,
    initialVelocityY: -50,
    dragX: 1,
    dragY: 1,
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const downToUp = {
  // worldBoundaryRelationship: WORLD_COLLIDE,
  movement: {
    pattern: MOVEMENT_DOWN_TO_UP,
    initialVelocityX: 0,
    initialVelocityY: 50,
    dragX: 1,
    dragY: 1,
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const turnOnCollide = {
  // worldBoundaryRelationship: WORLD_COLLIDE,
  movement: {
    pattern: MOVEMENT_TURN_ON_COLLIDE,
    initialVelocityX: 50,
  },
}