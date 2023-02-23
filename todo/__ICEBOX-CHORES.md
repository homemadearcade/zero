--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

CHORES BACKLOG

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

Performance huge upgrade - sort all instances into class Id. Use for relations

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
GAME ORGANIZATION
--------------------------------------------------------------------------------------

Look up x, y, on sprite should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

Physics member? Cuz right now movement is like two members and like ok physics and graphics for an object can maybe just be on the sprite?

Wrap Sprite in another class called like...object instance... lol, phaser objectinstance??

Outline Class ( for eraser and objectInstance, and camerapreview? )

respawn on GameInstance -> spawn ( use this when initializting game too )

HostCanvas
ClientCanvas
  CodrawingCanvas
  Canvas

DATA VALIDATIN FOR CLASSES, BRUSHES, ETC

Try to remove getState() and getCobrowsingState() from inside of game... standardize this better

Object Entity
on stages, call objects -> instances

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
