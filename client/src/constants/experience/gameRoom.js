import { defaultParticipantRoleId } from "./experienceModel";

export const GAME_ROOM_ID_PREFIX = 'gr-';

export const defaultGameRoom = {
  copyGame: false,
  arcadeGameMongoId: null,
  gameMetadata: {},
  isAutosaveDisabled: false,
  hostRoleId: defaultParticipantRoleId,
}