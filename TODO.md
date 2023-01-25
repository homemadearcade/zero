--
TODO

Copy game when homemade arcade is completed and put it in a different database

INFO BOX - Right Click, Left Click, Name of Class
Game Name Area, Stage Name Area
   Cutscenes, Stages, Metadata, OThers? More 
Think on toolbars
  Stages, Cutscenes, Relations, Images, Metadata, Boundaries
I think perhaps you can switch one of these bars between class/brush and stage information
  Play Cutscne, Switch to Stage

EMAILS
Forgot Password - email Flow
All sorts of emails for tickets

---------
BIG FEATURES
---------

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
  The sliders - you dont really know what zero is
  UI system for changing ui based on ArcadeGame vs Simulation VS PapaBearGame...
  UI COLOR needs and ...If you have a white background, if you have a grey background, Still issues!! Two border colors instead of ui color change
  When trying to name a class, spacebar doesnt work
    Shift + Press it works fine
  When a class is highlighted, you should be able to see all of them highlighted on the map?
  You should be able to hide games, you should be able to hide classes, hide stages, hide lobby not delete them, hide users, dont delete them, hide objects? nah delete them
  Add New Cutscene inside of Create Relation? Add a new Class inside of Create Relation
  Auto hide live editor when using keys?
  For prologues - Fix zones that are not on playground layer 
  Non saving mode for games/Playthrough mode for prologues
  Eraser in Sprite Editor
  Initialize player Instance, no zone? Check for zone… and if no zone throw error?
  Current Player Icon in Player Class Menu
  Delay for Effects, or like a flag for if you want the effect to happen first?
  Fit all titles into the box with TextFit thing from before
  Turn off Zone Layer visibility by Default if not admin

  Player Spawn zone being deleted issue, I think perhaps its just best to never let it be deleted, same with default stage. CANT BE DELETED! Player spawn zone issue is leading to... the camrea not being destroyed thing? so thats a way to reproduce the bug FYI

FLOW
  Spawn object at the edge of the heros camera?
  Class is selected after being created, Movement is prompted after placing the first object?
