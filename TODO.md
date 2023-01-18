--
TODO

TICKETING
  Checkout page
    Integrate authorize
    Create Lobby with sold ticket
  Ticket Receipt Page
  All sorts of emails for tickets

GAME SPECIFIC UI SYSTEM? for settin gravity

UI
  The sliders - you dont really know what zero is
  UI system for changing ui based on ArcadeGame vs Simulation VS PapaBearGame...
  UI COLOR needs and ...If you have a white background, if you have a grey background, Still issues!! Two border colors instead of ui color change
  When trying to name a class, spacebar doesnt work
    Shift + Press it works fine
  When a class is highlighted, you should be able to see all of them highlighted on the map?
  Disable UI for ClassB, Event, Effect after these are chosen
  Camera Zoom Editor + or - which way…
  You should be able to hide games, you should be able to hide classes, hide lobby not delete them, hide users, dont delete them
  Add New Cutscene inside of Create Relation? Add a new Class inside of Create Relation

AUTH
  Forgot Password - email Flow

CONNECTION
  Popup for connection errors, little thing in the bottom corner. Toast thing
  why is connected = false happening so much?

FLOW
  Spawn object at the edge of the heros camera?
  Class is selected after being created, Movement is prompted after placing the first object?

GAME
  Effect to switch games
  Go to ticketing page with Effect
  Allow changing the rotation speed for Vehicle/Direction
  Spawn from the zone that is interacted with

COLLISIONS
  Add Player Instance to Colliders menu
  Collider with player exists for all playground layer classes by default?

FEATURES
  STATUS TOOLBAR
    Microphone, Internet Connection, Game Paused, Editing, Whatever State, The time. If you have an object selected its obvious, 
    We need STOP, PAUSE, PLAY, REALLY PLAY
  Unlockable UI presets creator/editor page

--


  Theres a redirect issue when logging in sometimes??
  Signing  in with google won’t work for the lobby login page, maybe it will, ill test this
    I need to create a local host system for 1- camera/audio and 2- redirects

  So basically I gotta retest redirect stuff...

  The issue is that you are not logged in and then loading an app page that requires login