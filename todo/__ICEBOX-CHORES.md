--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
DEBUGGING

--------------------------------------------------------------------------------------

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
Also a Layers Entity. Because Layers is common across CodrawingScene and Game Instance
Maybe even a LayerGroup class?

DATA VALIDATIN FOR ENTITY_MODELES, BRUSHES, ETC
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
APP ORGANIZATION
--------------------------------------------------------------------------------------

updateCobrowsing wrapper that only occurs when you use the target icon in the cobrowsing toolbar

TicketedEvent/TicketPurchase need to change user to owner/purchaser

OPEN/CLOSE should all be TOGGLE with a value prop
