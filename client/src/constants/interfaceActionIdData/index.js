import snapshot from "./snapshot";
import importData from "./import";
import select from "./place";
import edit from './edit'
import draw from './draw'
import place from './place'
import script from './script'
import load from './load'
import play from './play'
import resize from './resize'
import grid from './grid'
import cobrowse from "./cobrowse";
import tool from "./tool";

export const interfaceActionIdData = {
  ...snapshot,
  ...importData,
  ...select,
  ...edit,
  ...draw,
  ...place,
  ...script,
  ...load,
  ...play,
  ...resize,
  ...grid,
  ...cobrowse,
  ...tool
}