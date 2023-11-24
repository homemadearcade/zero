import snapshot from "./snapshot";
import importData from "./import";
import select from "./place";
import edit from './edit'
import draw from './draw'
import place from './place'
import script from './write'
import load from './load'
import play from './play'
import resize from './resize'
import grid from './grid'
import cobrowse from "./cobrowse";
import tool from "./tool";
import sprite from "./sprite";
import stage from "./stage";

export const interfaceActionData = {
  ...sprite,
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
  ...tool,
  ...stage,
}