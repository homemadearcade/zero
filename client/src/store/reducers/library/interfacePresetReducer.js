import {
  GET_INTERFACE_PRESETS_LOADING,
  GET_INTERFACE_PRESETS_SUCCESS,
  GET_INTERFACE_PRESETS_FAIL,
  GET_INTERFACE_PRESET_LOADING,
  GET_INTERFACE_PRESET_SUCCESS,
  GET_INTERFACE_PRESET_FAIL,
  DELETE_INTERFACE_PRESET_LOADING,
  DELETE_INTERFACE_PRESET_SUCCESS,
  DELETE_INTERFACE_PRESET_FAIL,
  ADD_INTERFACE_PRESET_LOADING,
  ADD_INTERFACE_PRESET_SUCCESS,
  ADD_INTERFACE_PRESET_FAIL,
  EDIT_INTERFACE_PRESET_FAIL,
  EDIT_INTERFACE_PRESET_SUCCESS,
} from '../../types';

const initialState = {
  interfacePresets: [],
  interfacePreset: null,
  ticketPurchases: null,
  isLoading: false,
  error: null,
};

export default function interfacePresetReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_INTERFACE_PRESET_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_INTERFACE_PRESETS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_INTERFACE_PRESET_LOADING:
      return {
        ...state,
        interfacePresets: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: { ...payload.me },
          },
          ...state.interfacePresets,
        ],
      };
    case GET_INTERFACE_PRESET_SUCCESS:
      return {
        ...state,
        isLoading: false,
        interfacePreset: payload.interfacePreset,
      };
    case GET_INTERFACE_PRESETS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        interfacePresets: payload.interfacePresets,
      };
    case ADD_INTERFACE_PRESET_SUCCESS:
      return {
        ...state,
        interfacePresets: state.interfacePresets.map((m) => {
          if (m.id === 0) return payload.interfacePreset;
          return m;
        }),
      };
    case EDIT_INTERFACE_PRESET_SUCCESS:
      return {
        ...state,
        interfacePreset: payload.interfacePreset,
      };
    case EDIT_INTERFACE_PRESET_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case GET_INTERFACE_PRESET_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_INTERFACE_PRESETS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_INTERFACE_PRESET_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        interfacePresets: state.interfacePresets.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
