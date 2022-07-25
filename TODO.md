CONVERSATION TOPICS

--

TODO NEXT

2) Unlockable UI

3) CAMERA
How to deal with zoom and cobrowsing?
  Basically you control your own zoom locally BUT there needs to be a remote object attached somewhere that display the users zoom on your map
Zoom Slider

4) DRAWING
  Tinting
  Pixel Pencil, Brush, Spray Can
  Unlock snap to grid?
  BUG - Sometimes a Playground sprite is not picked up because it doesnt have alpha in the center
  BUG - brushing a ton sucks because the new image comes in and overwrites what you have
  Sync network drawing?
FOR EACH BRUSH LAYER
color squares ( with most commonly used colors ) with a + add the end that opens color selector
+ for fresh sprite open in sprite editor inside brush and class creation

GAME BOUNDARY
CONTROLS - speed, other phaser examples, etc
RELATIONSHIP SYSTEM
DIALOGUE, CUTSCENES
BEHAVIORS

--------

TODO LATER

VALIDATION ON ALL FORMS

FOLDING/UNFOLDING organization
choose background color

COBROWING_RPC

right click brush - copy to layer X, delete, open in sprite editor

--

TODO BEHAVIORS, CONTROLS

invisible if collided with hero

Soccerball ( attach to hero on collide and allow hero to shoot out again )

---

TODO EVENTUALLY...

remove brush 9 and 22.5 when you're not in the top layer

add Login and Signup components to withAuth - update lobby find

Theres two problems with cobrowsing to think about
1) When we are checking something about the user, such as if they are admin or not. Do we check local or remote user
2) When clicking on a button while cobrowsing, how do we dispatch the remote event?

Cobrowsing Click event, cobrowsing scroll

Popup for connection errors

Better error handling locally and with cobrowsing, perhaps have just one error array and make sure that array is shared in cobrowsing as well

Unauthenticate socket when logging out

then perhaps find the right way to do custom coding - collision, events? paths? etc

--------

TODO TIME PERMITTING

Mobile

Blockchain NFT editing thing

TAB + for moving through the UI

--------

TO RESEARCH

https://blog.logrocket.com/using-material-ui-with-react-hook-form/

https://github.com/saintedlama/mongoose-version#:~:text=Mongoose%20Version%20is%20a%20mongoose,and%20kept%20for%20later%20use.

XX https://16patsle.github.io/phaser3-weapon-plugin/

https://github.com/netgfx/Phaser-tooltip

https://github.com/jorbascrumps/phaser-plugin-water-body

https://github.com/englercj/phaser-debug

https://github.com/netgfx/Phaser-FloatingText

https://github.com/SaFrMo/phaser-percent-bar

https://github.com/mikewesthad/phaser-matter-collision-plugin

https://github.com/anthony-mills/procedural_dungeon

https://github.com/jdotrjs/phaser3-nineslice

https://github.com/koreezgames/phaser3-particle-editor

https://github.com/samme/phaser-component-health

https://github.com/GaryStanton/phaser3-merged-input

https://blog.ourcade.co/posts/2020/phaser3-fog-of-war-field-of-view-roguelike/

https://github.com/nkholski/phaser-grid-physics

ROTATING PLATFORM
https://gist.github.com/mikewesthad/a1170f06d3da27bc923ea280b2f89545#file-create-rotating-platform-js

DOPE!
https://github.com/mikewesthad/dungeon

https://github.com/psych0der/pngquantjs