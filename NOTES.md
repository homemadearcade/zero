DATA STRATEGY

INITIAL STATE
Qualities that are initially turned on but can be turned off
Qualities that are initially turned off but can be turned on

EVENT BASED
Qualities that turn on when an event happens
Qualities that are temporarily on while an event is happening

<!-- CONDITION BASED
Qualities that are temporarily on when a game state is true
Qualities that turn on when a game state is true

CONDITION AND EVENT BASED
Qualities that turn on when an event happens AND when a certain game state is true
Qualities that are temporarily on while an event is happening AND a certain game state is true -->


---


Everything is the same class
Camera, Controls are all on the class object, not based on the hero object
... In the future I want everything to be able to be controlled. We need data for that. 

Front end fills in the blanks of every object and hero based on the default model. The question is - is this on a phaser level? Probably not, its probably on the redux store level

The back end only stores what’s different than the default model and will delete any null key -> value pairs given to it

Never send an update with more data than you need

GAME MODEL

Hero
Object ( Game Object )
Class
Brush
World

GAME INSTANCE

Object Instance
Player
Collision Grid


OLD DISCUSSION TOPICS



