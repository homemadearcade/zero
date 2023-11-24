import _ from "lodash";
import { STARTER_PACK_GENERAL_IID, 
 } from "../../../constants/interfaceIds";
import { DIRECTIONAL_PLAYER_ENTITY_RID, JUMPER_PLAYER_ENTITY_RID, SWIMMER_PLAYER_ENTITY_RID, VEHICLE_PLAYER_ENTITY_RID } from "../initialGame";
import { starterEntityModels } from "./entityModel";

export const starterPackIIDToDisplayName = {
  [STARTER_PACK_GENERAL_IID]: 'General'
}

export const gamePacks = {
  [STARTER_PACK_GENERAL_IID]: {
    entityModels: [
      SWIMMER_PLAYER_ENTITY_RID,
      VEHICLE_PLAYER_ENTITY_RID,
      DIRECTIONAL_PLAYER_ENTITY_RID,
      JUMPER_PLAYER_ENTITY_RID
    ],
    stageClasses: {
      STAGE_DEFAULT_OVERHEAD_IID: true,
      STAGE_DEFAULT_UNDERWATER_IID: true,
      STAGE_DEFAULT_SPACE_IID: true,
      STAGE_DEFAULT_PLATFORMER_IID: true
    }
  }
}

export function loadStarterPack(starterPackIID) {
  const gamePack = gamePacks[starterPackIID]

  const entityModels = gamePack.entityModels.reduce((prev, entityModelId) => {
    prev[entityModelId] = _.cloneDeep(starterEntityModels[entityModelId])
    prev[entityModelId].entityModelId = entityModelId
    return prev
  }, {})

  const stageClasses = gamePack.stageClasses

  return {
    entityModels,
    stageClasses
  }

}