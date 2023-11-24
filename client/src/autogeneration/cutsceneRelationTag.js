import { DERIVED_AUTOGENERATION_IID, DERIVED_DEFAULT_SYSTEM_IID, RELATION_TAG_CUTSCENE_IID } from "../constants/interfaceIds"
import { eventInterfaceData, PLAYER_RELATION_TAG_ID } from "../game/constants"

export function generateCutsceneRelationTag({
  gameData, cutsceneId, eventType,
}) {
  const cutscene = gameData.cutscenes[cutsceneId]

  const eventShortName = eventInterfaceData[eventType].name
  const relationId = cutsceneId + eventType

  gameData.relationTags[relationId] = {
    dataSourceIID: DERIVED_AUTOGENERATION_IID,
    relationTagId: relationId,
    name: 'Play "' + cutscene.name + '"',
    description: `When the ${eventShortName} event occurs`,
    isReadOnly: true,
    icon: 'faScroll',
    relationTagIID: RELATION_TAG_CUTSCENE_IID
  }

  gameData.events[relationId] = {
    eventId: relationId,
    eventType,
    relationTagIdA: PLAYER_RELATION_TAG_ID,
    relationTagIdB: relationId,
    dataSourceIID: DERIVED_AUTOGENERATION_IID,
    isReadOnly: true,
  }

  gameData.relations[relationId] = {
    relationId: relationId,
    eventId: relationId,
    isReadOnly: true,
    effects: {
      [cutsceneId]: {
        effectId: cutsceneId
      }
    },
    effectIds: [cutsceneId],
    dataSourceIID: DERIVED_AUTOGENERATION_IID
  }

  return gameData
}