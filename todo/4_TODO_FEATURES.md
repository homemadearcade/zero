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

IMPLEMENT THESE EFFECTS
  Pause Game. Unpause Game
  Also transform while touching 
    auto generate zones for this effect
  EFFECTS 
    Remove Tag, Add Tag Effect
  Game End Tags
  Interact to Destroy Tag

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

Games and CanvasImages that anyone in a lobby can edit!
  Does that mean we want to keep track of what lobby you are in? on the user object? lobbyInstanceMongoId === ? Also then we can just be like 'yo we got a lobby already working on this thing here'

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
DATA
--------------------------------------------------------------------------------------

IMPORTING/COPYING/SYSTEM
  get original entity id so that things inherit
  I have to decide what Ids mean and I have to decide fast
  Copying, importing, etc how tf do I do it!

  When you copy a class. It should open edit Graphics with IsNew triggered

  IMPORTED GAMES
    Mark an imported game as just like a 'library' in order to be able to import it. I just cant trust users to handle this on their own. 

    It seems to be easiest all around for importing from system or from library that we COPY everything. but I think thats not REALLY true for this. WE want INTEROPABLE game in the future... INTEROPABLE so like a version of a tag with the same name in one game shouldnt be different than another version of a tag

    Problem is that... We want a lot of classes baked into the game data 

  remove system data

  Aggregate all SelectGameInstanceEffect -> SelectInterfaceAction -> into one thing and just have a visibility toggle take care of this...

LOCK DATA
  ArcadeGame.currentEditingSessionId == LobbyId/UserMongoId
  if(lobbyid !== currentEditingSessionId) not allowed to load
  Same with Classes, and all these other global data objects

  Lock which Lobby you are in
    I think user just needs to have a current lobby Id and current game room id, cuz right now its on a member and that doesnt really do anything

USER DATA
  Users.role should be
  User.roles...{}
    interfaceIds[userId] === their default interfaceId... for us to use?
    super admins...

SETTINGS
  editorExperienceMongoId
  libraryArcadeGamaMongoId
  archiveUserId

---------------------------------------------------------------------------------------------------- 


KEYBOARD MODE

SHIFT -> turn on grid view

CAPS LOCK - Grid View 

MMO-esque toolbar on the bottom

---------------------------------------------------------------------------------------------------- 


GAME VISIBILITY SCOPE
——
Private
Unlisted
Arcade
Featured ( Admin Only )

--

GAME SECURITY SCOPE

Only Me
UserList
Public

Current Lobby? This overrides?

---
