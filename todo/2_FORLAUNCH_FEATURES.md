LIBRARY
  DATA_SOURCE_SYSTEM needs to be elimnated or made read only. Because it will make library imports not work
  If THERE IS A CORE library, it DOES in fact need to be used in a special way. This is where my library api thing can be used
  Maybe I should wait to complete the interface stuff because I want to like make a special library interface but the truth is we dont want one
  perhaps 'REPLACE_ID_1', REPLACE_ID_2, etc

IMPLEMENT THESE EFFECTS
  EXPERIENCE EFFECTS - Go to Stars, Return from Stars
  Pause Game. Unpause Game
  Also transform while touching 
    auto generate zones for this effect

WHEN ADDING INSTRUCTIONS MANUALLY
  You have to select a game room or lobby! Right now u can just skip them!

COMBINE 
  experienceModel with experience
      GAME HOST ACTIONS instructions need to be run by the GAME HOST
  ROLE
    Have this update the cobrowsing color


---

UPLOAD PHOTOS
  Textures
    Security for changing the game images.... Any user can really edit those images now because amazon isnt checking. Perhaps it has to go through our check?
    attempt the user profile pic upload first
    Should be a /image route not an aws route

Games and CanvasImages that anyone in a lobby can edit!
  Does that mean we want to keep track of what lobby you are in? on the user object? lobbyInstanceMongoId === ? Also then we can just be like 'yo we got a lobby already working on this thing here'

VIDEO CALL BLOCKING
  End Call for everyone in lobby, End call for self also

PARTICLE EFFECT ON INSTANCES WHEN YOU CHANGE A ENTITY_MODEL
  Explode on Destroy Tag

PUSH UI STATE ( Envelope Icon )

ENTITY INSTANCE UPGRADE
  Compound Static Body for Entities

LOBBY UPDATE
  Lobby Join Sound
  Lobby Member Count in /lobbys page
  Prevent someone from joining a lobby if they are already in one

EFFECTS 
  Remove Tag, Add Tag Effect
  Camera Shake is bad because of the size of the map. it works best when zoomed out, why is that?

DALL E GENERATOR

USER SPEED TESTS FULL FEATURE
---