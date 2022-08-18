import { 
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
