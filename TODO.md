Thoughts - where should the camera be during a run through???

--
TODO

GAME
  Effect to switch games
  Go to ticketing page with Effect

Forgot Password - email Flow

---------
BIG FEATURES
---------

TICKETING
  Checkout page
    Integrate authorize
    Create Lobby with sold ticket
  Ticket Receipt Page
  All sorts of emails for tickets

GAME SPECIFIC UI SYSTEM
  for settin gravity, choosing player movement options, etc

FEATURES
  Unlockable UI presets creator/editor page

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
  You should be able to hide games, you should be able to hide classes, hide lobby not delete them, hide users, dont delete them
  Add New Cutscene inside of Create Relation? Add a new Class inside of Create Relation
  Auto hide live editor when using keys?

BUGS
  COLLIDER/RELATIONSHIP BUG - The issue is that when the collider is registered one one object, that object seems to prevent overlap on the other object. So anything on the playground layer cannot overlap with the player because theres a collider automatically registered. Same with registering colliders on an other objects menu. The player relationships wont work with it
  Confirmed - When one instance places a collider on the other object, it prevents the overlap events coming back on that other object from trigger

  Basically if you decide to register a collider on another object, 
    you also need to be responsible for registering all the events from that object via your own overlap detector

  Its possible I just need like... to control who sets relationships myself, it has nothing to do with classIdA, etc

FLOW
  Spawn object at the edge of the heros camera?
  Class is selected after being created, Movement is prompted after placing the first object?
