import { 
  ADD_LOBBY_LOADING,
  ADD_LOBBY_SUCCESS,
  ADD_LOBBY_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
  GET_LOBBYS_LOADING, 
  GET_LOBBYS_SUCCESS, 
  GET_LOBBYS_FAIL } from '../../types';

const initialState = {
  lobbyInstances: [],
  isLoading: false,
  error: null,
};

export default function lobbyInstancesReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_LOBBYS_LOADING:
    case ADD_LOBBY_LOADING:
    case DELETE_LOBBY_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case GET_LOBBYS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobbyInstances: payload.lobbyInstances,
      };
    case ADD_LOBBY_SUCCESS:
    case DELETE_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case GET_LOBBYS_FAIL:
    case ADD_LOBBY_FAIL:
    case DELETE_LOBBY_FAIL:
      return {
        ...state,
        isLoading: false,
        lobbyInstances: [],
        error: payload,
      };
    default:
      return state;
  }
}
