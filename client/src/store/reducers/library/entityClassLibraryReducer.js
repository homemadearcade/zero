import {
  GET_ENTITY_CLASS_LIBRARY_LOADING,
  GET_ENTITY_CLASS_LIBRARY_SUCCESS,
  GET_ENTITY_CLASS_LIBRARY_FAIL,
  GET_ENTITY_CLASS_LOADING,
  GET_ENTITY_CLASS_SUCCESS,
  GET_ENTITY_CLASS_FAIL,
  ADD_ENTITY_CLASS_LOADING,
  ADD_ENTITY_CLASS_SUCCESS,
  ADD_ENTITY_CLASS_FAIL,
  EDIT_ENTITY_CLASS_FAIL,
  EDIT_ENTITY_CLASS_SUCCESS,
  EDIT_ENTITY_CLASS_LOADING,
  CLEAR_ENTITY_CLASS,
} from '../../types';

const initialState = {
  entityClassLibrary: [],
  entityClass: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export default function entityClassLibraryReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_ENTITY_CLASS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_ENTITY_CLASS_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_ENTITY_CLASS_LOADING:
      return {
        ...state,
        entityClassLibrary: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            owner: { ...payload.me },
          },
          ...state.entityClassLibrary,
        ],
      };
    case GET_ENTITY_CLASS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        entityClass: payload.entityClass,
      };
    case CLEAR_ENTITY_CLASS: 
      return {
        ...state,
        entityClass: null,
      };
    case GET_ENTITY_CLASS_LIBRARY_SUCCESS:
      console.log(payload)
      return {
        ...state,
        isLoading: false,
        entityClassLibrary: payload.entityClassLibrary,
      };
    case ADD_ENTITY_CLASS_SUCCESS:
      return {
        ...state,
        entityClassLibrary: state.entityClassLibrary.map((m) => {
          if (m.id === 0) return payload.entityClass;
          return m;
        }),
      };
    case EDIT_ENTITY_CLASS_LOADING: 
      return {
        ...state,
        isSaving: true,
      };
    case EDIT_ENTITY_CLASS_SUCCESS:
      return {
        ...state,
        isSaving: false,
        entityClass: payload.entityClass,
      };
    case EDIT_ENTITY_CLASS_FAIL:
      return {
        ...state,
        isSaving: false,
        error: payload.error,
      };
    case GET_ENTITY_CLASS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_ENTITY_CLASS_LIBRARY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_ENTITY_CLASS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        entityClassLibrary: state.entityClassLibrary.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
