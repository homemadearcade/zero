UPLOAD PHOTOS
  Textures
    Security for changing the game images.... Any user can really edit those images now because amazon isnt checking. Perhaps it has to go through our check?
    attempt the user profile pic upload first
    Should be a /image route not an aws route

Games and CanvasImages that anyone in a lobby can edit!
  Does that mean we want to keep track of what lobby you are in? on the user object? lobbyInstanceMongoId === ? Also then we can just be like 'yo we got a lobby starting'

VIDEO CALL BLOCKING
  End Call for everyone in lobby, End call for self also

PARTICLE EFFECT ON INSTANCES WHEN YOU CHANGE A CLASS

TREASURE CHEST UNLOCKS

PUSH UI STATE ( Envelope Icon )

ENTITY INSTANCE UPGRADE
  Compound Static Body for Entities

LOBBY UPDATE
  Lobby Join Sound
  Lobby Member Count in /lobbys page
  Prevent someone from joining a lobby if they are already in one

EMAILS
  Forgot Password - email Flow
  All sorts of emails for tickets

TICKETING
  Checkout page
    Integrate authorize
    Create Lobby with sold ticket
  Ticket Receipt Page
  Open Ticket Modal effect
  when a ticketing service makes a game, name it ( guest name + date )
  https://www.authorize.net/en-us/sign-up/pricing.html
  Test speed test optional when buying tickets 

EFFECTS 
  Remove Tag, Add Tag Effect
  Camera Shake is bad because of the size of the map. it works best when zoomed out, why is that?

INTERFACE IDS
  Generate interfaceIds based on the game model
  Interface Ids themselves may have to be auto generated, for dynamic lookup
  Default unlocked interface ids need to be not shown in the unlockables tree

DALL E GENERATOR

EXPERIENCE MODEL
  Experience Thumbnail, Experience Image, etc

GAME ROOM EXPANSION
  I think maybe the game room manages loading interface ids and what not? or do games do that? WHO manages that? why when a game is loaded? troubling. Its hard to manage both at the same time... You need both states

.id -> ___mongoId. Finish my id cleanup

EXPERIENCE ONLY EFFECTS ( such as overlay effect )

TABS FOR the EDIT CLASS MODAL ( yes : )  
  AUTOGENERATION FORM
CLEAN UP UI in general
