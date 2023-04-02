import { DATA_SOURCE_CORE_LIBRARY, FOREGROUND_LAYER_ID, POWERUP_ENTITY_IID } from "../core";
import { playerDepthModifier } from "../core";
import { BASIC_ENTITY_IID, DIRECTIONAL_CONTROLS, LAYER_ID_PREFIX, NPC_ENTITY_IID, PLAYER_ENTITY_IID, ZONE_ENTITY_IID } from "../core";
import { MOVEMENT_NONE } from "../entityModelPropertyDefaults";

export const defaultPowerupEntity = { 
  entityInterfaceId: POWERUP_ENTITY_IID,
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
  },
  autogeneration: {
    teleportToEffect: false,
      playerTeleportToRelationTag: false,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    // automaticEntityTag: false,
    spawnOntoStageEffect: false,
    destroyAllEffect: true,
  }
}

export const defaultNpcEntity = { 
  entityInterfaceId: NPC_ENTITY_IID,
  autogeneration: {
    teleportToEffect: false,
      playerTeleportToRelationTag: false,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    destroyAllEffect: true,
    // automaticEntityTag: true,
    spawnOntoStageEffect: true,
  }
  // autogeneration: {

  // }
  // movement: {
  //   movementBehavior: MOVEMENT_TURN_ON_COLLIDE,
  //   velocityX: 50,
  // },
  // collisionResponse: {
  //   bounciness: 0.5,
  // }
}

export const defaultZoneEntity = {
  entityInterfaceId: ZONE_ENTITY_IID, 
  collisionResponse: {
    immovable: true,
  },
  graphics: {
    invisible: true,
    layerId: LAYER_ID_PREFIX+FOREGROUND_LAYER_ID
  },
  autogeneration: {
    teleportToEffect: true,
      playerTeleportToRelationTag: true,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    destroyAllEffect: true,
    // automaticEntityTag: true,
    spawnOntoStageEffect: false,
  }
}

export const defaultPlayerEntity = {
  entityInterfaceId: PLAYER_ENTITY_IID, 
  graphics: {
    depthModifier: playerDepthModifier
  },
  movement: { 
    movementControlsBehavior: DIRECTIONAL_CONTROLS
  },
  collisionResponse: {
    notPushable: false
  },
  autogeneration: {
    teleportToEffect: false,
      playerTeleportToRelationTag: false,
    transformIntoEffect: true,
      playerTransformIntoRelationTag: true,
    destroyAllEffect: true,
    // automaticEntityTag: true,
    spawnOntoStageEffect: false,
  }
}

export const libraryEntityAugment = {
  editorInterface: {
    requiresUnlocking: true
  }
}

export const defaultBasicEntity = { 
  entityInterfaceId: BASIC_ENTITY_IID,
  movement: {
    movementBehavior: MOVEMENT_NONE,
  },
  autogeneration: {
    teleportToEffect: false,
      playerTeleportToRelationTag: false,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    destroyAllEffect: true,
    // automaticEntityTag: true,
    spawnOntoStageEffect: true,
  },
  collisionResponse: {
    notPushable: true,
    mass: 100,
    bounciness: 0,
  }
}

//mapping from class type to default class  
export const defaultEntityByCategory = {
  [BASIC_ENTITY_IID]: defaultBasicEntity,
  [PLAYER_ENTITY_IID]: defaultPlayerEntity,
  [NPC_ENTITY_IID]: defaultNpcEntity,
  [ZONE_ENTITY_IID]: defaultZoneEntity,
  [POWERUP_ENTITY_IID]: defaultPowerupEntity
}