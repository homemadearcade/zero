import { combineReducers } from 'redux';

import authReducer from './authReducer';
import cobrowsingReducer from './cobrowsingReducer';
import registerReducer from './registerReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import messageReducer from './messageReducer';
import lobbysReducer from './lobbysReducer';
import lobbyReducer from './lobbyReducer';
import statusReducer from './statusReducer';
import videoReducer from './videoReducer';
import gameReducer from './gameReducer';
import editorReducer from './editorReducer';
import editorFormsReducer from './editorFormsReducer';
import editorInstanceReducer from './editorInstanceReducer';
import unlockableInterfaceReducer from './unlockableInterfaceReducer';
import contextMenuReducer from './contextMenuReducer';

export default combineReducers({
  auth: authReducer,
  cobrowsing: cobrowsingReducer,
  register: registerReducer,
  message: messageReducer,
  user: userReducer,
  users: usersReducer,
  lobbys: lobbysReducer,
  lobby: lobbyReducer,
  status: statusReducer,
  video: videoReducer,
  game: gameReducer,
  editor: editorReducer,
  editorForms: editorFormsReducer,
  editorInstance: editorInstanceReducer,
  contextMenu: contextMenuReducer,
  unlockableInterface: unlockableInterfaceReducer
});
