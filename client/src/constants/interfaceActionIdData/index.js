import snapshotData from "./snapshot";
import importData from "./import";
import selectData from "./place";
import editData from './edit'
import drawData from './draw'
import placeData from './place'
import scriptData from './script'

export const interfaceActionIdData = {
  ...snapshotData,
  ...importData,
  ...selectData,
  ...editData,
  ...drawData,
  ...placeData,
  ...scriptData
}