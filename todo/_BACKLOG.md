--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

FEATURES BACKLOG

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

Update Hero Camera Max after changing section size

Soccerball ( attach to hero on collide and allow hero to shoot out again )

Automate some video - In monologue mode …Hovering over video creates… overlay
https://codepen.io/tigt/pen/aZYqrg

ANALYTICS on each action?, on where on the screen? Save all records

Destroyed By Message ( You lost because... )

Camera change options for 'cutscene'

Make Key Diagrams Responsive

how to update and view cobrowsing when they aint logged on?
should an entire cobrowsing state be.... shared/editable when the user is not logged on
and also therefore, its inherited?? omg thats so dope! So like yeah create their full interface before they log on, like add a couple popups

edit class type

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

CHORES BACKLOG

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
BUGS
--------------------------------------------------------------------------------------

swap all the objects to correct layers when it changes so we can use the layers correctly for visibility and for taking pictures...

TOUR component for admins? There this 'tour component' I found when searching ui libraries, its dope!

COBROWSING PUBLISHER CHECK if its connected to the client? why is that? Theres some problem right ! COBROWSING_UPDATE_ACKNOWLEDGED? Perhaps...

Fix with Cobrowsing?? right now broken af when switching between two different users

if theres no player spawn zone it leads to the camrea not being destroyed thing? so thats a way to reproduce the bug FYI

undo canvas stuff doesnt work now between stages... Codrawing system needs to undo by texture Id not ... canvas id?

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
PERFORMANCE
--------------------------------------------------------------------------------------

also like... event listeners, make sure they are getting turned off right. It can cause serious trouble

Unauthenticate socket when logging out

Performance huge upgrade - sort all instances into class Id. Use for relations

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
ERROR HANDLING
--------------------------------------------------------------------------------------

Catch all React Errors and also catch all utils errors, and even phaser errors?

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
SECURITY
--------------------------------------------------------------------------------------

security for redux state stuff. Since cobrowsers can edit the redux state, they could potentially change the users redux state for their user, their password for example, and then they could try to get them to save their account and save that new password.

security for codrawing and cobrowsing, make sure they are in the lobby!

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
GAME ORGANIZATION
--------------------------------------------------------------------------------------

Look up x, y, on sprite should be... getPosition(). Overall use Get Methods instead of .x, .y, .rotation

Physics member? Cuz right now movement is like two members and like ok physics and graphics for an object can maybe just be on the sprite?

Wrap Sprite in another class called like...object instance... lol, phaser objectinstance??

Outline Class ( for eraser and objectInstance, and camerapreview? )

respawn on GameInstance -> spawn ( use this when initializting game too )

Decide - what does default mean, what does initial mean?
  Initial Data vs Default data...?
  Initial Data initializes
  Default data fallsback

HostCanvas
ClientCanvas
  CodrawingCanvas
  Canvas

DATA VALIDATIN FOR CLASSES, BRUSHES, ETC

Try to remove getState() and getCobrowsingState() inside of game... standardize this better

ExperienceSession
  Lobby
  GameSession
-> LOBBY IS ONE OF THE STATES OF EXPERIENCE SESSION :). So when you go to a game session you actually DO leave the lobby.

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
APP ORGANIZATION
--------------------------------------------------------------------------------------

players vs participants vs users inside of a lobby. I think perhaps its 'invitedMembers' and 'invitedPlayers' and them 'members' and 'players'

comebine withGame with GameSessionContext

Create index folder for lobby, game, redux, etc

Admin, Creator, Marketing Folders

Interface Preset Update
  Need to make an interface tree component to seperate user tree and a preset tree
  Create a list component

VALIDATION ON ALL FORMS

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
STATE ORGANIZATION
--------------------------------------------------------------------------------------

Seperate more reducers?

useHooks for Unlockable Data and other data... yes actually thats needed isnt it. Because right now like unlockable stuff gets a state.unlockableIntefrfaceIds thing at the bottom

Game Model class? for like getting data from redux so we can get game data with functions
For all these util functions, I need to rethink how utils are done, is there objects we can use? should I turn gameModel, user, lobby, etc all these things into classes? Is that normal inside of redux? should it really be all functional. Where IS THE STATE? What state belongs in my classes and what state belongs in REDUX. React UI = Redux. Phaser UI = OOP
^^^
I think so yes. Basically we can... turn Game Model into a class that has the Scene on it.. yes :)