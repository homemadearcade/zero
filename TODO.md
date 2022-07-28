CONVERSATION TOPICS

Camera Drag vs WASD vs Arrow Keys. Controls conversation

Edit Mode, how does that work. Can you control the hero? What else changes? Can you still add items during non edit mode? What is Section mode called?

Lobby Steps, how is it?

Zoom Slider, do we need it?

What does Unlockable really look like? Weve got question mark squares. So what options to we want? What about options we actually just straight up want to hide? 

So all this cobrowsing click together crap, does it all work the way we want it to? We click, it effects their screen, for everything??

Transparency? Should it be handled by brush or by color?

preventing scroll? How can we design it so nothing scrolls? they get smaller and smaller? yeah...I like that!

UX for change background color?

--

TODO NOW

UNDO
Game Size, Boundary
Relationsips
Cutscenes

--

UP NEXT 




---

TODO SOON

GRAPHICAL WORLDBUILDING
Sprite Editor
  + when making class - to start a new drawing inside of sprite editor

NARRATIVE
Dialogue

GAMEPLAY
Behaviors
Controls - speed, other phaser examples, etc

--------

TODO LATER

choose background color

Zoom Slider

VALIDATION ON ALL FORMS

FOLDING/UNFOLDING organization


--

TODO BEHAVIORS, CONTROLS

invisible if collided with hero

Attach to Sliding object, elevator, etc

Soccerball ( attach to hero on collide and allow hero to shoot out again )

---

TODO FEATURES

Cobrowsing Click event

Context menu X,Y being sent back and forth to the cobrowsers is not correct x, y. You need to send %

Spray Can, Paintbrush, Crayon?

For paintbrush, use opacity, have it slowly layer on itself, square or circle paintbrush. Thats what pencil is. Or perhaps its like you can change the opacity of any brush, also you can change whether its circle or square

right click brush - copy to layer X, delete, open in sprite editor

--

TODO CHORES 

Theres 3 of each of these layer modals ( create brush, create color ) because they are not in the root element area. They all open at the same time

Better error handling locally and with cobrowsing, perhaps have just one error array and make sure that array is shared in cobrowsing as well

Popup for connection errors, little thing in the bottom corner. Toast thing

remove brush 9 and 22.5 when you're not in the top layer

add Login and Signup components to withAuth - update lobby find

Unauthenticate socket when logging out

util files -> Util Suffix

also like... event listeners, make sure they are getting turned off right. It can cause serious trouble

check and make sure phaser is deleting the game objects

security for codrawing and cobrowsing, make sure they are in the lobby!

DATA VALIDATIN FOR CLASSES, BRUSHES, ETC

useHooks for Unlockable Data and other data...

<AdminHidden> component? isInLobby, isGameStarted, isAdmin, isLogged In interfaceId="X' all in one component etc

Outline Class ( for eraser and objectInstance, and camerapreview? )

--------

TODO MAYBE

Resize object?

this.isHost this.isLocal should I save? should I cobrowse, should I send remote updates?? All this lower level variables that are also coming from the top down

For all these util functions, I need to rethink how utils are done, is there objects we can use? should I turn gameModel, user, lobby, etc all these things into classes? Is that normal inside of redux? should it really be all functional

interfaceUnlock other features, such as camera move with keys? drag object? etc

Unlock snap to grid?

Lock to cobrowsers camera

Right click -> snap camera to section? regardless if you are in section or not?

circle for objectInstance body?

Game Modal class? for like getting data from redux  so we can get game data with functions

ID system? is that smart? Like be able to figure out what anything is based on its id?

Seperate more reducers?

--------

TODO TIME PERMITTING

Mobile

Blockchain NFT editing thing

then perhaps find the right way to do custom coding - collision, events? paths? etc

TAB + for moving through the UI ( other keyboard shortcuts )

--------