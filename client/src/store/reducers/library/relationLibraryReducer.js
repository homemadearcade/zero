import {
  GET_RELATION_LIBRARY_LOADING,
  GET_RELATION_LIBRARY_SUCCESS,
  GET_RELATION_LIBRARY_FAIL,
  GET_RELATION_LOADING,
  GET_RELATION_SUCCESS,
  GET_RELATION_FAIL,
  ADD_RELATION_LOADING,
  ADD_RELATION_SUCCESS,
  ADD_RELATION_FAIL,
  EDIT_RELATION_FAIL,
  EDIT_RELATION_SUCCESS,
  EDIT_RELATION_LOADING,
  CLEAR_RELATION,
} from '../../types';

const initialState = {
  relationLibrary: [],
  relation: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export default function relationLibraryReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_RELATION_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_RELATION_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_RELATION_LOADING:
      return {
        ...state,
        relationLibrary: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            owner: { ...payload.me },
          },
          ...state.relationLibrary,
        ],
      };
    case GET_RELATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        relation: payload.relation,
      };
    case CLEAR_RELATION: 
      return {
        ...state,
        relation: null,
      };
    case GET_RELATION_LIBRARY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        relationLibrary: payload.relationLibrary,
      };
    case ADD_RELATION_SUCCESS:
      return {
        ...state,
        relationLibrary: state.relationLibrary.map((m) => {
          if (m.id === 0) return payload.relation;
          return m;
        }),
      };
    case EDIT_RELATION_LOADING: 
      return {
        ...state,
        isSaving: true,
      };
    case EDIT_RELATION_SUCCESS:
      return {
        ...state,
        isSaving: false,
        relation: payload.relation,
      };
    case EDIT_RELATION_FAIL:
      return {
        ...state,
        isSaving: false,
        error: payload.error,
      };
    case GET_RELATION_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_RELATION_LIBRARY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_RELATION_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        relationLibrary: state.relationLibrary.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
