--------------------------------------------------------------------------------------

TODO TIME PERMITTING BACKLOG

IDEAS

Jump Only boolean ( allows controlling during jumps only )
Allow changing the rotation speed for Vehicle/Direction

---

Timers - A whole timer interface like at the bottom like an editor?

Choices in dialogue

Particles

Light System
    World Effects
    Change world, change gravity. Like a 'world' class

Following..Advanced Pathfinding

Enemy Projectiles?

Mobile

Explosions

Conditions

Blockchain NFT editing thing

Custom coding - collision, events? paths? etc

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

TODO FEATURES BACKLOG

Spray Can, Paintbrush, Crayon?

For paintbrush, use opacity, have it slowly layer on itself, square or circle paintbrush. Thats what pencil is. Or perhaps its like you can change the opacity of any brush, also you can change whether its circle or square

--------------------------------------------------------------------------------------

TODO FEATURES ( MAYBE ) BACKlog

Attribute to make the left side the 'front' of a sprite. For.. projectiles and for vehicle mode 

Take snapshot without BG

onCutsceneEnd Event

Destroyed By Message ( You lost because... )

Unlock snap to grid?

Sprite Editor when loading up, you cant see previous strokes

Camera change options for 'cutscene'

Make Key Diagrams Responsive

MATTER
  If class is on background or foreground it should have isSensor: true in Constructor
  or - Collision Category?

  circle for objectInstance body?

  Create custom physics grid for custom sprite for swords

  Sensor on every side of the game object?

Soccerball ( attach to hero on collide and allow hero to shoot out again )

Interact area based on the size of the camera?

View to lock to cobrowsers camera

TAB + for moving through the UI ( other keyboard shortcuts )

If an item within an accordian is selected, the accordian is open

Right click -> snap camera to section? regardless if you are in section or not?

Zoom Slider


--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

TODO CHORES BACKLOG

Hero Name -> Player

Choose instances in relation editor
Effect Instance id? Create a generelized id structure for everything.
  event.classIdB, classIdA would actually just be idA, idB, and then that id will relate to like objectclass/adsoasd98/ or objectinstance/oiasdljkasdna or playerinstance/kj.hasdkhjasd
  ID system for objects vs player vs project, etc? is that smart? Like be able to figure out what anything is based on its id?

Player should be just another object instance. Also add a variable called like 'controlling instance' which is like a copy or something? think on this. Too many variations between player and object

Look up x, y, on sprite should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

VALIDATION ON ALL FORMS
DATA VALIDATIN FOR CLASSES, BRUSHES, ETC

Context menu X,Y being sent back and forth to the cobrowsers is not correct x, y. You need to send %

security for redux state stuff. Since cobrowsers can edit the redux state, they could potentially change the users redux state for their user, their password for example, and then they could try to get them to save their account and save that new password.

security for codrawing and cobrowsing, make sure they are in the lobby!

check and make sure phaser is deleting the game objects

also like... event listeners, make sure they are getting turned off right. It can cause serious trouble

Unauthenticate socket when logging out

Update Hero Camera Max after changing section

--------------------------------------------------------------------------------------

TODO CHORES ( MAYBE ) backlog

useHooks for Unlockable Data and other data...

<AdminHidden> component? isInLobby, isGameStarted, isAdmin, isLogged In interfaceId="X' all in one component etc

this.isHost this.isLocal should I save? should I cobrowse, should I send remote updates?? All this lower level variables that are also coming from the top down

Seperate more reducers?

So for the redirect its possible we can just pass it as a prop to the 'login' component and the 'register' component. As well as have the 'onREgisterClick' button be a prop

Game Model class? for like getting data from redux so we can get game data with functions
For all these util functions, I need to rethink how utils are done, is there objects we can use? should I turn gameModel, user, lobby, etc all these things into classes? Is that normal inside of redux? should it really be all functional. Where IS THE STATE? What state belongs in my classes and what state belongs in REDUX. React UI = Redux. Phaser UI = OOP

Auto hide live editor when using keys?

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

