import { combineReducers } from 'redux';

import arcadeGamesReducer from './game/arcadeGamesReducer';
import authReducer from './user/authReducer';
import cobrowsingReducer from './game/cobrowsingReducer';
import registerReducer from './user/registerReducer';
import userReducer from './user/userReducer';
import usersReducer from './user/usersReducer';
import messageReducer from './user/messageReducer';
import lobbyInstancesReducer from './experience/lobbyInstancesReducer';
import lobbyInstanceReducer from './experience/lobbyInstanceReducer';
import statusReducer from './experience/statusReducer';
import videoReducer from './experience/videoReducer';
import gameModelReducer from './game/gameModelReducer';
import gameSelectorReducer from './game/gameSelectorReducer';
import gameFormEditorReducer from './game/gameFormEditorReducer';
import gameViewEditorReducer from './game/gameViewEditorReducer';
import gameRoomInstanceReducer from './game/gameRoomInstanceReducer';
import unlockableInterfaceReducer from './game/unlockableInterfaceReducer';
import contextMenuReducer from './game/contextMenuReducer';
import codrawingReducer from './media/codrawingReducer';
import errorsReducer from './errorsReducer';
import webPageReducer from './webPageReducer';
import playerInterfaceReducer from './game/playerInterfaceReducer';
import portfolioReducer from './marketing/portfolioReducer';
import ticketedEventReducer from './ticketing/ticketedEventReducer';
import checkoutReducer from './ticketing/checkoutReducer';
import interfacePresetLibraryReducer from './library/interfacePresetLibraryReducer';
import snackbarReducer from './snackbarReducer';
import themeReducer from './themeReducer';
import canvasImageReducer from './media/canvasImageReducer';
import hoverPreviewReducer from './game/hoverPreviewReducer';
import experienceModelReducer from './experience/experienceModelReducer';
import entityClassLibraryReducer from './library/entityClassLibraryReducer';
import relationLibraryReducer from './library/relationLibraryReducer';
import relationTagLibraryReducer from './library/relationTagLibraryReducer';
import effectLibraryReducer from './library/effectLibraryReducer';
import eventLibraryReducer from './library/eventLibraryReducer';
import libraryReducer from './library/libraryReducer';

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
  interfacePresetLibrary: interfacePresetLibraryReducer,
  checkout: checkoutReducer,
  snackbar: snackbarReducer,
  theme: themeReducer,
  gameRoomInstance: gameRoomInstanceReducer,
  canvasImage: canvasImageReducer,
  hoverPreview: hoverPreviewReducer,
  experienceModel: experienceModelReducer,
  entityClassLibrary: entityClassLibraryReducer,
  relationLibrary: relationLibraryReducer,
  relationTagLibrary: relationTagLibraryReducer,
  effectLibrary: effectLibraryReducer,
  eventLibrary: eventLibraryReducer,
  library: libraryReducer,
});
