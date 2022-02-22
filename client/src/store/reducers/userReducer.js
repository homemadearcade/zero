import {
  GET_USER_LOADING,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  EDIT_USER_LOADING,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAIL,
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
} from '../types';

const initialState = {
  user: {},
  isLoading: false,
  error: null,
};

export default function userReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_USER_LOADING:
    case EDIT_USER_LOADING:
    case DELETE_USER_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: payload.user,
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: payload.user,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: {},
      };
    case GET_USER_FAIL:
    case EDIT_USER_FAIL:
    case DELETE_USER_FAIL:
      return {
        ...state,
        isLoading: false,
        user: {},
        error: payload.error,
      };
    default:
      return state;
  }
}
