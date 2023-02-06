import { CLOSE_SPRITE_EDITOR, SET_GAME_INSTANCE, SET_SPRITE_EDITOR_GAME_INSTANCE } from '../types';

const initialState = {
  gameInstance: null,
  gameInstanceId: null,
  spriteEditorGameInstance: null,
};

export default function pageReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_GAME_INSTANCE:
      return {
        ...state,
        gameInstance: payload.gameInstance,
        gameInstanceId: payload.gameInstanceId
      };
    case CLOSE_SPRITE_EDITOR: 
      return {
        ...state,
        spriteEditorGameInstance: null
      }
    case SET_SPRITE_EDITOR_GAME_INSTANCE: 
      return {
        ...state,
        spriteEditorGameInstance: payload.gameInstance
      }
    default:
      return state;
  }
}
