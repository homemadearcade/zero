Add Tags to CanvasImage
Solve choices chain
Finish DallEGenerator

MODEL
  descriptor -> visualTags
  tags -> relationTags

  metadata.interfaceColor -> Theme property on the game
  
  only load spritesheets that are added for 'play game' mode

  ZONE/CAMERA/SPAWN UPGRADE
    Outline Class ( for eraser and entityInstance, and camerapreview? )
    Zones have eraser classe
    Player View should be a zone
    Another Zone for the whole world. It is NEVER visible. isDeeplyHidden
    Remote Editors are all also zones too
  MAKE HERO CAMERA A ZONE. The zone selected for the heros camera can be resized and the camera will change based on that. That zone gets a tag. Player Camera
  Run effects inside of the Spawn bar when you have selected gravity

BETTER CANVAS_IMAGE/LAYER SYSTEM
  LAYERS property on ArcadeGame
    A layer either has colliders or it doesnt. A layer is given a image id. 
    Layers is an object on GameModel. A Layer has a image Id. You can look up the depth  a brush/eraser is supposed to be on by finding its Layer object. The layer object also
    undo canvas stuff doesnt work now between stages... Codrawing system needs to undo by texture Id not ... canvas id?

STAGES HAVE LAYERS, AS MANY AS THEYD LIKE
  Background, 
  Foreground
  Playground
  You can make as many of these as youd like! Its per stage
  Stages have a layers property and it grabs the data from the class