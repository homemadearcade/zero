--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

GAME
--------------------------------------------------------------------------------------
I think projectiles dont do anything right now, register relations with them please :) or SOEMTHING. Perhaps actually put them on the object instances?? hmm?

CUTSCENES
  A default cutscene runs at the beginning

  The End. The text can be customized. 
  Default Ending cutscene 

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
DATA 
--------------------------------------------------------------------------------------

NEW FORMAT FOR GAME SAVING/EDITING PERMISSIONS
LOBBY ONLY ( HIDDEN ) Privacy Setting for Games

  Create copied games with the new lobby instance id 
  allow users that are in that new lobby instance id to edit the game
  you need to copy the textures within the game... too ( just the layer images really )
  Or do versioning for the layer images.. not sure

--------

USER DATA
  Users.role should be
  User.roles...{}
    interfaceIds[userId] === their default interfaceId... for us to use?
    super admins...

APP SETTINGS
  editorExperienceMongoId
  libraryArcadeGamaMongoId
  archiveUserId

---------------------------------------------------------------------------------------------------- 

KEYBOARD MODE
  Avoid shift? Yes avoid shift. SHIFT is - KEEP TOOL SELECTED

  SHIFT -> turn on grid view

  CAPS LOCK - Grid View 

  Figure out how to register keys?

  MMO-esque toolbar on the bottom left

  ALL TOOLS go in here
    Snapshot Tool
    Grid Change
    Section Editor
    Prompt Editor
  COBROWSING TOOLS
    Open MORE TOOLS selector. Perhaps more tools need to be added? Tool Creator system. WOW!

ESC key 
