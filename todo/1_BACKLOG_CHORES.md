BUGS
  Dont set Agora to a device if that device isn’t found this time.

ROLES
  If you switch roles the camera breaks 

  When I switched participant with admin things got messed up when trying to join

  ( currently you are not allowed to switch roles mid lobby )

GAME HOST CHANGE
  Changing Game host requires you to reload the game doesnt it. Because host is decided in PreloaderScene

-----

CHORES

Look up x, y, on phaser instance should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

Try to remove getState() and getCobrowsingState() from inside of game... standardize this better

in preloader
  only load spritesheets that are added for 'play game' mode

EXPERIENCE CREATOR
  create reducer for experience creator so that we can at least change the selected is when we remove something

Update all name forms 
  Make the class name form thing into a reusable component and add to stage, cutscene, tag, etc

Utils that use state should be hooks

Only Once should be on relation model

SELECT CHIPS AUTO 
  Asynchronous and FreeSolo MUI Autocomplete is now in the docs

REMOVE ENTITY INSTANCE
  Dont redo ALL relations when this happens, just relevant ones. Same with player, etc

MIGRATE TO TYPESCRIPT?
  https://github.com/airbnb/ts-migrate

RENAME ACTIVITYS?
  brew install rename