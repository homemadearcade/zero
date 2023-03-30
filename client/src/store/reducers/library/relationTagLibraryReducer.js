import {
  GET_RELATION_TAG_LIBRARY_LOADING,
  GET_RELATION_TAG_LIBRARY_SUCCESS,
  GET_RELATION_TAG_LIBRARY_FAIL,
  GET_RELATION_TAG_LOADING,
  GET_RELATION_TAG_SUCCESS,
  GET_RELATION_TAG_FAIL,
  ADD_RELATION_TAG_LOADING,
  ADD_RELATION_TAG_SUCCESS,
  ADD_RELATION_TAG_FAIL,
  EDIT_RELATION_TAG_FAIL,
  EDIT_RELATION_TAG_SUCCESS,
  EDIT_RELATION_TAG_LOADING,
  CLEAR_RELATION_TAG,
} from '../../types';

const initialState = {
  relationTagLibrary: [],
  relationTag: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export default function relationTagLibraryReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_RELATION_TAG_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_RELATION_TAG_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_RELATION_TAG_LOADING:
      return {
        ...state,
        relationTagLibrary: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            owner: { ...payload.me },
          },
          ...state.relationTagLibrary,
        ],
      };
    case GET_RELATION_TAG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        relationTag: payload.relationTag,
      };
    case CLEAR_RELATION_TAG: 
      return {
        ...state,
        relationTag: null,
      };
    case GET_RELATION_TAG_LIBRARY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        relationTagLibrary: payload.relationTagLibrary,
      };
    case ADD_RELATION_TAG_SUCCESS:
      return {
        ...state,
        relationTagLibrary: state.relationTagLibrary.map((m) => {
          if (m.id === 0) return payload.relationTag;
          return m;
        }),
      };
    case EDIT_RELATION_TAG_LOADING: 
      return {
        ...state,
        isSaving: true,
      };
    case EDIT_RELATION_TAG_SUCCESS:
      return {
        ...state,
        isSaving: false,
        relationTag: payload.relationTag,
      };
    case EDIT_RELATION_TAG_FAIL:
      return {
        ...state,
        isSaving: false,
        error: payload.error,
      };
    case GET_RELATION_TAG_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_RELATION_TAG_LIBRARY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_RELATION_TAG_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        relationTagLibrary: state.relationTagLibrary.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
