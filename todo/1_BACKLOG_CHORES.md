Look up x, y, on phaser instance should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

Try to remove getState() and getCobrowsingState() from inside of game... standardize this better

LOCK DATA
  ArcadeGame.currentEditingSessionId == LobbyId/UserId
  if(lobbyid !== currentEditingSessionId) not allowed to load
  Same with Classes, and all these other global data objects

in preloader
  only load spritesheets that are added for 'play game' mode

Better tag generation data. the data is a bit strange now, perhaps an object defined what tags and relations are generated. I dont know the patterns yet

EXPERIENCE CREATOR
  create reducer for experience creator so that we can at least change the selected is when we remove something