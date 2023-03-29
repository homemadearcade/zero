import { combineReducers } from 'redux';

import arcadeGamesReducer from './arcadeGamesReducer';
import authReducer from './authReducer';
import cobrowsingReducer from './cobrowsingReducer';
import registerReducer from './registerReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import messageReducer from './messageReducer';
import lobbyInstancesReducer from './lobbyInstancesReducer';
import lobbyInstanceReducer from './lobbyInstanceReducer';
import statusReducer from './statusReducer';
import videoReducer from './videoReducer';
import gameModelReducer from './gameModelReducer';
import gameSelectorReducer from './gameSelectorReducer';
import gameFormEditorReducer from './gameFormEditorReducer';
import gameViewEditorReducer from './gameViewEditorReducer';
import unlockableInterfaceReducer from './unlockableInterfaceReducer';
import contextMenuReducer from './contextMenuReducer';
import codrawingReducer from './codrawingReducer';
import errorsReducer from './errorsReducer';
import webPageReducer from './webPageReducer';
import playerInterfaceReducer from './playerInterfaceReducer';
import portfolioReducer from './portfolioReducer';
import ticketedEventReducer from './ticketedEventReducer';
import checkoutReducer from './checkoutReducer';
import interfacePresetReducer from './interfacePresetReducer';
import snackbarReducer from './snackbarReducer';
import themeReducer from './themeReducer';
import gameRoomInstanceReducer from './gameRoomInstanceReducer';
import canvasImageReducer from './canvasImageReducer';
import hoverPreviewReducer from './hoverPreviewReducer';
import experienceModelReducer from './experienceModelReducer';

export default combineReducers({
  arcadeGames: arcadeGamesReducer,
  auth: authReducer,
  cobrowsing: cobrowsingReducer,
  register: registerReducer,
  message: messageReducer,
  user: userReducer,
  users: usersReducer,
  lobbyInstances: lobbyInstancesReducer,
  lobbyInstance: lobbyInstanceReducer,
  status: statusReducer,
  video: videoReducer,
  gameModel: gameModelReducer,
  gameSelector: gameSelectorReducer,
  gameFormEditor: gameFormEditorReducer,
  gameViewEditor: gameViewEditorReducer,
  contextMenu: contextMenuReducer,
  unlockableInterfaceIds: unlockableInterfaceReducer,
  playerInterface: playerInterfaceReducer,
  codrawing: codrawingReducer,
  errors: errorsReducer,
  webPage: webPageReducer,
  portfolio: portfolioReducer,
  ticketedEvent: ticketedEventReducer,
  interfacePreset: interfacePresetReducer,
  checkout: checkoutReducer,
  snackbar: snackbarReducer,
  theme: themeReducer,
  gameRoomInstance: gameRoomInstanceReducer,
  canvasImage: canvasImageReducer,
  hoverPreview: hoverPreviewReducer,
  experienceModel: experienceModelReducer
});
