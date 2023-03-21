--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

CHORES BACKLOG


--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
DEBUGGING

--------------------------------------------------------------------------------------

if theres no player spawn zone it leads to the camrea not being destroyed thing? so thats a way to reproduce the bug FYI

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
ERROR HANDLING
--------------------------------------------------------------------------------------

COBROWSING PUBLISHER CHECK if its connected to the client? why is that? Theres some problem right ! COBROWSING_UPDATE_ACKNOWLEDGED? Perhaps...

Catch all React Errors and also catch all utils errors, and even phaser errors?

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
PERFORMANCE
--------------------------------------------------------------------------------------

also like... event listeners, make sure they are getting turned off right. It can cause serious trouble

Unauthenticate socket when logging out

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
GAME ORGANIZATION
--------------------------------------------------------------------------------------

window.socket -> import sockets like the way the store is imported

Physics member? Cuz right now movement is like two members and like ok physics and graphics for an object can maybe just be on the phaser instance??

respawn on GameInstance -> spawn ( use this when initializting game too )

HostCanvas
ClientCanvas
  CodrawingCanvas
  Canvas

DATA VALIDATIN FOR CLASSES, BRUSHES, ETC
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
APP ORGANIZATION
--------------------------------------------------------------------------------------

updateCobrowsing wrapper that only occurs when you use the target icon in the cobrowsing toolbar

comebine withGame with GameRoomContext

TicketedEvent/TicketPurchase need to change user to owner/purchaser

SHORT URLS
  Lobby.lobbyId
  game.gameId
  these can be my own custom ids and use them for urls instead of the mongodb ids

OPEN/CLOSE should all be TOGGLE with a value prop
