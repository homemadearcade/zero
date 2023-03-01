import { UPDATE_THEME } from '../types';

export const updateTheme = (theme) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_THEME,
    payload: theme
  })
};
