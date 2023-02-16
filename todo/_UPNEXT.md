--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
BIG FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

PLAYER -> GAME INSTANCE SYSTEM

gameInstanceId system. If your not the host, you ASK to join, you dont just JOIN. you are given player id/gameInstance Id by the host

Player should be just another object instance. Also add a variable called like 'controlling instance' which is like a copy or something? think on this. Too many variations between player and object

BETTER BRUSHES

Spray Can, Paintbrush, Crayon?

For paintbrush, use opacity, have it slowly layer on itself, square or circle paintbrush. Thats what pencil is. Or perhaps its like you can change the opacity of any brush, also you can change whether its circle or square

INSTANCES IN RELATIONSHIP MENU

Choose instances in relation editor
Effect Instance id? Create a generelized id structure for everything.
  event.classIdB, classIdA would actually just be idA, idB, and then that id will relate to like objectclass/adsoasd98/ or objectinstance/oiasdljkasdna or playerinstance/kj.hasdkhjasd
  ID system for objects vs player vs project, etc? is that smart? Like be able to figure out what anything is based on its id?
Also like basically effects should not use ClassA and ClassB
effect Suffix shouldnt really be a thing. Its like just Whats effected, an instance or a class?? or what??

PATHFINDING

DIALOGUE CHOICES

PARTICLE EFFECTS
https://phaser-particle-editor.firebaseapp.com/
https://koreezgames.github.io/phaser3-particle-editor/

LIGHT SYSTEM
https://blog.ourcade.co/posts/2020/phaser3-fog-of-war-field-of-view-roguelike/

SPRITE SHEET EDITOR

CUSTOM CODING

WEBRTC for GameRoom
https://github.com/peers/peerjs

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

Attribute to make the left side the 'front' of a sprite. For.. projectiles and for vehicle mode

inPlaythrough mode you can check the class of a player interface Ids and those ids are what are allowed to be shown. ! So then we can have game powers :)

MORE EVENTS

onCutsceneEnd Event, onStageEntered
On touch end. Instead of an array - plant a boolean on another collider? maybe? and like reset that boolean every loop. Once it doesnt need to be reset, thats when the touch stopped? right?

SHORT URLS

Lobby.lobbyId
game.gameId 
these can be my own custom ids and use them for urls instead of the mongodb ids

BETTER REDIRECT

So for the redirect its possible we can just pass it as a prop to the 'login' component and the 'register' component. As well as have the 'onREgisterClick' button be a prop
