import { defaultParticipantRoleId } from "./constants";

export const GAME_ROOM_DID = 'gr-';

export const defaultGameRoom = {
  copyGame: false,
  arcadeGameMongoId: null,
  isAutosaveDisabled: false,
  hostRoleId: defaultParticipantRoleId,
}