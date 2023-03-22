Look up x, y, on phaser instance should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

Try to remove getState() and getCobrowsingState() from inside of game... standardize this better

LOCK DATA
  ArcadeGame.currentEditingSessionId == LobbyId/UserId
  if(lobbyid !== currentEditingSessionId) not allowed to load
  Same with Classes, and all these other global data objects

in preloader
  only load spritesheets that are added for 'play game' mode

Interface Ids themselves may have to be auto generated, for dynamic lookup