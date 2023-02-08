import { generateUniqueId } from '../../utils/webPageUtils';
import { 
  ADD_SNACKBAR, CLEAR_SNACKBAR,
} from '../types';

export const addSnackbar = ({message, imageUrl}) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: ADD_SNACKBAR,
    payload: {
      message,
      imageUrl,
      id: generateUniqueId()
    }
  });
}

export const clearSnackbar = (id) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_SNACKBAR,
    payload: {
      id
    }
  });
}
