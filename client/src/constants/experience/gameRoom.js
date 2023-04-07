import { defaultParticipantRoleId } from "./constants";

export const GAME_ROOM_DID = 'gr-';

export const defaultGameRoom = {
  copyGame: false,
  arcadeGameMongoId: null,
  gameMetadata: {},
  isAutosaveDisabled: false,
  hostRoleId: defaultParticipantRoleId,
}