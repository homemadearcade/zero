--------------------------------------------------------------------------------------

TODO TIME PERMITTING BACKLOG

--------------------------------------------------------------------------------------
--
SMALL FEATURES
--

Following, Advanced Pathfinding

Enemy Projectiles

Jump Only boolean ( allows controlling during jumps only )

Change gravity/boundaries effect ( basically change stage but?? )

--------------------------------------------------------------------------------------
--
BIG FEATURES
--

Timeline..timers - A whole timer interface like at the bottom like an editor?

Choices in dialogue

Particles - Explosions

Light System

Mobile

Blockchain NFT editing thing

Custom coding - collision, events? paths? etc

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

TODO FEATURES BACKLOG

Attribute to make the left side the 'front' of a sprite. For.. projectiles and for vehicle mode

--------------------------------------------------------------------------------------

TODO FEATURES ( MAYBE ) BACKlog

Spray Can, Paintbrush, Crayon?

For paintbrush, use opacity, have it slowly layer on itself, square or circle paintbrush. Thats what pencil is. Or perhaps its like you can change the opacity of any brush, also you can change whether its circle or square

On touch end. Instead of an array - plant a boolean on another collider? maybe? and like reset that boolean every loop. Once it doesnt need to be reset, thats when the touch stopped? right?

Automate some video - In monologue mode…Hovering over video creates… overlay

ANALYTICS on each action?, on where on the screen? Save all records

onCutsceneEnd Event, onStageEntered

Destroyed By Message ( You lost because... )

Sprite Editor when loading up, you cant see previous strokes

Camera change options for 'cutscene'

Make Key Diagrams Responsive

Soccerball ( attach to hero on collide and allow hero to shoot out again )

Interact area based on the size of the camera?

View to lock to cobrowsers camera

If an item within an accordian is selected, the accordian is open

Right click -> snap camera to section? regardless if you are in section or not?

Interface Preset Update
  Need to make an interface tree component to seperate user tree and a preset tree
  Create a list component

how to update and view cobrowsing when they aint logged on?
should an entire cobrowsing state be.... shared/editable when the user is not logged on
and also therefore, its inherited?? omg thats so dope! So like yeah create their full interface before they log on, like add a couple popups

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

Fix with Cobrowsing?? right now broken af when switching between two different users

if theres no player spawn zone it leads to the camrea not being destroyed thing? so thats a way to reproduce the bug FYI

TODO CHORES BACKLOG

Admin, Creator, Marketing Folders

popup if the player has switched stages and you want to follow them to that scene 

UI COLOR needs and ...If you have a white background, if you have a grey background, Still issues!! Two border colors instead of ui color change

Auto hide live editor when using keys?

undo canvas stuff doesnt work now between stages... Codrawing system needs to undo by texture Id not ... canvas id?

Physics member? Cuz right now movement is like two members and like ok physics and graphics for an object can maybe just be on the sprite?

Wrap Sprite in another class called like...object instance... lol, phaser objectinstance??

Outline Class ( for eraser and objectInstance, and camerapreview? )

Choose instances in relation editor
Effect Instance id? Create a generelized id structure for everything.
  event.classIdB, classIdA would actually just be idA, idB, and then that id will relate to like objectclass/adsoasd98/ or objectinstance/oiasdljkasdna or playerinstance/kj.hasdkhjasd
  ID system for objects vs player vs project, etc? is that smart? Like be able to figure out what anything is based on its id?
Also like basically effects should not use ClassA and ClassB
effect Suffix shouldnt really be a thing. Its like just Whats effected, an instance or a class?? or what??

Player should be just another object instance. Also add a variable called like 'controlling instance' which is like a copy or something? think on this. Too many variations between player and object

Look up x, y, on sprite should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

VALIDATION ON ALL FORMS
DATA VALIDATIN FOR CLASSES, BRUSHES, ETC

security for redux state stuff. Since cobrowsers can edit the redux state, they could potentially change the users redux state for their user, their password for example, and then they could try to get them to save their account and save that new password.

security for codrawing and cobrowsing, make sure they are in the lobby!

also like... event listeners, make sure they are getting turned off right. It can cause serious trouble

Unauthenticate socket when logging out

Update Hero Camera Max after changing section

Performance huge upgrade - sort all instances into class Id. Use for relations

--------------------------------------------------------------------------------------

TODO CHORES ( MAYBE ) backlog

useHooks for Unlockable Data and other data...

Seperate more reducers?

So for the redirect its possible we can just pass it as a prop to the 'login' component and the 'register' component. As well as have the 'onREgisterClick' button be a prop

Game Model class? for like getting data from redux so we can get game data with functions
For all these util functions, I need to rethink how utils are done, is there objects we can use? should I turn gameModel, user, lobby, etc all these things into classes? Is that normal inside of redux? should it really be all functional. Where IS THE STATE? What state belongs in my classes and what state belongs in REDUX. React UI = Redux. Phaser UI = OOP
^^^
I think so yes. Basically we can... turn Game Model into a class that has the Scene on it.. yes :)

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

