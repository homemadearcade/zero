import {
  GET_EXPERIENCES_LOADING,
  GET_EXPERIENCES_SUCCESS,
  GET_EXPERIENCES_FAIL,
  GET_EXPERIENCE_LOADING,
  GET_EXPERIENCE_SUCCESS,
  GET_EXPERIENCE_FAIL,
  DELETE_EXPERIENCE_LOADING,
  DELETE_EXPERIENCE_SUCCESS,
  DELETE_EXPERIENCE_FAIL,
  ADD_EXPERIENCE_LOADING,
  ADD_EXPERIENCE_SUCCESS,
  ADD_EXPERIENCE_FAIL,
  EDIT_EXPERIENCE_FAIL,
  EDIT_EXPERIENCE_SUCCESS,
} from '../types';

const initialState = {
  experiences: [],
  experience: null,
  isLoading: false,
  error: null,
};

export default function experienceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_EXPERIENCE_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EXPERIENCES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_EXPERIENCE_LOADING:
      return {
        ...state,
        experiences: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: { ...payload.me },
          },
          ...state.experiences,
        ],
      };
    case GET_EXPERIENCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        experience: payload.experience,
      };
    case GET_EXPERIENCES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        experiences: payload.experiences,
      };
    case ADD_EXPERIENCE_SUCCESS:
      return {
        ...state,
        experiences: state.experiences.map((m) => {
          if (m.id === 0) return payload.experience;
          return m;
        }),
      };
    case EDIT_EXPERIENCE_SUCCESS:
      return {
        ...state,
        experience: payload.experience,
      };
    case EDIT_EXPERIENCE_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case GET_EXPERIENCE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_EXPERIENCES_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_EXPERIENCE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        experiences: state.experiences.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
