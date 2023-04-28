import { 
  COLOR_ADD_IID, CANVAS_IMAGE_VISUAL_TAGS_IID, 
  CHOOSE_SYSTEM_TEXTURES_IID, TEXTURE_EDITOR_OPEN_IID, 
  ENTITY_LAYER_IID, ENTITY_INVISIBLE_IID, ENTITY_VISUAL_TAGS_IID, CHOOSE_GAME_TEXTURES_IID,
 } from "../interfaceIds";
 import { DRAW_IGID } from "../interfaceIdGroups";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [TEXTURE_EDITOR_OPEN_IID]: {
    name: 'Draw New Sprite Button',
    interfaceGroupId: DRAW_IGID
  },
  [COLOR_ADD_IID]: {
    previewText: 'Add Color',
    name: 'Add Color Button',
    interfaceGroupId: DRAW_IGID
  },
  [CHOOSE_SYSTEM_TEXTURES_IID]: {
    name: 'Select System Sprites Area',
    interfaceGroupId: DRAW_IGID
  },
  [CHOOSE_GAME_TEXTURES_IID]: {
    name: 'Select My Sprites Area',
    isDefaultUnlocked: true,
    interfaceGroupId: DRAW_IGID
  },
  [ENTITY_VISUAL_TAGS_IID]: {
    name: 'Select Visual Tags for Class',
    interfaceGroupId: DRAW_IGID
  },
  [CANVAS_IMAGE_VISUAL_TAGS_IID]: {
    name: 'Select Visual Tags for Sprite',
    interfaceGroupId: DRAW_IGID
  },
  [ENTITY_LAYER_IID]: {
    interfaceGroupId: DRAW_IGID
  },
  [ENTITY_INVISIBLE_IID]: {
    adminOnly: true,
    interfaceGroupId: DRAW_IGID
    // previewText: ''
  },
}