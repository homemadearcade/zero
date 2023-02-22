--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
BIG FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

DIALOGUE CHOICES

PARTICLE EFFECTS
https://phaser-particle-editor.firebaseapp.com/
https://koreezgames.github.io/phaser3-particle-editor/

LIGHT SYSTEM
https://blog.ourcade.co/posts/2020/phaser3-fog-of-war-field-of-view-roguelike/

WEBRTC for GameRoom
https://github.com/peers/peerjs

BETTER BRUSHES
  Spray Can, Paintbrush, Crayon?

  For paintbrush, use opacity, have it slowly layer on itself, square or circle paintbrush. Thats what pencil is. Or perhaps its like you can change the opacity of any brush, also you can change whether its circle or square

AUDIO :)

SPRITE SHEET EDITOR

PATHFINDING

CUSTOM CODING

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
SMALL FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

Jump Only boolean ( allows controlling during jumps only )

Timeline..timers - A whole timer interface like at the bottom like an editor?

Change gravity/boundaries effect ( basically change stage but wihout switching the objects?? )

Attribute to make the left side the 'front' of a sprite. For.. projectiles and for vehicle mode - not THAT hard... just has to do with movement yeah? and projectile stuff?

GAME POWERS
  inPlaythrough mode you can check the class of a player interface Ids and those ids are what are allowed to be shown. ! So then we can have game powers :)

  Limit the amount of clasees that can be made by your character. Or perhaps they cost resources or take time

  For example - Yes, you can create a class, but how much does it cost to create? Can this information be on a class? Like is a spell.. a..Class? Like you can place it on the map? Or perhaps the spell is to like switch Heros

MORE EVENTS
  onCutsceneEnd Event, onStageEntered
  On touch end. Instead of an array - plant a boolean on another collider? maybe? and like reset that boolean every loop. Once it doesnt need to be reset, thats when the touch stopped? right?

SHORT URLS
  Lobby.lobbyId
  game.gameId
  these can be my own custom ids and use them for urls instead of the mongodb ids

BETTER REDIRECT
  So for the redirect its possible we can just pass it as a prop to the 'login' component and the 'register' component. As well as have the 'onREgisterClick' button be a prop

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

PLAYER -> GAME INSTANCE SYSTEM
  gameInstanceId system. If your not the host, you ASK to join, you dont just JOIN. you are given player id/gameInstance Id by the host

  Player should be just another object instance. Also add a variable called like 'controlling instance' which is like a copy or something? think on this. Too many variations between player and object

INSTANCES IN RELATIONSHIP MENU
  Choose instances in relation editor
  Effect Instance id? Create a generelized id structure for everything.
    event.classIdB, classIdA would actually just be idA, idB, and then that id will relate to like objectclass/adsoasd98/ or objectinstance/oiasdljkasdna or playerinstance/kj.hasdkhjasd
    ID system for objects vs player vs project, etc? is that smart? Like be able to figure out what anything is based on its id?
  Also like basically effects should not use ClassA and ClassB
  effect Suffix shouldnt really be a thing. Its like just Whats effected, an instance or a class?? or what??

ACTIVITIES
  Drawing Activity
  Seperate Lobby and Activities
    Each user can have its own different activity it is viewing
    Activities have their own instructions
  
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
THE BIG UPGRADE
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------


EXPERIENCES
  Experience has Roles
    Roles can be invited to activities and lobbys with certain privelages
  Experience has Activitys
    Activity has instructions
    Activitys are type Drawing Activity, Game Activity, Chat Activity, or Video Activity, Lobby Door, AcitivityDoor 
      VideoActivity can be Browse, Group, Monologue, Teams, Pair, Chat
      ChatActivity is just a chat room no video
      DrawingAcitivity is Codrwaing
      GameAcitivity is GameRoom
      DoorAcitivity (lobby or activity) is a way out of the Lobby that participants can self select, it must have one or more LobbyIds attached to it 
  Experience has Lobbys
    Lobbys has ActivityIds
    Lobbys can be public, tickets only, invite only, or friends only
    Lobbys has a VideoActivity by default ( if part of an experience )
    Lobbys has an inviteList

  Experience example
  Homemade Arcade
    1 Lobby
      1 Video Activity
      3 Game Activitys

  A Drawing and a Game have various privacy settings - Room Members Only, Approved Users, Owner Only
    Sandbox Editor Mode, Character Editor Mode, 

  That means I can make one room Game Owner only privacy settings. and then I can move to another room thats Room Members Only. and it can be edited by everyone... OMG? So likE EVERYONE could make a game like The Hotel. EVeryone can make their own collaboritive game making system lmao.... yes. ITs true. EVeryone could make their own homemade arcade

