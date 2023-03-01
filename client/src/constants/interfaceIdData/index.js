import brushInterfaceIdData from "./brushInterfaceIdData";
import cameraInterfaceIdData from "./cameraInterfaceIdData";
import classInterfaceIdData from "./classInterfaceIdData";
import contextMenuInterfaceIdData from "./contextMenuInterfaceIdData";
import instanceToolbarInterfaceIdData from "./instanceToolbarInterfaceIdData";
import jumpInterfaceIdData from "./jumpInterfaceIdData";
import movementInterfaceIdData from "./movementInterfaceIdData";
import physicsInterfaceIdData from "./physicsInterfaceIdData";
import projectileInterfaceIdData from "./projectileInterfaceIdData";
import relationInterfaceIdData from "./relationInterfaceIdData";
import rootInterfaceIdData from "./rootInterfaceIdData";
import stageInterfaceIdData from "./stageInterfaceIdData";
import dialogueInterfaceIdData from "./dialogueInterfaceIdData";
import gameInterfaceIdData from "./gameInterfaceIdData";

export const interfaceIdData = {
  ...rootInterfaceIdData,
  ...jumpInterfaceIdData,
  ...cameraInterfaceIdData,
  ...stageInterfaceIdData,
  ...relationInterfaceIdData,
  ...instanceToolbarInterfaceIdData,
  ...brushInterfaceIdData,
  ...classInterfaceIdData,
  ...physicsInterfaceIdData,
  ...movementInterfaceIdData,
  ...projectileInterfaceIdData,
  ...contextMenuInterfaceIdData,
  ...dialogueInterfaceIdData,
  ...gameInterfaceIdData
}