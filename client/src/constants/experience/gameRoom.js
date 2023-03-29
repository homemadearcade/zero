import { defaultParticipantRoleId } from "./experienceModel";

export const GAME_ROOM_ID_PREFIX = 'gr-';

export const defaultGameRoom = {
  copyGame: false,
  gameId: null,
  gameMetadata: {},
  isAutosaveDisabled: false,
  hostRoleId: defaultParticipantRoleId,
}