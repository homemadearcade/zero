import { COBROWSING_CONNECTION_LOST } from '../../constants';
import { 
  CHANGE_ERROR_STATE,
  CLEAR_ERROR,
  CLEAR_ERROR_STATE,
  ON_CLEAR_COBROWSING_STATUS,
} from '../types';
import { subscribeCobrowsing, unsubscribeCobrowsing } from './game/cobrowsingActions';

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
      await dispatch(unsubscribeCobrowsing({userMongoId: data.userMongoId}))
      await dispatch(subscribeCobrowsing({userMongoId: data.userMongoId}))
      setTimeout(() => {
        failReconnection()
      }, 15000)
    } catch(e) {
      failReconnection()
    }
  }

  if(errorState === COBROWSING_CONNECTION_LOST) {
    console.log('doing it again??')
    reconnectCobrowsing()
    dispatch({
      type: ON_CLEAR_COBROWSING_STATUS,
      payload: {
        userMongoId: data.userMongoId
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