import { BASIC_ENTITY_IID, FOREGROUND_LAYER_GROUP_IID, NPC_ENTITY_IID, PLAYER_ENTITY_IID, POWERUP_ENTITY_IID, PROJECTILE_ENTITY_IID, ZONE_ENTITY_IID } from "../../../../constants/interfaceIds";
import { playerDepthModifier } from "../../core";
import { DIRECTIONAL_CONTROLS } from "../../core";
import { MOVEMENT_NONE } from "../entityModelMember";

// export const defaultPowerupEntity = { 
//   entityIID: POWERUP_ENTITY_IID,
//   graphics: {
//     glowing: true
//   },
//   movement: {
//     movementBehavior: MOVEMENT_NONE,
//   },
//   collisionResponse: {
//     notPushable: true,
//     mass: 100,
//     bounciness: 0,
//   },
//   autogeneration: {
//     teleportToEffect: false,
//       playerTeleportToRelationTag: false,
//     transformIntoEffect: false,
//       playerTransformIntoRelationTag: false,
//     automaticEntityTag: false,
//     spawnOntoStageEffect: false,
//     destroyAllEffect: true,
//   }
// }

export const defaultNpcEntity = { 
  entityIID: NPC_ENTITY_IID,
  autogeneration: {
    teleportToEffect: false,
      playerTeleportToRelationTag: false,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    destroyAllEffect: true,
    automaticEntityTag: true,
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
  entityIID: ZONE_ENTITY_IID, 
  collisionResponse: {
    immovable: true,
  },
  graphics: {
    invisible: true,
    layerGroupIID: FOREGROUND_LAYER_GROUP_IID
  },
  autogeneration: {
    teleportToEffect: true,
      playerTeleportToRelationTag: true,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    destroyAllEffect: true,
    automaticEntityTag: true,
    spawnOntoStageEffect: false,
  }
}

export const defaultPlayerEntity = {
  entityIID: PLAYER_ENTITY_IID, 
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
    automaticEntityTag: true,
    spawnOntoStageEffect: false,
  },
  // spawnZoneEntityModelIds: [initialPlayerSpawnZoneEntityId]
}

export const defaultBasicEntity = { 
  entityIID: BASIC_ENTITY_IID,
  movement: {
    movementBehavior: MOVEMENT_NONE,
  },
  autogeneration: {
    teleportToEffect: false,
      playerTeleportToRelationTag: false,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    destroyAllEffect: true,
    automaticEntityTag: true,
    spawnOntoStageEffect: true,
  },
  collisionResponse: {
    notPushable: true,
    mass: 100,
    bounciness: 0,
  }
}

export const defaultProjectileEntity = {
  entityIID: PROJECTILE_ENTITY_IID,
  graphics: {
    width: 12,
    height: 12,
    layerGroupIID: FOREGROUND_LAYER_GROUP_IID
  },
}

//mapping from class type to default class  
export const defaultEntityByCategory = {
  [BASIC_ENTITY_IID]: defaultBasicEntity,
  [PLAYER_ENTITY_IID]: defaultPlayerEntity,
  [NPC_ENTITY_IID]: defaultNpcEntity,
  [ZONE_ENTITY_IID]: defaultZoneEntity,
  [PROJECTILE_ENTITY_IID]: defaultProjectileEntity,
  // [POWERUP_ENTITY_IID]: defaultPowerupEntity
}