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

Only Once should be on relation model

Better way of getting arcade game actions onto the experience model....Experience model when laoding should search all arcade game and add the actions to itself

Aggregate all SelectGameInstanceEffect -> SelectInterfaceAction -> into one thing and just have a visibility toggle take care of this...

MIGRATE TO TYPESCRIPT?
  https://github.com/airbnb/ts-migrate

RENAME ACTIVITYS?
  brew install rename

  Asynchronous and FreeSolo MUI Autocomplete is now in the docs