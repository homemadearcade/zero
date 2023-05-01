import { 
  GET_APP_SETTINGS_LOADING,
  GET_APP_SETTINGS_SUCCESS,
  GET_APP_SETTINGS_FAIL,
  EDIT_APP_SETTINGS_LOADING,
  EDIT_APP_SETTINGS_SUCCESS,
  EDIT_APP_SETTINGS_FAIL,
} from '../types';

const initialState = {
  appSettings: {},
};

export default function appSettingsReducer(state = initialState, { type, payload }) {
  switch (type) {
 case GET_APP_SETTINGS_LOADING:
    case EDIT_APP_SETTINGS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case GET_APP_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        appSettings: payload.appSettings,
      };
    case EDIT_APP_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        appSettings: payload.appSettings,
      };
    case GET_APP_SETTINGS_FAIL:
    case EDIT_APP_SETTINGS_FAIL:
      return {
        ...state,
        isLoading: false,
        appSettings: {},
        error: payload.error,
      };
    default:
      return state;
  }
}
