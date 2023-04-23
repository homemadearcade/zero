import { SET_GAME_INSTANCE, SET_RECENTLY_FOCUSED, SET_CANVAS_IMAGE_DIALOG_GAME_INSTANCE } from '../types';

export const setCanvasImageDialogGameInstance = (gameInstance) => (dispatch, getState) => {
  dispatch({
    type: SET_CANVAS_IMAGE_DIALOG_GAME_INSTANCE,
    payload: {
      gameInstance
    }
  })
};

export const setGameInstance = (gameInstance) => (dispatch, getState) => {
  dispatch({
    type: SET_GAME_INSTANCE,
    payload: {
      gameInstance,
    }
  })
};

export const setRecentlyFocused = (value) => (dispatch, getState) => {
  dispatch({
    type: SET_RECENTLY_FOCUSED,
    payload: {
      value
    }
  });
}
