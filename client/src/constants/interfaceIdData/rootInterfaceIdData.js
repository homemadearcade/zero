import { ADD_COLOR_IID, CANVAS_IMAGE_VISUAL_TAGS_IID, CHOOSE_TEXTURES_IID, DRAW_NEW_TEXTURE_IID, ERASER_IID, GAME_VIEW_IID, GRID_VIEW_TOGGLE_IID, 
 } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [GAME_VIEW_IID]: {},
  [DRAW_NEW_TEXTURE_IID]: {},
  [CHOOSE_TEXTURES_IID]: {},
  [ERASER_IID]: {
    previewText: 'Eraser',
  },
  [ADD_COLOR_IID]: {
    previewText: 'Add Color'
  },
  [GRID_VIEW_TOGGLE_IID]: {},
  [CANVAS_IMAGE_VISUAL_TAGS_IID]: {}
}
