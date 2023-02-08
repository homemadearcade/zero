import { generateUniqueId } from '../../utils/webPageUtils';
import { ADD_SNACKBAR, CLEAR_SNACKBAR } from '../types';

const initialState = {
  snackbars: [],
}

export const initialSnackbarState = initialState

export default function errorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ADD_SNACKBAR:
      return {
        ...state,
        snackbars: 
        [...state.snackbars, payload]
      }
    case CLEAR_SNACKBAR:
      return {
        ...state,
        snackbars: state.snackbars.filter(({id}) => {
          if (id === payload.id) return false;
          return true
        })
      }
    default:
      return state;
  }
}
