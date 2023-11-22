/////////////////////////////////////
/////////////////////////////////////

import { DATA_SOURCE_GAME_MODEL_IID } from "../../../../constants/interfaceIds";

// WHEN, WHO, WHERE
export const defaultEvent = {
  eventType: '',
  eventId: null,
  relationTagIdA: null,
  relationTagIdB: null,
  cutsceneId: null,

  dataSourceIID: DATA_SOURCE_GAME_MODEL_IID,
  sidesA: [],
  sidesB: [],

  isRemoved: false,
  isReadOnly: false,
  onlyOnce: false,
}
