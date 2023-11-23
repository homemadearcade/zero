import { mergeDeep } from "../../../../utils/utils"
import _ from "lodash"
// import { defaultEntity } from "./entityModel"
import { defaultPlayerEntity } from "../entityModel/entityClass"
import { advancedDirectionalDefaults, directionalDefaults, groundJumpDefaults, jumpMovementDefaults, noJumpDefaults, swimmerDefaults, vehicleDefaults } from "../entityModelBehavior"
import { NOT_DERIVED_IID } from "../../../../constants/interfaceIds"
import { DIRECTIONAL_PLAYER_ENTITY_IVID, JUMPER_PLAYER_ENTITY_IVID, SWIMMER_PLAYER_ENTITY_IVID, VEHICLE_PLAYER_ENTITY_IVID } from "../importantValueIds"

export function createInitialPlayerEntities(importantValues) {

  const vehiclePlayerEntityId = importantValues[VEHICLE_PLAYER_ENTITY_IVID].value

  const jumperPlayerEntityId = importantValues[JUMPER_PLAYER_ENTITY_IVID].value

  const directionalPlayerEntityId = importantValues[DIRECTIONAL_PLAYER_ENTITY_IVID].value

  const swimmerPlayerEntityId = importantValues[SWIMMER_PLAYER_ENTITY_IVID].value

  const defaultProps = mergeDeep(
    // _.cloneDeep(defaultEntity),
    _.cloneDeep(defaultPlayerEntity),
  )

  const vehicleEntity = {
    ...defaultProps,
    dataSourceIID: NOT_DERIVED_IID,
    name: 'Vehicle',
    graphics: {
      textureTint: '#FFFFFF',
      // "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
    },
    "movement": {
      ...vehicleDefaults.movement
    },
    'jump': {
      ...vehicleDefaults.jump
    }
  }

  const swimmerEntity = {
    ...defaultProps,
    dataSourceIID: NOT_DERIVED_IID,
    name: 'Swimmer',
    graphics: {
      textureTint: '#FFFFFF',
      // "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
    },
    "movement": {
      ...swimmerDefaults.movement,
    },
    'jump': {
      ...swimmerDefaults.jump,
    }
  }

  const jumperEntity = {
    ...defaultProps,
    dataSourceIID: NOT_DERIVED_IID,
    name: 'Jumper',
    graphics: {
      textureTint: '#FFFFFF',

      // "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
    },
    movement: {
      ...advancedDirectionalDefaults.movement,
      ...jumpMovementDefaults.movement
    },
    'jump': {
      ...advancedDirectionalDefaults.jump,
      ...groundJumpDefaults.jump
    }
  }

  const directionalEntity = {
    ...defaultProps,
    dataSourceIID: NOT_DERIVED_IID,
    name: 'Directional',
    graphics: {
      textureTint: '#FFFFFF',
      // "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite2",
    },
    movement: {
      ...directionalDefaults.movement
    },
    'jump': {
      ...noJumpDefaults
    }
  }

  return {
    'vehicleEntity': {
      ...vehicleEntity,
      entityModelId: vehiclePlayerEntityId
    },
    'swimmerEntity': {
      ...swimmerEntity,
      entityModelId: swimmerPlayerEntityId
    },
    'jumperEntity': {
      ...jumperEntity,
      entityModelId: jumperPlayerEntityId
    },
    'directionalEntity': {
      ...directionalEntity,
      entityModelId: directionalPlayerEntityId
    },
  }

}


// export const carEntity = {
//   ...defaultProps,
//   entityModelId: 'car',
//   name: 'car',
//   graphics: {
//     "textureId": "kenney-roguelike-environment-16px-sprite1112",
//   },
//   "movement": {
//     ...carDefaults.movement
//   },
//   "jump": {
//     ...carDefaults.jump
//   },
// }

// export const floaterEntity = {
//   ...defaultProps,
//   entityModelId: 'floater',
//   name: 'floater',
//   graphics: {
//     "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite206",
//   },
//   "movement": {
//     ...comboJumpDefaults.movement
//   },
//   "jump": {
//     ...comboJumpDefaults.jump
//   },
// }