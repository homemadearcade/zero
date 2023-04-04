import brushInterfaceIdData from "./brushInterfaceIdData";
import cameraInterfaceIdData from "./cameraInterfaceIdData";
import entityModelInterfaceIdData from "./entityModelInterfaceIdData";
import contextMenuInterfaceIdData from "./contextMenuInterfaceIdData";
import instanceToolbarInterfaceIdData from "./instanceToolbarInterfaceIdData";
import jumpInterfaceIdData from "./jumpInterfaceIdData";
import movementInterfaceIdData from "./movementInterfaceIdData";
import collisionsInterfaceIdData from "./collisionsInterfaceIdData";
import projectileInterfaceIdData from "./projectileInterfaceIdData";
import relationInterfaceIdData from "./relationInterfaceIdData";
import gameViewInterfaceIdData from "./gameViewInterfaceIdData";
import stageInterfaceIdData from "./stageInterfaceIdData";
import cutsceneInterfaceIdData from "./cutsceneInterfaceIdData";
import gameInterfaceIdData from "./gameModelIdData";
import relationTagInterfaceIdData from "./relationTagInterfaceIdData";
import videoInterfaceIdData from "./videoInterfaceIdData";
import selectorInterfaceIdData from "./selectorInterfaceIdData";
import dataSourceInterfaceIdData from "./dataSourceInterfaceIdData";
import graphicsInterfaceIdData from "./graphicsInterfaceIdData";
import entityModelMemberInterfaceIdData from "./entityModelMemberInterfaceIdData";
import dialogInterfaceIdData from "./dialogInterfaceIdData";

export * from './hideableInterfaceIds'

export const interfaceIdData = {
  ...gameViewInterfaceIdData,
  ...jumpInterfaceIdData,
  ...cameraInterfaceIdData,
  ...stageInterfaceIdData,
  ...relationInterfaceIdData,
  ...instanceToolbarInterfaceIdData,
  ...brushInterfaceIdData,
  ...entityModelInterfaceIdData,
  ...collisionsInterfaceIdData,
  ...movementInterfaceIdData,
  ...projectileInterfaceIdData,
  ...contextMenuInterfaceIdData,
  ...cutsceneInterfaceIdData,
  ...gameInterfaceIdData,
  ...relationTagInterfaceIdData,
  ...videoInterfaceIdData,
  ...selectorInterfaceIdData,
  ...dataSourceInterfaceIdData,
  ...graphicsInterfaceIdData,
  ...entityModelMemberInterfaceIdData,
  ...dialogInterfaceIdData
}