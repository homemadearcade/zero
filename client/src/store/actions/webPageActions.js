import { SET_GAME_INSTANCE, SET_SPRITE_EDITOR_GAME_INSTANCE } from '../types';

export const setSpriteEditorGameInstance = (gameInstance) => (dispatch, getState) => {
  dispatch({
    type: SET_SPRITE_EDITOR_GAME_INSTANCE,
    payload: {
      gameInstance
    }
  })
};

export const setGameInstance = (gameInstance) => (dispatch, getState) => {
  dispatch({
    type: SET_GAME_INSTANCE,
    payload: {
      gameInstance
    }
  })
};
