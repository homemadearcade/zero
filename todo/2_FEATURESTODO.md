--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

RELATIONS v2 - Tags
  Send To Game Overlay Effect
  Better Shorthand for relations

  PROJECTILES/SPAWNED
  Relationship level
    None
    Player
    All
  Collison Level
    None
    Player
    All

LIBRARY
  Be able to open class library classes from some sort of class bucket thing. Start with context menu?
  When creating a class?, when selecting a class? From context menu?

--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
SMALL FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

KEY ISSUES HAVE PERSISTED
  set Interval for keyboard capture issue?
  Can Phaser just register keys without taking them over??
  Do we have to release inputs?

TYPE
  Change .type to .interface. Thats what they are... things that tell you how to interface with the class. Think about other interface options such as movementInterface, controlledMovementInterface, jumpInterface, effectInterface, cutsceneInterface, effectInterface
  REMOVE .type === from any GAME LOGIC, Class.type is PURELY FOR UI
  swap all the objects to correct game layers when it changes so we can use the layers correctly for visibility and for taking pictures...

LAYERS
  Layer textures need to be created when a game is created. FOR SURE. Because I think thats why it was out of sync? I at least want to remove that from being a possibility