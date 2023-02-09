import { combineReducers } from 'redux';

import arcadeGamesReducer from './arcadeGamesReducer';
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
import gameModelReducer from './gameModelReducer';
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
import ticketedEventReducer from './ticketedEventReducer';
import checkoutReducer from './checkoutReducer';
import interfacePresetReducer from './interfacePresetReducer';
import snackbarReducer from './snackbarReducer';
import themeReducer from './themeReducer';

export default combineReducers({
  arcadeGames: arcadeGamesReducer,
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
  gameModel: gameModelReducer,
  gameEditor: gameEditorReducer,
  gameFormEditor: gameFormEditorReducer,
  gameViewEditor: gameViewEditorReducer,
  contextMenu: contextMenuReducer,
  unlockableInterfaceIds: unlockableInterfaceReducer,
  gameContext: gameContextReducer,
  codrawing: codrawingReducer,
  errors: errorsReducer,
  webPage: webPageReducer,
  portfolio: portfolioReducer,
  ticketedEvent: ticketedEventReducer,
  interfacePreset: interfacePresetReducer,
  checkout: checkoutReducer,
  snackbar: snackbarReducer,
  theme: themeReducer
});
