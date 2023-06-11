NEXT UI

1) New Layers System
2) OS based system
3) Simpler Cobrowsing IDS
4) New Brushes
5) User Toolbar w/ Video/Audio, etc
6) Widescreen game
7) Behavior presets ( kinda like tags) for movement, jump, collisions, etc, projectile. It can store a whole set of data. And you can see if it conflicts with other behavior presets`

--

INTERNET SPEED, DATA v1, BRUSH v2, 

Branding on waiting page

When an effect is added to a relationship, there should be a popup for it to select the Effect Data. CreateEffectRelationData? 

Payload too large to copy game. Needs to be multipart form?

Popup that says - you do not have a role in this game, Join as Audience?

End Call for everyone in lobby, End call for self also

--

BETTER CONNECTION CHECKS
  After you saved an image, your playground stopped updating. Was codrawing just disconnected?

  Client hits reset but the host didnt get it so they are off track. It must have missed a game room update ( try resetting connection on an interval? ) 

  I think that Errors should just simualte a refresh of almost essnetially the entire page ( except the video call ? ). 

  If theres a problem with cobrowsing connection there could easily be a problem with lobby, game instance, etc. 

  You lost your video please refresh page 
  Popup when someone loses video 

  You dont wanna make a BIG POPUP that SAYS HEY WTF. Try to make it seamless, try to avoid popup at all costs, make it invisible

---

GAME INSTANCE NETWORKING MODEL FIX
  Types of Entitys
    Player Camera, Stage
    Game Entity
    Spawned Entity
    Projectile Entity
    Player Controlled Entity

  Instance info about each stage. POSITION/ROTATION is not in this list
  This list updates, deletions, entityModelId, if spawned or not. maybe even IS PLAYER

  Is this on the game room?? I think it is! gameInstanceState or perhaps just gameState

  fixex - Sometimes when switching to a game room when the host isnt logged on yet and then trying to load it again later leads to all sorts of bugs of it not loading

  fixes - When booting up a cobrowsing scene the TRANSFORMED player id isn’t…. Booting right away

  fixes - Same with objects that are deleted!  It creates them all and then forgets to delete one that are deleted

  allows for - when multiplayer is introduced and players can hop in as any entity

  PLAYER -> GAME INSTANCE SYSTEM
    gameInstanceId system. If your not the host, you ASK to join, you dont just JOIN. you are given player id/gameInstance Id by the host

    Player should be just another object instance. Also add a variable called like 'controlling instance' which is like a copy or something? think on this. Too many variations between player and object

--

HOST SYSTEM UPGRADE
  Changing Game host requires you to reload the game doesnt it. Because host is decided in PreloaderScene

  fixes ( maybe ) - If the host is not online, codrawing strokes will not save! Most importantly if you are non the same SCENE as the host it will not save

  Host should be dynamic??? Or should there be be one host at all times. Can we switch the host without resetting the game?

