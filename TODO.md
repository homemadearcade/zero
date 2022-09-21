CONVERSATION TOPICS

ATTRIBUTES
Attributes that are initially turned on but can be turned off
Attributes that are initially turned off but can be turned on

EVENT BASED
Actions that start when an event happens and resolve
  1. immediately
  2. when they are 'done'
  3. when another event happens

When we take into acount conditions that read the 'state' of the game, things get much more complex

-

CREATE CLASS UI

ADD CLASS
  Sprite
  Reactivity
  Movement
  Visual Effects
  Relationships

ADDITIONAL FEATURES IN ADD CLASS
  Camera
  Projectile
  Interact Area

-

Projectile Editor

Whether something is spawned or not needs to be instance level? or class level? Whats that look like? How to change? How to represent?

World Loop Switch, does the checkbox for this go in sections editor?

Movement Area Boundary Interface..?

World Effects like gravity change.. and?? other?

Area that is only collidable with 1 class, how do we add that UI -wise???
Exclusive Collisions between two

ARCADE VS MATTER
  - Matter can do rotational collisions. Shit gets hit and spins around and stuff
  - Arcade can NOT rotate
  - Arcade can check easily where a collision occured - upleftrightdown
  - Static objects in matter can only move position, not via velocity or thrust or force
  - Arcade has immovable vs pushable. These are two different concepts

Have to decide what to do... would suck to have to do two interfaces for everything. Unless we limited it to just what Arcade Physics can do...What can arcade physics do that matter physics toggle that matter physics cant?

Does having 'path system' do anything? Does that resolve movement?

What sort of games will come out of Matter JS, what sort of games will come out of Arcade? What are the real design strengths?
What sort of gameplays? What sort of stories, What sort of world is this?

POSSIBLE ADDITIONS

Set Initial Velocity
Rope
'shoot'
Create Force ( like a bomb type thing )

--

WARMUPS
 
Rotate
Resize
Change BG Color
Put + inside of grid
Movement Area Boundary

--

UP NEXT 

Relationship UI

---

TODO SOON

GRAPHICS
  Sprite Editor
  + when making class - to start a new drawing inside of sprite editor

NARRATIVE
  Dialogue
  Cutscenes

CONTROLS
  Speed
  Changing Controls.. etc

EFFECTS 
  NARRATIVE
  cutscene
  dialogue

ATTRIBUTES
  unspawned
  glowing
  rotationFollowKeys

--------

HOW TO

Choose BG Color
  Right Click -> Change World Background -> Opens Modal Menu with your all yours Colors (+), When you click that it changes the entire Base Color

Resizing object on map
  All objects of that class are resized at the same time
  Save or Cancel ( like Sections )

---

TODO FEATURES

If class is on background or foreground it should have isSensor: true in Constructor
or - Collision Category?

Create custom physics grid for custom sprite for swords

Clearer Autosave Indicator

Spray Can, Paintbrush, Crayon?

For paintbrush, use opacity, have it slowly layer on itself, square or circle paintbrush. Thats what pencil is. Or perhaps its like you can change the opacity of any brush, also you can change whether its circle or square

right click brush - copy to layer X, delete, open in sprite editor

--

TODO CHORES 

Look up x, y, on sprite should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

VALIDATION ON ALL FORMS
DATA VALIDATIN FOR CLASSES, BRUSHES, ETC

Context menu X,Y being sent back and forth to the cobrowsers is not correct x, y. You need to send %

security for codrawing and cobrowsing, make sure they are in the lobby!

You do not have permission to update this users cobrowse state ( ? ) upon Spencer logging on 

Popup for connection errors, little thing in the bottom corner. Toast thing

also like... event listeners, make sure they are getting turned off right. It can cause serious trouble

check and make sure phaser is deleting the game objects

Unauthenticate socket when logging out

TODO CHORES ( MAYBE )

Update Hero Camera Max after changing section

useHooks for Unlockable Data and other data...

<AdminHidden> component? isInLobby, isGameStarted, isAdmin, isLogged In interfaceId="X' all in one component etc

Outline Class ( for eraser and objectInstance, and camerapreview? )

this.isHost this.isLocal should I save? should I cobrowse, should I send remote updates?? All this lower level variables that are also coming from the top down

Seperate more reducers?

Game Modal class? for like getting data from redux  so we can get game data with functions

So for the redirect its possible we can just pass it as a prop to the 'login' component and the 'register' component. As well as have the 'onREgisterClick' button be a prop

--------

TODO FEATURES ( MAYBE )

Sensor on every side of the game object?

Soccerball ( attach to hero on collide and allow hero to shoot out again )

Interact area based on the size of the camera?

If an item within an accordian is selected, the accordian is open

Zoom Slider

For all these util functions, I need to rethink how utils are done, is there objects we can use? should I turn gameModel, user, lobby, etc all these things into classes? Is that normal inside of redux? should it really be all functional. Where IS THE STATE? What state belongs in my classes and what state belongs in REDUX. React UI = Redux. Phaser UI = OOP

interfaceUnlock other features, such as camera move with keys? drag object? etc

Unlock snap to grid?

Lock to cobrowsers camera

Right click -> snap camera to section? regardless if you are in section or not?

circle for objectInstance body?

ID system? is that smart? Like be able to figure out what anything is based on its id?

--------

TODO TIME PERMITTING

Explosions
Particles
Following..Advanced Pathfinding
Light System
Timers

Mobile

Blockchain NFT editing thing

Custom coding - collision, events? paths? etc

TAB + for moving through the UI ( other keyboard shortcuts )

--------