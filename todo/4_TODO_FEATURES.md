--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

CLEAN UP STAGES, GAME, ADD KEYBOARD TOOLBAR

CONTENT DIALOG
  Textures
  Dialog
  Cutscenes
  Stages
  Audio
  Particles

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
TEXTURES
--------------------------------------------------------------------------------------

UPLOAD PHOTOS
  Textures
    Security for changing the game images.... Any user can really edit those images now because amazon isnt checking. Perhaps it has to go through our check?
    attempt the user profile pic upload first
    Should be a /image route not an aws route

--------------------------------------------------------------------------------------

LOCK DATA
  ArcadeGame.currentEditingSessionId == LobbyId/UserMongoId
  if(lobbyid !== currentEditingSessionId) not allowed to load
  Same with Classes, and all these other global data objects

  there might be an object of lobbys with like the date that the permission expires??
  if they dont use it for 1 hour then its locked and released to another lobby if requested

  Lock which Lobby you are in
    I think user just needs to have a current lobby Id and current game room id, cuz right now its on a member and that doesnt really do anything

  ALWAYS COPY A GAME when its used inside an experience. Its the users CHOICE whether or not to store is as the primary game or not AFTER THE EXPERIENCE IS OVER

  A game has a gameRoomInstanceMongoId and only members of that gameRoom can edit it
  A user is in only one lobby at a given time, we need to store that
  Remove from members

  Games and CanvasImages that anyone in a lobby can edit!
  Does that mean we want to keep track of what lobby you are in? on the user object? lobbyInstanceMongoId === ? Also then we can just be like 'yo we got a lobby already working on this thing here'

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
  SHIFT -> turn on grid view

  CAPS LOCK - Grid View 

  MMO-esque toolbar on the bottom left

  ALL TOOLS go in here
    Snapshot Tool
    Grid Change
    Section Editor
    Prompt Editor
  COBROWSING TOOLS
    Open MORE TOOLS selector. Perhaps more tools need to be added? Tool Creator system. WOW!

ESC key 
