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

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
LAYER VERSIONING BY GAME SESSION?
--------------------------------------------------------------------------------------
  you need to copy the textures within the game... too ( just the layer images really )
  Or do versioning for the layer images.. not sure

  ALSO security is still a problem. If I send in a texture id I want to replace then I CAN. 

  Ok so we need to prevent overriding? Or like have an owner of a texture? but then not everyone can edit? I think its about creating new images and then deleting past images eventually. Thats why we record s3 uploads. 