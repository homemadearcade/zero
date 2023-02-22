--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

FEATURES BACKLOG

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

PATHFINDING

CUSTOM CODING

Soccerball ( attach to hero on collide and allow hero to shoot out again )

Automate some video - In monologue mode …Hovering over video creates… overlay
https://codepen.io/tigt/pen/aZYqrg

Destroyed By Message ( You lost because... )

Select class type ( for admins only )

VIDEO CALL BLOCKING
  End Call for everyone in lobby, End call for self
  Mute and cut user video should be an object. I think theres both, admin muting someone in side a lobby. Kick out of experience, etc. Mute someone at an experience level. Also a user can mute someone if they dont like them

MODALS
  Create Brush/Class -> Edit Sprite -> ( Create Brush -> Edit Sprite )...
    Perhaps make Sprite Editor a root level modal?
  Make add Color Not a Modal?

swap all the objects to correct game layers when it changes so we can use the layers correctly for visibility and for taking pictures...

MORE EVENTS
  onCutsceneEnd Event, onStageEntered
  On touch end. Instead of an array - plant a boolean on another collider? maybe? and like reset that boolean every loop. Once it doesnt need to be reset, thats when the touch stopped? right?

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
VERSION BREAKING FEATURES
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

BETTER DATA MODEL
  Decide - what does default mean, what does initial mean?
    Initial Data vs Default data...?
    Initial Data initializes
    Default data fallsback
  Put this on BACK END, not front end? Not sure, think about this. It will cause arcade games to break