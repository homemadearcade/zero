---------
TODO NOW
---------

DIALOGUE!!! Figure this out... Custom relation menu basically FOR THE USER. Simplified Relation menu for the user

Non saving mode for games/Playthrough mode for prologues
  
Destroy Delay after X seconds - EffectDelay, EffectDelayInterval

---
---------
TODO LATER
---------

Hard Game Reload, Cut Participant Video?

Shortcuts menu?

Current Player Icon in Player Class Menu

Player should be assessed by .classId by game clients
and assessed based on the state by the game host and game local and game 
  its possible it goes Host ReduxState -> Host Game -> Game Update -> Client Game -> Client ReduxState
for BOTH game state AND Hero? Game state WILL NEVER BY LOCALLY COBROWSED.. EVER!
Is current player EVER neede in the UI? if not. Then we can just check the scene.player Instnace?

Remote cut video

Collides with self toggle

Copy game when homemade arcade is completed and put it in a different database

--

---------
BIG FEATURES
---------

INFO BOX 
  Right Click, Left Click, Name of Class
  You should be able to ^ highlight for the cobrowsing user any thing that is an INFOBOX
  TOOL TIP sort of thing. Perhaps is inside the Unlockable Component. Perhaps we just like...
  also have other additions to it like -- Information, Highlight click

EMAILS
  Forgot Password - email Flow
  All sorts of emails for tickets

TICKETING
  Checkout page
    Integrate authorize
    Create Lobby with sold ticket
  Ticket Receipt Page
  Open Ticket Modal effect

FEATURES
  Sprite sheet editor page
      Glass sprites from Kenney are all sorts of fucked up...?

-----
SMALL UPATES
-----

UI
  UI system for changing ui based on ArcadeGame vs Simulation VS PapaBearGame...
  
  UI COLOR needs and ...If you have a white background, if you have a grey background, Still issues!! Two border colors instead of ui color change
  
  When trying to name a class, spacebar doesnt work
    Shift + Press it works fine
  
  When a class is highlighted, you should be able to see all of them highlighted on the map?
  
  You should be able to hide games, you should be able to hide classes, hide stages, hide lobby not delete them, hide users, dont delete them, hide objects? nah delete them
  
  Add New Cutscene inside of Create Relation? Add a new Class inside of Create Relation
  
  Auto hide live editor when using keys?
    
  Fit all titles into the box with TextFit thing from before

  When there’s no option selectable in the descriptor mode, they expect something to pop up 
  We need to be able to HIGHLIGHT a div or UNLOCKABLE

BUGS  
  User Disonnect, fkin wierd man. It shows up in lobby now because they can send that message even when not logged in 

  Scroll bar showing up in the class menu??

  Initialize player Instance, no zone? Check for zone… and if no zone throw error?

  For prologues - Fix zones that are not on playground layer 
