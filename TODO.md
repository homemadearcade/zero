CONVERSATION TOPICS

Camera Drag vs WASD vs Arrow Keys. Controls conversation

Edit Mode, how does that work. Can you control the hero? What else changes? Can you still add items during non edit mode?

Lobby Steps

Zoom Slider

What does Unlockable really look like? Weve got question mark squares. So what options to we want? What about options we actually just straight up want to hide? 

So all this cobrowsing click together crap, does it all work the way we want it to? We click, it effects their screen, for everything??

Transparency? Should it be handled by brush or by color?

preventing scroll

--

TODO NEXT

Brush Class, CodrawingBrush Class

choose background color

lobbys arent saved after they are saved initially, lobby update needs to save a version of da lobby...

Theres 3 of each of these layer modals ( create brush, create color ) because they are not in the root element area. They all open at the same time

--

GRAPHICAL WORLDBUILDING
Sprite Editor
  + when making class - to start a new drawing inside of sprite editor

Game Size, Boundary

NARRATIVE
Dialogue
Cutscenes

GAMEPLAY
Behaviors
Relationsips
Controls - speed, other phaser examples, etc

--------

TODO LATER

Zoom Slider

VALIDATION ON ALL FORMS

FOLDING/UNFOLDING organization


--

TODO BEHAVIORS, CONTROLS

invisible if collided with hero

Attach to Sliding object, elevator, etc

Soccerball ( attach to hero on collide and allow hero to shoot out again )

---

TODO EVENTUALLY

Cobrowsing Click event

Context menu X,Y being sent back and forth to the cobrowsers is not correct x, y. You need to send %

Better error handling locally and with cobrowsing, perhaps have just one error array and make sure that array is shared in cobrowsing as well

Popup for connection errors, little thing in the bottom corner. Toast thing

remove brush 9 and 22.5 when you're not in the top layer

add Login and Signup components to withAuth - update lobby find

Unauthenticate socket when logging out

checking for lobby.id

Object Instance -> Texture, Instance, Graphics
Square 


--------
TODO CHORES

also like... event listeners, make sure they are getting turned off right. It can cause serious trouble

check and make sure phaser is deleting the game objects

security for codrawing and cobrowsing, make sure they are in the lobby!

DATA VALIDATIN FOR CLASSES, BRUSHES, ETC

useHooks for Unlockable Data and other data...

--------

TODO MAYBE

Spray Can, Paintbrush

unlock other features, such as camera move with keys? drag object? etc

<AdminHidden> component? isInLobby, isGameStarted, isAdmin, isLogged In interfaceId="X' all in one component etc
lobby.id -> isInLobby

right click brush - copy to layer X, delete, open in sprite editor

Unlock snap to grid?

circle for objectInstance body?

Game Modal class? for like getting data from redux  so we can get game data with functions

Lock to cobrowsers camera

ID system? is that smart

Seperate more reducers?


--------

TODO TIME PERMITTING

Mobile

Blockchain NFT editing thing

then perhaps find the right way to do custom coding - collision, events? paths? etc

TAB + for moving through the UI ( other keyboard shortcuts )

--------