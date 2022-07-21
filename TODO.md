CONVERSATIONS

--

TODO NEXT

LOBBY DASHBOARD MICAUDIO - VISUAL FEEDBACK, because I can hear others in the lobby
FOLDING/UNFOLDING organization
VALIDATION ON ALL FORMS

FOR EACH BRUSH LAYER
color squares ( with most commonly used colors ) with a + add the end that opens color selector
+ for fresh sprite open in sprite editor inside brush and class creation

choose background color

GAME_HOST_REMOTE_PROCEDURE_CALL or is this just update lobby to be gamePaused? what about game reset? maybe we need that...
Reset Button
Play/Pause Button

COBROWSING_HOST_REMOTE_PROCEDURE_CALL

CONTROLS - speed, other phaser examples, etc
CAMERA
GAME BOUNDARY

DRAWING
  Tinting
  Pixel Pencil, Brush, Spray Can
  Unlock snap to grid?
  BUG - Sometimes a Playground sprite is not picked up because it doesnt have alpha in the center
  BUG - brushing a ton sucks because the new image comes in and overwrites what you have
  Sync network drawing?

--------

TODO LATER

Lobby Steps?

Update Lobby Find

Leaving game bug....scenes?

right click brush - copy to layer X, delete, open in sprite editor

Basically once they load the game and 'join it' I think its a one-way experience. To LEAVE the game after that is a big action. we need to get their hero involved. You can peek at the lobby dashboard if you want in like a side nav bar but yeah. If you want to stop COBROWSING thats fine, you can stop cobrowsing and just turn that flag off, but you dont unmount the game view

remove brush 9 and 22.5 when you're not in the top layer

add Login and Signup components to withAuth

Get rid of this editorState, videoState thing, thats total bs just make it editor, video, lobby... etc. Remove the lobby steps to editorForms. Also add a reducer called cobrowsingLocal. maybe just add it to the cobrowsing reducer

Theres two problems with cobrowsing to think about
1) When we are checking something about the user, such as if they are admin or not. Do we check local or remote user
2) When clicking on a button while cobrowsing, how do we dispatch the remote event?

Cobrowsing Click event

Popup for connection errors

Better error handling in cobrowsing

Unauthenticate socket when logging out

more behaviors, and controls, and customization

then perhaps find the right way to do custom coding - collision, events? paths? etc

BEHAVIORS

Remove top layer

Soccerball ( attach to hero on collide and allow hero to shoot out again )

--------

TODO TIME PERMITTING

Mobile

Blockchain NFT editing thing

TAB + for moving through the UI

--------

TO RESEARCH

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