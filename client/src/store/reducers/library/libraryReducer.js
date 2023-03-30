import {
  GET_LIBRARY_LOADING,
  GET_LIBRARY_SUCCESS,
  GET_LIBRARY_FAIL,
} from '../../types';

const initialState = {
  isLoading: false,
  error: null,
};

export default function interfacePresetReducer(state = initialState, { type, payload }) {   
  switch (type) {
  case GET_LIBRARY_LOADING:
    return {
      ...state,
      isLoading: true,
    };
  case GET_LIBRARY_FAIL:
    return {
      ...state,
      error: payload.error,
      isLoading: true,
    };
  case GET_LIBRARY_SUCCESS:
    return {
      ...state,
      isLoading: false,
    };
  default:
    return state;
  }
}