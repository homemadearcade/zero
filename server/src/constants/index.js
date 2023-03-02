export const ARCADE_EXPERIENCE_ID = 'homemadeArcade'

export const ON_SOCKET_CONNECT = 'connect';
export const ON_SOCKET_DISCONNECT = 'ON_SOCKET_DISCONNECT';

export const ON_AUTHENTICATE_SOCKET_SUCCESS = 'ON_AUTHENTICATE_SOCKET_SUCCESS';
export const ON_AUTHENTICATE_SOCKET_FAIL = 'ON_AUTHENTICATE_SOCKET_FAIL';

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
///// CHARACTER
// PUT /user/:id 
// FROM: Admin 
// TO: User DB -> Game Host/ Game Client
// calls ON_GAME_CHARACTER_UPDATE locally to update Redux gameModel and Phaser GameInstance on all machines 
export const ON_GAME_CHARACTER_UPDATE = 'ON_GAME_CHARACTER_UPDATE';

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
///// LOBBY/GAME

// POST /lobbys/undo/:id
// FROM: Lobby User 
// TO: Game Host
// Pops undo state, sometimes saving Phaser Canvas. sometimes calling ON_GAME_MODEL_UPDATE
export const ON_LOBBY_UNDO = 'ON_LOBBY_UNDO';

// PUT /game/:id 
// FROM: Game Client or Game Host 
// TO: Game Clients and Game Host
// calls ON_GAME_MODEL_UPDATE locally to update Redux gameModel and Phaser GameInstance on all machines 
export const ON_GAME_MODEL_UPDATE = 'ON_GAME_MODEL_UPDATE';

// PUT /lobby/:id, Many Other Places
// FROM: Lobby Member 
// TO: Lobby Members
//  Updates Redux Lobby state
export const ON_LOBBY_UPDATE = 'ON_LOBBY_UPDATE';


// // PUT /lobby/:id, Many Other Places
// // FROM: Lobby Member 
// // TO: Lobby Members
// // Pushes to Lobby chat
// export const ON_LOBBY_SEND_MESSAGE = 'ON_LOBBY_SEND_MESSAGE';

// Socket ON_LOBBY_USER_STATUS_UPDATE
// FROM Lobby Mamber 
// TO: Lobby Members.
// Update Redux LobbyStatus State
export const ON_LOBBY_USER_STATUS_UPDATE = 'ON_LOBBY_USER_STATUS_UPDATE';

// Socket ON_GAME_INSTANCE_UPDATE
// FROM: Game Host 
// TO: Game Clients 
// Updates Phaser GameClient GameInstance, checks to make sure connection is still established
export const ON_GAME_INSTANCE_UPDATE = 'ON_GAME_INSTANCE_UPDATE';

// Socket ON_GAME_INSTANCE_EVENT
// FROM: Game Host 
// TO: Game Client
// Updates Phaser GameClient Game Instance
export const ON_GAME_INSTANCE_EVENT = 'ON_GAME_INSTANCE_EVENT';

// Socket ON_GAME_INSTANCE_ACKNOWLEDGED
// FROM: Game Client
// TO: Game Host
// Checks to make sure connection is still established
export const ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED = 'ON_GAME_INSTANCE_UPDATE_ACKNOWLEDGED';

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
///// CODRAWING

// POST /codrawing/stroke/:id
// FROM Lobby Mamber 
// TO: Lobby Members
// Draws Stroke to Canvas unless from Self. Host saves image.
export const ON_CODRAWING_STROKE = 'ON_CODRAWING_STROKE'

// POST /codrawing/:id
// FROM: Subscriber 
// TO: Subscriber Host
// Disabled
export const ON_CODRAWING_SUBSCRIBED = 'ON_CODRAWING_SUBSCRIBED'

// POST /codrawing/undo/:id
// FROM: Subscriber Host or Subscriber Clients
// TO: Subscriber Host
// Pops undo state and saves Phaser Canvas.
export const ON_CODRAWING_UNDO = 'ON_CODRAWING_UNDO';

// Socket ON_CODRAWING_STROKE_ACKNOWLEDGED
// FROM: Subscriber Host
// TO: Subscriber Clients
// Acknowledges a stroke has been recorded
export const ON_CODRAWING_STROKE_ACKNOWLEDGED = 'ON_CODRAWING_STROKE_ACKNOWLEDGED';

// ON_CODRAWING_SUBSCRIBED
// FROM: Subscriber Host
// TO: A Subscriber Client
export const ON_CODRAWING_INITIALIZE = 'ON_CODRAWING_INITIALIZE'

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//// COBROWSING

// POST /cobrowsing/:id
// FROM Subscriber 
// TO: Publisher
// Sends Back ON_COBROWSING_UPDATE event
export const ON_COBROWSING_SUBSCRIBED = 'ON_COBROWSING_SUBSCRIBED';

// PUT /cobrowsing/dispatch/:id
// FROM Subscriber
// TO: Publisher
// Updates Publisher Redux State. Calls ON_COBROWSING_UPDATE to update Subscribers with new state
export const ON_COBROWSING_REMOTE_DISPATCH = 'ON_COBROWSING_REMOTE_DISPATCH';

// PUT /cobrowsing/:id
// FROM: Publisher 
// TO: Subscriber
// Updates Subscriber Redux RmmoteState
export const ON_COBROWSING_UPDATE = 'ON_COBROWSING_UPDATE';

// Socket ON_COBROWSING_STATUS_UPDATE
// FROM Cobrowsing Publisher 
// TO: Cobrowsing Subscribers.
// Update Redux CobrowsingMouse and PhaserViews state
export const ON_COBROWSING_STATUS_UPDATE = 'ON_COBROWSING_STATUS_UPDATE';



//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//// GAME SESSION
export const ON_GAME_ROOM_UPDATE = 'ON_GAME_ROOM_UPDATE';
export const ON_GAME_ROOM_USER_STATUS_UPDATE = 'ON_GAME_ROOM_USER_STATUS_UPDATE';

export const CODRAWING_ROOM_PREFIX = 'codrawing@'
export const COBROWSING_ROOM_PREFIX = 'cobrowsing@'
export const ADMIN_ROOM_PREFIX = 'admins@'


export const SOCKET_SESSIONS_STORE = 'SOCKET_SESSIONS_STORE'
export const GAME_ROOMS_STORE = 'GAME_ROOMS_STORE'
export const LOBBYS_STORE = 'LOBBYS_STORE'
export const SOCKET_IO_STORE = 'SOCKET_IO_STORE'