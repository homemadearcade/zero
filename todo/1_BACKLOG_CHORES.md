BUGS

ROLES
  If you switch roles the camera breaks 

  When I switched participant with admin things got messed up when trying to join

  ( currently you are not allowed to switch roles mid lobby )

GAME HOST CHANGE
  Changing Game host requires you to reload the game doesnt it. Because host is decided in PreloaderScene

-----

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

Aggregate all SelectGameInstanceEffect -> SelectInterfaceAction -> into one thing and just have a visibility toggle take care of this...

SELECT CHIPS AUTO 
  Asynchronous and FreeSolo MUI Autocomplete is now in the docs

IMPORTED GAMES
  Mark an imported game as just like a 'library' in order to be able to import it. I just cant trust users to handle this on their own. 

  It seems to be easiest all around for importing from system or from library that we COPY everything. but I think thats not REALLY true for this. WE want INTEROPABLE game in the future... INTEROPABLE so like a version of a tag with the same name in one game shouldnt be different than another version of a tag

REMOVE ENTITY INSTANCE
  Dont redo ALL relations when this happens, just relevant ones. Same with player, etc

MIGRATE TO TYPESCRIPT?
  https://github.com/airbnb/ts-migrate

RENAME ACTIVITYS?
  brew install rename