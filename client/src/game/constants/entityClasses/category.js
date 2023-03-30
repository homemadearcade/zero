import { FOREGROUND_LAYER_ID } from "../core";
import { playerDepthModifier } from "../core";
import { BASIC_CLASS, DIRECTIONAL_CONTROLS, LAYER_ID_PREFIX, NPC_CLASS, PLAYER_CLASS, ZONE_CLASS } from "../core";
import { MOVEMENT_NONE } from "../entityClassProperties";

export const defaultPowerupClass = { 
  classInterfaceCategory: BASIC_CLASS,
  graphics: {
    glowing: true
  },
  movement: {
    movementBehavior: MOVEMENT_NONE,
  },
  collisionResponse: {
    notPushable: true,
    mass: 100,
    bounciness: 0,
  }
}

export const defaultNpcClass = { 
  classInterfaceCategory: NPC_CLASS,
  // movement: {
  //   movementBehavior: MOVEMENT_TURN_ON_COLLIDE,
  //   velocityX: 50,
  // },
  // collisionResponse: {
  //   bounciness: 0.5,
  // }
}

export const defaultZoneClass = {
  classInterfaceCategory: ZONE_CLASS, 
  collisionResponse: {
    immovable: true,
  },
  graphics: {
    invisible: true,
    layerId: LAYER_ID_PREFIX+FOREGROUND_LAYER_ID
  },
  editorInterface: {
    noTransformEffect: true,
  }
}

export const defaultPlayerClass = {
  classInterfaceCategory: PLAYER_CLASS, 
  graphics: {
    depthModifier: playerDepthModifier
  },
  movement: { 
    movementControlsBehavior: DIRECTIONAL_CONTROLS
  },
  collisionResponse: {
    notPushable: false
  }
}

export const libraryClassAugment = {
  editorInterface: {
    isSelectorObscured: true
  }
}

export const defaultBasicClass = { 
  classInterfaceCategory: BASIC_CLASS,
  movement: {
    movementBehavior: MOVEMENT_NONE,
  },
  collisionResponse: {
    notPushable: true,
    mass: 100,
    bounciness: 0,
  }
}