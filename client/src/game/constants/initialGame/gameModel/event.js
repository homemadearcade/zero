/////////////////////////////////////
/////////////////////////////////////

import { NOT_DERIVED_IID } from "../../../../constants/interfaceIds";

// WHEN, WHO, WHERE
export const defaultEvent = {
  eventType: '',
  eventId: null,
  relationTagIdA: null,
  relationTagIdB: null,
  cutsceneId: null,

  dataSourceIID: NOT_DERIVED_IID,
  sidesA: [],
  sidesB: [],

  isRemoved: false,
  isReadOnly: false,
  onlyOnce: false,
}
