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
  OPEN_INTERFACE_TREE,
  CLOSE_INTERFACE_TREE,
  ADD_USER_SPEED_TEST_LOADING,
  ADD_USER_SPEED_TEST_FAIL,
  ADD_USER_SPEED_TEST_SUCCESS,
} from '../types';

const initialState = {
  user: {},
  isLoading: false,
  error: null,
  userIdInterfaceTree: null,
  isTestingInternetSpeed: false
};

export default function userReducer(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_INTERFACE_TREE: 
      return {
        ...state,
        userIdInterfaceTree: payload.userId
      }
    case CLOSE_INTERFACE_TREE: 
      return {
        ...state,
        userIdInterfaceTree: null
      }
    case ADD_USER_SPEED_TEST_LOADING: 
      return {
        ...state,
        isTestingInternetSpeed: true
      }
    case ADD_USER_SPEED_TEST_FAIL: 
      return {
        ...state,
        isTestingInternetSpeed: false
      }
    case ADD_USER_SPEED_TEST_SUCCESS: 
     const newSpeedTests = state.user.speedTests ? state.user.speedTests : []
     newSpeedTests.push(payload.speedTest)
    return {
      ...state,
      user: {
        ...state.user,
        speedTests: newSpeedTests
      },
      isTestingInternetSpeed: false
    }
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
