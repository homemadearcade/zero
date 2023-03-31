import {
  GET_ENTITY_MODEL_LIBRARY_LOADING,
  GET_ENTITY_MODEL_LIBRARY_SUCCESS,
  GET_ENTITY_MODEL_LIBRARY_FAIL,
  GET_ENTITY_MODEL_LOADING,
  GET_ENTITY_MODEL_SUCCESS,
  GET_ENTITY_MODEL_FAIL,
  ADD_ENTITY_MODEL_LOADING,
  ADD_ENTITY_MODEL_SUCCESS,
  ADD_ENTITY_MODEL_FAIL,
  EDIT_ENTITY_MODEL_FAIL,
  EDIT_ENTITY_MODEL_SUCCESS,
  EDIT_ENTITY_MODEL_LOADING,
  CLEAR_ENTITY_MODEL,
} from '../../types';

const initialState = {
  entityModelLibrary: [],
  entityModel: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export default function entityModelLibraryReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_ENTITY_MODEL_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_ENTITY_MODEL_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_ENTITY_MODEL_LOADING:
      return {
        ...state,
        entityModelLibrary: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            owner: { ...payload.me },
          },
          ...state.entityModelLibrary,
        ],
      };
    case GET_ENTITY_MODEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        entityModel: payload.entityModel,
      };
    case CLEAR_ENTITY_MODEL: 
      return {
        ...state,
        entityModel: null,
      };
    case GET_ENTITY_MODEL_LIBRARY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        entityModelLibrary: payload.entityModelLibrary,
      };
    case ADD_ENTITY_MODEL_SUCCESS:
      return {
        ...state,
        entityModelLibrary: state.entityModelLibrary.map((m) => {
          if (m.id === 0) return payload.entityModel;
          return m;
        }),
      };
    case EDIT_ENTITY_MODEL_LOADING: 
      return {
        ...state,
        isSaving: true,
      };
    case EDIT_ENTITY_MODEL_SUCCESS:
      return {
        ...state,
        isSaving: false,
        entityModel: payload.entityModel,
      };
    case EDIT_ENTITY_MODEL_FAIL:
      return {
        ...state,
        isSaving: false,
        error: payload.error,
      };
    case GET_ENTITY_MODEL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_ENTITY_MODEL_LIBRARY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_ENTITY_MODEL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        entityModelLibrary: state.entityModelLibrary.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
