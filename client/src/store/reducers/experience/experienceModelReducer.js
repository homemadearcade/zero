import {
  GET_EXPERIENCE_MODELS_LOADING,
  GET_EXPERIENCE_MODELS_SUCCESS,
  GET_EXPERIENCE_MODELS_FAIL,
  GET_EXPERIENCE_MODEL_LOADING,
  GET_EXPERIENCE_MODEL_SUCCESS,
  GET_EXPERIENCE_MODEL_FAIL,
  ADD_EXPERIENCE_MODEL_LOADING,
  ADD_EXPERIENCE_MODEL_SUCCESS,
  ADD_EXPERIENCE_MODEL_FAIL,
  EDIT_EXPERIENCE_MODEL_FAIL,
  EDIT_EXPERIENCE_MODEL_SUCCESS,
  EDIT_EXPERIENCE_MODEL_LOADING,
  CLEAR_EXPERIENCE_MODEL,
} from '../../types';

const initialState = {
  experienceModels: [],
  experienceModel: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export default function experienceModelReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_EXPERIENCE_MODEL_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EXPERIENCE_MODELS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_EXPERIENCE_MODEL_LOADING:
      return {
        ...state,
        experienceModels: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
          },
          ...state.experienceModels,
        ],
      };
    case GET_EXPERIENCE_MODEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        experienceModel: payload.experienceModel,
      };
    case CLEAR_EXPERIENCE_MODEL: 
      return {
        ...state,
        experienceModel: null,
      };
    case GET_EXPERIENCE_MODELS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        experienceModels: payload.experienceModels,
      };
    case ADD_EXPERIENCE_MODEL_SUCCESS:
      return {
        ...state,
        experienceModels: state.experienceModels.map((m) => {
          if (m.id === 0) return payload.experienceModel;
          return m;
        }),
      };
    case EDIT_EXPERIENCE_MODEL_LOADING: 
      return {
        ...state,
        isSaving: true,
      };
    case EDIT_EXPERIENCE_MODEL_SUCCESS:
      return {
        ...state,
        isSaving: false,
        experienceModel: payload.experienceModel,
      };
    case EDIT_EXPERIENCE_MODEL_FAIL:
      return {
        ...state,
        isSaving: false,
        error: payload.error,
      };
    case GET_EXPERIENCE_MODEL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_EXPERIENCE_MODELS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_EXPERIENCE_MODEL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        experienceModels: state.experienceModels.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
