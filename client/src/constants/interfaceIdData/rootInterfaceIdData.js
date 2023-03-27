import { ADD_COLOR_IID, CANVAS_IMAGE_VISUAL_TAGS_IID, CHANGE_SELECTOR_TAB_IID, CHOOSE_TEXTURES_IID, DRAW_NEW_TEXTURE_IID, ERASER_IID, GAME_VIEW_IID, GRID_VIEW_TOGGLE_IID, HOVER_PREVIEW_IID, LAYER_VISIBILITY_IID, OPEN_CLASS_BOX_IID, SHOW_REMOVED_IID, TOGGLE_ALL_PARAMS_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [LAYER_VISIBILITY_IID]: {
    previewText: 'Hide/Show on Map',
  },
  [TOGGLE_ALL_PARAMS_IID]: {
    adminOnly: true
  },
  [GAME_VIEW_IID]: {},
  [DRAW_NEW_TEXTURE_IID]: {},
  [CHOOSE_TEXTURES_IID]: {},
  [ERASER_IID]: {
    previewText: 'Eraser',
  },
  [ADD_COLOR_IID]: {
    previewText: 'Add Color'
  },
  [SHOW_REMOVED_IID]: {},
  [GRID_VIEW_TOGGLE_IID]: {},
  [OPEN_CLASS_BOX_IID]: {},
  [HOVER_PREVIEW_IID]: {},
  [CHANGE_SELECTOR_TAB_IID]: {},
  [CANVAS_IMAGE_VISUAL_TAGS_IID]: {}
}
