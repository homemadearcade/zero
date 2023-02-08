import { brushInterfaceIds } from "./brushInterfaceIds";
import { cameraInterfaceIds } from "./cameraInterfaceIds";
import { classInterfaceIds } from "./classInterfaceIds";
import { contextMenuInterfaceIds } from "./contextMenuInterfaceIds";
import { gameInstanceInterfaceIds } from "./gameInstanceInterfaceIds";
import { jumpInterfaceIds } from "./jumpInterfaceIds";
import { movementInterfaceIds } from "./movementInterfaceIds";
import { physicsInterfaceIds } from "./physicsInterfaceIds";
import { projectileInterfaceIds } from "./projectileInterfaceIds";
import { relationInterfaceIds } from "./relationInterfaceIds";
import { stageInterfaceIds } from "./stageInterfaceIds";

export const interfaceIds = {
  "layerVisibility": {},
  "toggleAllParams": {},
  "gameView": {},
  "drawNewSprite": {},
  "chooseSprites": {},
  "eraser": {},
  "addColor": {},

  ...jumpInterfaceIds,
  ...cameraInterfaceIds,
  ...stageInterfaceIds,
  ...relationInterfaceIds,
  ...gameInstanceInterfaceIds,
  ...brushInterfaceIds,
  ...classInterfaceIds,
  ...physicsInterfaceIds,
  ...movementInterfaceIds,
  ...projectileInterfaceIds,
  ...contextMenuInterfaceIds,

}
