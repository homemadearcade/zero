import { COLOR_ADD_IID, CANVAS_IMAGE_VISUAL_TAGS_IID, CHOOSE_TEXTURES_IID, TEXTURE_EDITOR_OPEN_IID, ENTITY_LAYER_IID, ENTITY_VISIBILITY_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [TEXTURE_EDITOR_OPEN_IID]: {
    previewText: 'Draw New Sprite',
  },
  [COLOR_ADD_IID]: {
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