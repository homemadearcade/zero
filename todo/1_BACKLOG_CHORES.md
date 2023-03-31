Look up x, y, on phaser instance should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

Try to remove getState() and getCobrowsingState() from inside of game... standardize this better

LOCK DATA
  ArcadeGame.currentEditingSessionId == LobbyId/UserMongoId
  if(lobbyid !== currentEditingSessionId) not allowed to load
  Same with Classes, and all these other global data objects

in preloader
  only load spritesheets that are added for 'play game' mode

EXPERIENCE CREATOR
  create reducer for experience creator so that we can at least change the selected is when we remove something

Update all name forms 
  Make the class name form thing into a reusable component and add to stage, cutscene, tag, etc

Utils that use state should be hooks

Maybe Effects -> Game Effects
Maybe Events -> Game Events or Relation Events? Think on this...