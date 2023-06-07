--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
BUGS
--------------------------------------------------------------------------------------

CODRAWING BUG UPDATES
  WHEN STROKING
    Texture id on canvas that is undefined?? 
    
  TEXTURE ID WHEN GOING THROUGH STEPS??
    .textureId is not defined on the Codrawing Canvas anymore? - in lobbies. Maybe cuz someone aint the host
    Must be because of draw player 

  SECURITY
    ALSO security is still a problem. If I send in a texture id I want to replace then I CAN. Maybe canvas images determine their own permissions instead of arcades...
    So its like yes you gotta be in da lobby but also you gotta be allowed to edit the canvas image


EntityModelIds are getting set to null? When, where, why?

Its getting cobrowsing updates from another lobby

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
CHORES
--------------------------------------------------------------------------------------

Look up x, y, on phaser instance should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

Try to remove getState() and getCobrowsingState() from inside of game... standardize this better

Utils that use state should be hooks

Only Once should be on relation model

SELECT CHIPS AUTO 
  Asynchronous and FreeSolo MUI Autocomplete is now in the docs

MIGRATE TO TYPESCRIPT?
  https://github.com/airbnb/ts-migrate

RENAME ACTIVITYS?
  brew install rename

entityIID -> entityClassIID

DATA
  All Data should be cloned. No merged, imported data. No!
  Better clone deep when applying default player? Default jumper?

  Do one piece of data at a time. Start with brushes or something?

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
IMAGE SECURITY
--------------------------------------------------------------------------------------


/////

----

POSSIBLE fix to space bar issues. Is that you can can blur the focus on to the accordian after a set timeout of the expanded variable being changed

--