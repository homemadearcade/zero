import { combineReducers } from 'redux';

import authReducer from './authReducer';
import registerReducer from './registerReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import messageReducer from './messageReducer';
import lobbysReducer from './lobbysReducer';
import lobbyReducer from './lobbyReducer';
import videoReducer from './videoReducer';

export default combineReducers({
  auth: authReducer,
  register: registerReducer,
  message: messageReducer,
  user: userReducer,
  users: usersReducer,
  lobbys: lobbysReducer,
  lobby: lobbyReducer,
  video: videoReducer
});
