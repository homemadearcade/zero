import { SELECT_BRUSH_AID, SELECT_COLOR_AID, SELECT_ENTITY_AID } from "../interfaceActionIds/select";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [SELECT_BRUSH_AID]: {
    name: 'Select Brush',
    arguments: ['brushId']
  },
  [SELECT_COLOR_AID]: {
    name: 'Select Color',
    arguments: ['colorId']
  },
  [SELECT_ENTITY_AID]: {
    name: 'Select Class',
    arguments: ['entityModelId']
  }
}