--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
SMALL FEATURES
--------------------------------------------------------------------------------------

ANALYTICS on each action?, on where on the screen? Save all records

how to update and view cobrowsing when they aint logged on?
should an entire cobrowsing state be.... shared/editable when the user is not logged on
and also therefore, its inherited?? omg thats so dope! So like yeah create their full interface before they log on, like add a couple popups

Update Hero Camera Max after changing section size

Interface Preset Update
  Need to make an interface tree component to seperate user tree and a preset tree
  Create a list component

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
MEDIUM FEATURES
--------------------------------------------------------------------------------------

BETTER TEXTURE/LAYER SYSTEM
LAYERS property on ArcadeGame
  A layer either has colliders or it doesnt. A layer is given a texture id. 
  Layers is an object on GameModel. A Layer has a texture Id. You can look up the depth  a brush/eraser is supposed to be on by finding its Layer object. The layer object also
  Save BG PG FG to the aws images object

INSTANCES IN RELATIONSHIP MENU
  Choose instances in relation editor
  Effect Instance id? Create a generelized id structure for everything.
    event.classIdB, classIdA would actually just be idA, idB, and then that id will relate to like objectclass/adsoasd98/ or objectinstance/oiasdljkasdna or playerinstance/kj.hasdkhjasd
    ID system for objects vs player vs project, etc? is that smart? Like be able to figure out what anything is based on its id?
  Also like basically effects should not use ClassA and ClassB
  effect Suffix shouldnt really be a thing. Its like just Whats effected, an instance or a class?? or what??

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
STATE ORGANIZATION
--------------------------------------------------------------------------------------

VALIDATION ON ALL FORMS

Seperate more reducers?

useHooks for Unlockable Data and other data... yes actually thats needed isnt it. Because right now like unlockable stuff gets a state.unlockableIntefrfaceIds thing at the bottom

Game Model class? for like getting data from redux so we can get game data with functions
For all these util functions, I need to rethink how utils are done, is there objects we can use? should I turn gameModel, user, lobby, etc all these things into classes? Is that normal inside of redux? should it really be all functional. Where IS THE STATE? What state belongs in my classes and what state belongs in REDUX. React UI = Redux. Phaser UI = OOP
^^^
I think so yes. Basically we can... turn Game Model into a class that has the Scene on it.. yes :)

-----

