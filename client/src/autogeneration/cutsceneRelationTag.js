import { DERIVED_DEFAULT_SYSTEM_IID, RELATION_TAG_CUTSCENE_IID } from "../constants/interfaceIds"
import { eventShortNames, PLAYER_RELATION_TAG_ID } from "../game/constants"

export function generateCutsceneRelationTag({
  gameData, cutsceneId, eventType,
}) {
  const cutscene = gameData.cutscenes[cutsceneId]

  const eventShortName = eventShortNames[eventType]
  const relationId = cutsceneId + eventType

  gameData.relationTags[relationId] = {
    dataSourceIID: DERIVED_DEFAULT_SYSTEM_IID,
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
    dataSourceIID: DERIVED_DEFAULT_SYSTEM_IID,
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
    dataSourceIID: DERIVED_DEFAULT_SYSTEM_IID
  }

  return gameData
}