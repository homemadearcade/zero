import {
  GET_EFFECT_LIBRARY_LOADING,
  GET_EFFECT_LIBRARY_SUCCESS,
  GET_EFFECT_LIBRARY_FAIL,
  GET_EFFECT_LOADING,
  GET_EFFECT_SUCCESS,
  GET_EFFECT_FAIL,
  ADD_EFFECT_LOADING,
  ADD_EFFECT_SUCCESS,
  ADD_EFFECT_FAIL,
  EDIT_EFFECT_FAIL,
  EDIT_EFFECT_SUCCESS,
  EDIT_EFFECT_LOADING,
  CLEAR_EFFECT,
} from '../../types';

const initialState = {
  effectLibrary: [],
  effect: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export default function effectLibraryReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_EFFECT_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EFFECT_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_EFFECT_LOADING:
      return {
        ...state,
        effectLibrary: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            owner: { ...payload.me },
          },
          ...state.effectLibrary,
        ],
      };
    case GET_EFFECT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        effect: payload.effect,
      };
    case CLEAR_EFFECT: 
      return {
        ...state,
        effect: null,
      };
    case GET_EFFECT_LIBRARY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        effectLibrary: payload.effectLibrary,
      };
    case ADD_EFFECT_SUCCESS:
      return {
        ...state,
        effectLibrary: state.effectLibrary.map((m) => {
          if (m.id === 0) return payload.effect;
          return m;
        }),
      };
    case EDIT_EFFECT_LOADING: 
      return {
        ...state,
        isSaving: true,
      };
    case EDIT_EFFECT_SUCCESS:
      return {
        ...state,
        isSaving: false,
        effect: payload.effect,
      };
    case EDIT_EFFECT_FAIL:
      return {
        ...state,
        isSaving: false,
        error: payload.error,
      };
    case GET_EFFECT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_EFFECT_LIBRARY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_EFFECT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        effectLibrary: state.effectLibrary.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
