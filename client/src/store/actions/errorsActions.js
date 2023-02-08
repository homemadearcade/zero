import { COBROWSING_CONNECTION_LOST } from '../../lobby/constants';
import { 
  CHANGE_ERROR_STATE,
  CLEAR_ERROR,
  CLEAR_ERROR_STATE,
  ON_CLEAR_COBROWSING_STATUS
} from '../types';
import { subscribeCobrowsing, unsubscribeCobrowsing } from './cobrowsingActions';

export const clearError = (id) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_ERROR,
    payload: {
      id
    }
  });
}

export const changeErrorState  = (errorState, data) => (dispatch, getState) => {

  async function reconnectCobrowsing() {
    function failReconnection() {
      dispatch({
        type: CHANGE_ERROR_STATE,
        payload: {
          errorState,
          data: { message: 'Failed to Reconnect. Please refresh page. If this persists, contact the participant'}
        }
      })
    }

    try {
      await dispatch(unsubscribeCobrowsing({userId: data.userId}))
      await dispatch(subscribeCobrowsing({userId: data.userId}))
      setTimeout(() => {
        failReconnection()
      }, 15000)
    } catch(e) {
      failReconnection()
    }
  }

  if(errorState === COBROWSING_CONNECTION_LOST) {
    reconnectCobrowsing()
    dispatch({
      type: ON_CLEAR_COBROWSING_STATUS,
      payload: {
        userId: data.userId
      }
    })
  }

  dispatch({
    type: CHANGE_ERROR_STATE,
    payload: {
      errorState,
      data
    }
  })
};


export const clearErrorState  = (errorState) => (dispatch, getState) => {
  dispatch({
    type: CLEAR_ERROR_STATE,
    payload: {
      errorState,
    }
  })
};