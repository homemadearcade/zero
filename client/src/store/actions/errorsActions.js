import { 
  CHANGE_ERROR_STATE,
  CLEAR_ERROR
} from '../types';

export const clearError = (index) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_ERROR,
    payload: {
      index
    }
  });
}

export const changeErrorState  = (errorState, errorStateMessage) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_ERROR_STATE,
    payload: {
      errorState,
      errorStateMessage
    }
  })
};