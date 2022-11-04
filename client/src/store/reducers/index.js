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
import gameEditorReducer from './gameEditorReducer';
import gameFormEditorReducer from './gameFormEditorReducer';
import gameViewEditorReducer from './gameViewEditorReducer';
import unlockableInterfaceReducer from './unlockableInterfaceReducer';
import contextMenuReducer from './contextMenuReducer';
import codrawingReducer from './codrawingReducer';
import errorsReducer from './errorsReducer';
import webPageReducer from './webPageReducer';
import gameContextReducer from './gameContextReducer';
import portfolioReducer from './portfolioReducer';

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
  gameEditor: gameEditorReducer,
  gameFormEditor: gameFormEditorReducer,
  gameViewEditor: gameViewEditorReducer,
  contextMenu: contextMenuReducer,
  unlockableInterfaceIds: unlockableInterfaceReducer,
  gameContext: gameContextReducer,
  codrawing: codrawingReducer,
  errors: errorsReducer,
  webPage: webPageReducer,
  portfolio: portfolioReducer
});
