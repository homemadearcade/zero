import { defaultParticipantRoleId } from "./constants";

export const GAME_ROOM_DID = 'gr-';

export const defaultGameRoom = {
  doNotCopy: false,
  arcadeGameMongoId: null,
  isAutosaveDisabled: false,
  hostRoleId: defaultParticipantRoleId,
}