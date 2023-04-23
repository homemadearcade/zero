import { CLOSE_CREATE_CANVAS_IMAGE_DIALOG, SET_GAME_INSTANCE, SET_RECENTLY_FOCUSED, SET_CANVAS_IMAGE_DIALOG_GAME_INSTANCE } from '../types';

const initialState = {
  gameInstance: null,
  imageCanvasGameInstance: null,
  recentlyFocused: null
};

export default function pageReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_GAME_INSTANCE:
      return {
        ...state,
        gameInstance: payload.gameInstance,
      };
    case CLOSE_CREATE_CANVAS_IMAGE_DIALOG: 
      return {
        ...state,
        imageCanvasGameInstance: null
      }
    case SET_CANVAS_IMAGE_DIALOG_GAME_INSTANCE: 
      return {
        ...state,
        imageCanvasGameInstance: payload.gameInstance
      }
    case SET_RECENTLY_FOCUSED: 
      return {
        ...state,
        recentlyFocused: payload.value
      }
    default:
      return state;
  }
}
