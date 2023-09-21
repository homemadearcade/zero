import axios from 'axios';
import { attachTokenToHeaders } from '../user/authActions';
import { 
  GET_LOBBYS_LOADING,
  GET_LOBBYS_SUCCESS,
  GET_LOBBYS_FAIL 
} from '../../types';
import { getUserRoleIdFromLobbyInstance } from '../../../utils';
import store from '../..';

export const getLobbys = () => async (dispatch, getState) => {
  dispatch({
    type: GET_LOBBYS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/lobbyInstance', options);

    dispatch({
      type: GET_LOBBYS_SUCCESS,
      payload: { lobbyInstances: response.data.lobbyInstances },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_LOBBYS_FAIL,
      payload: err.message,
    });
  }
};

export async function getLobbysForUser(userId)  {
  try {
    const options = attachTokenToHeaders(store.getState);
    const response = await axios.get('/api/lobbyInstance', options);

    const lobbyInstances = response.data.lobbyInstances.filter(lobbyInstance => {
      return !!getUserRoleIdFromLobbyInstance(lobbyInstance, userId)
    })

    return lobbyInstances
  } catch (err) {
    console.error(err)

    // dispatch({
    //   type: GET_LOBBYS_FAIL,
    //   payload: err.message,
    // });
  }
};
