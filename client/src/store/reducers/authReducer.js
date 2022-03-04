import {
  // LOGIN_WITH_OAUTH_LOADING,
  // LOGIN_WITH_OAUTH_SUCCESS,
  // LOGIN_WITH_OAUTH_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_EMAIL_SUCCESS,
  LOGIN_WITH_EMAIL_FAIL,
  AUTHENTICATE_SOCKET_LOADING,
  AUTHENTICATE_SOCKET_SUCCESS,
  AUTHENTICATE_SOCKET_FAIL,
  ME_LOADING,
  ME_SUCCESS,
  ME_FAIL,
} from '../types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isSocketAuthenticated: false,
  isLoading: false,
  me: null,
  error: null,
  appLoaded: false,
};

export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ME_LOADING:
      return {
        ...state,
        isLoading: true,
        // appLoaded: false,
        error: null,
      };
    case LOGIN_WITH_EMAIL_LOADING:
    case AUTHENTICATE_SOCKET_LOADING:
    // case LOGIN_WITH_OAUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_WITH_EMAIL_SUCCESS:
    // case LOGIN_WITH_OAUTH_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: payload.token,
        me: payload.me,
        error: null,
      };
    case AUTHENTICATE_SOCKET_SUCCESS:
      return {
        ...state,
        appLoaded: true,
        isSocketAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case ME_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        me: payload.me,
        error: null,
      };
    case ME_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        me: null,
        error: null,
        appLoaded: true,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        me: null,
        isAuthenticated: false,
        isLoading: false,
        error: false
      };
    case LOGIN_WITH_EMAIL_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        me: null,
        isAuthenticated: false,
        isLoading: false,
        error: payload.error
      };
    case AUTHENTICATE_SOCKET_FAIL:
      return {
        ...state,
        isSocketAuthenticated: false,
        isLoading: false,
        error: payload.error
      };
    default:
      return state;
  }
}
