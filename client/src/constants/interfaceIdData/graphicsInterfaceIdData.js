import { ACTION_OPEN } from "../action";
import { ADD_COLOR_IID, CANVAS_IMAGE_VISUAL_TAGS_IID, CHOOSE_TEXTURES_IID, DRAW_NEW_TEXTURE_IID, ENTITY_LAYER_IID, ENTITY_VISIBILITY_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [DRAW_NEW_TEXTURE_IID]: {
    previewText: 'Draw New Sprite',
    clickType: ACTION_OPEN
  },
  [ADD_COLOR_IID]: {
    previewText: 'Add Color'
  },
  [CHOOSE_TEXTURES_IID]: {
    previewText: 'Choose Sprites'
  },
  [CANVAS_IMAGE_VISUAL_TAGS_IID]: {},
  [ENTITY_LAYER_IID]: {
    
  },
  [ENTITY_VISIBILITY_IID]: {
    adminOnly: true,
    previewText: 'Hide/Show'
  },
}