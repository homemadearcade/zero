import { SET_GAME_INSTANCE, SET_RECENTLY_FOCUSED, SET_SPRITE_EDITOR_GAME_INSTANCE } from '../types';

export const setSpriteEditorGameInstance = (gameInstance) => (dispatch, getState) => {
  dispatch({
    type: SET_SPRITE_EDITOR_GAME_INSTANCE,
    payload: {
      gameInstance
    }
  })
};

export const setGameInstance = (gameInstance, id) => (dispatch, getState) => {
  dispatch({
    type: SET_GAME_INSTANCE,
    payload: {
      gameInstance,
      gameInstanceId: id
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
