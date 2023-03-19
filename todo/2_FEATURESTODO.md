--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

TYPE
  Change .type to .interface. Thats what they are... things that tell you how to interface with the class. Think about other interface options such as movementInterface, controlledMovementInterface, jumpInterface, effectInterface, cutsceneInterface, effectInterface
  REMOVE .type === from any GAME LOGIC, Class.type is PURELY FOR UI
  swap all the objects to correct game layers when it changes so we can use the layers correctly for visibility and for taking pictures...

RELATIONS
  PROJECTILES/SPAWNED
    Relationship level
      None
      Player
      All
    Collison Level
      None
      Player
      All

--

LIBRARY
  Turn library on and off ( both in Selects and in the ClassList )
  Easy system for saving library classes and relations
  Be able to open class library classes from some sort of class bucket thing. Start with context menu?
  When creating a class?, when selecting a class? From context menu?

STEPS UPDATE
  Prompts, Next Steps...
  A bit more automated is needed..
  Skippable option in a step
  Collapsible steps??

LOBBY UPDATE
  Lobby Join Sound
  Lobby Member Count in /lobbys page
  Prevent someone from joining a lobby if they are already in one

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
