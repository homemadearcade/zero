--
TODO

NOW

Think about preloader scene?
should it actually be like the overaching scene controller?
The thing is once a new scene starts..., the old instance will lose all its information
I think it all needs to be on redux? or a larger object?
yes.. I think redux..State needs to be shared as well

Thoughts - where should the camera be during a run through???
Should run throughs be remote connected? Part of me thinks so yes. I mean.. what the hell!

Also switch games? whats going on here? At least set it up so it can work in the future. Give scenes ids. Give an initial scene Id to the main data set

STATUS TOOLBAR
  Microphone, Internet Connection, Game Paused, Editing, Whatever State, The time. If you have an object selected its obvious, 
  We need STOP, PAUSE, PLAY, REALLY PLAY
  Game States are going to be more advanced now PAUSE STATE, PLAY STATE, CINEMATIC_PLAY_STATE. This needs to trickle into object and whatnot. Like cinematic play state should just create a 'Play Version' of the game. Thats almost... a lobby state. Yes

GAME
  Effect to switch games
  Go to ticketing page with Effect

Forgot Password - email Flow


LATER
---------

TICKETING
  Checkout page
    Integrate authorize
    Create Lobby with sold ticket
  Ticket Receipt Page
  All sorts of emails for tickets

GAME SPECIFIC UI SYSTEM
  for settin gravity, choosing player movement options, etc

UI
  The sliders - you dont really know what zero is
  UI system for changing ui based on ArcadeGame vs Simulation VS PapaBearGame...
  UI COLOR needs and ...If you have a white background, if you have a grey background, Still issues!! Two border colors instead of ui color change
  When trying to name a class, spacebar doesnt work
    Shift + Press it works fine
  When a class is highlighted, you should be able to see all of them highlighted on the map?
  You should be able to hide games, you should be able to hide classes, hide lobby not delete them, hide users, dont delete them
  Add New Cutscene inside of Create Relation? Add a new Class inside of Create Relation

META
  Popup for connection errors, little thing in the bottom corner. Toast thing
  why is connected = false happening so much?

FEATURES
  Unlockable UI presets creator/editor page

FLOW
  Spawn object at the edge of the heros camera?
  Class is selected after being created, Movement is prompted after placing the first object?

--
