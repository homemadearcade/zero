import { advancedDirectionalDefaults, directionalDefaults, groundJumpDefaults, jumpMovementDefaults, noJumpDefaults, swimmerDefaults, vehicleDefaults } from "../initialGame/entityModelBehavior"
import { NOT_DERIVED_IID } from "../../../constants/interfaceIds"
import { mergeDeep } from "../../../utils"
import _ from "lodash"
import { DIRECTIONAL_PLAYER_ENTITY_IVID, JUMPER_PLAYER_ENTITY_IVID, SWIMMER_PLAYER_ENTITY_IVID, VEHICLE_PLAYER_ENTITY_IVID } from "../initialGame/importantValueIds"
import {  defaultPlayerEntity } from "../initialGame/entityModel"

const defaultProps = mergeDeep(
  // _.cloneDeep(defaultEntity),
  _.cloneDeep(defaultPlayerEntity),
)

const vehiclePlayerEntity = {
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

const swimmerPlayerEntity = {
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

const jumperPlayerEntity = {
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

const directionalPlayerEntity = {
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
  },
}

export const starterEntityModels = {
  [VEHICLE_PLAYER_ENTITY_IVID]: vehiclePlayerEntity,
  [SWIMMER_PLAYER_ENTITY_IVID]: swimmerPlayerEntity,
  [JUMPER_PLAYER_ENTITY_IVID]: jumperPlayerEntity,
  [DIRECTIONAL_PLAYER_ENTITY_IVID]: directionalPlayerEntity,
}