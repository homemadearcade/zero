import { GET_LOBBYS_LOADING, GET_LOBBYS_SUCCESS, GET_LOBBYS_FAIL } from '../types';

const initialState = {
  lobbys: [],
  isLoading: false,
  error: null,
};

export default function lobbysReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_LOBBYS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case GET_LOBBYS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobbys: payload.lobbys,
      };
    case GET_LOBBYS_FAIL:
      return {
        ...state,
        isLoading: false,
        lobbys: [],
        error: payload,
      };
    default:
      return state;
  }
}
