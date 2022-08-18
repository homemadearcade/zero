CONVERSATION TOPICS

Lobby Steps, how is it?

UX for change background color?

Camera scroll by hovering at the edges hit box?

Create a 'toolbar' on the right hand side? This toolbar changes based on if you are admin or not

Im thinking of another toolbar - mouse toolbar?

Is size fixed based on class? Can you resize on the map?

--

TODO NOW

Cobrowsing Click event
remove brush 9 and 22.5 when you're not in the top layer

UNDO
Game Size, Boundary
Relationsips

--

UP NEXT 




---

TODO SOON

GRAPHICAL WORLDBUILDING
Sprite Editor
  + when making class - to start a new drawing inside of sprite editor

NARRATIVE
Dialogue
Cutscenes

GAMEPLAY
Behaviors
Controls - speed, other phaser examples, etc

--------

TODO LATER

choose background color

--

TODO BEHAVIORS, CONTROLS

invisible if collided with hero

Attach to Sliding object, elevator, etc

Soccerball ( attach to hero on collide and allow hero to shoot out again )

---

TODO FEATURES

Clearer Autosave Indicator

Spray Can, Paintbrush, Crayon?

For paintbrush, use opacity, have it slowly layer on itself, square or circle paintbrush. Thats what pencil is. Or perhaps its like you can change the opacity of any brush, also you can change whether its circle or square

right click brush - copy to layer X, delete, open in sprite editor

--

TODO CHORES 

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

useHooks for Unlockable Data and other data...

<AdminHidden> component? isInLobby, isGameStarted, isAdmin, isLogged In interfaceId="X' all in one component etc

Outline Class ( for eraser and objectInstance, and camerapreview? )

this.isHost this.isLocal should I save? should I cobrowse, should I send remote updates?? All this lower level variables that are also coming from the top down

Seperate more reducers?

Game Modal class? for like getting data from redux  so we can get game data with functions

So for the redirect its possible we can just pass it as a prop to the 'login' component and the 'register' component. As well as have the 'onREgisterClick' button be a prop

--------

TODO FEATURES ( MAYBE )

Zoom Slider

FOLDING/UNFOLDING organization

Maybe also turn off editing with the hammer icon?

Resize object?

For all these util functions, I need to rethink how utils are done, is there objects we can use? should I turn gameModel, user, lobby, etc all these things into classes? Is that normal inside of redux? should it really be all functional

interfaceUnlock other features, such as camera move with keys? drag object? etc

Unlock snap to grid?

Lock to cobrowsers camera

Right click -> snap camera to section? regardless if you are in section or not?

circle for objectInstance body?

ID system? is that smart? Like be able to figure out what anything is based on its id?

--------

TODO TIME PERMITTING

Mobile

Blockchain NFT editing thing

then perhaps find the right way to do custom coding - collision, events? paths? etc

TAB + for moving through the UI ( other keyboard shortcuts )

--------