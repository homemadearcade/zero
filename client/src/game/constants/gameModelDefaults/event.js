/////////////////////////////////////
/////////////////////////////////////
import { DATA_SOURCE_GAME_MODEL } from "../core";

// WHEN, WHO, WHERE
export const defaultEvent = {
  eventType: '',
  eventId: null,
  relationTagIdA: null,
  relationTagIdB: null,
  dataSource: DATA_SOURCE_GAME_MODEL,
  sidesA: [],
  sidesB: [],

  onlyOnce: false,
}
