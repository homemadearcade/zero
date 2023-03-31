export const PROMPT_ART_STYLE_PIXEL_ART = 'PROMPT_ART_STYLE_PIXEL_ART'
export const PROMPT_ART_STYLE_WATERCOLOR = 'PROMPT_ART_STYLE_WATERCOLOR'
export const PROMPT_ART_STYLE_PENCIL = 'PROMPT_ART_STYLE_PENCIL'
export const PROMPT_ART_STYLE_OIL_PAINTING = 'PROMPT_ART_STYLE_OIL_PAINTING'

export const PROMPT_PERSPECTIVE_SIDE = 'PROMPT_PERSPECTIVE_SIDE'
export const PROMPT_PERSPECTIVE_OVERHEAD = 'PROMPT_PERSPECTIVE_OVERHEAD'
export const PROMPT_PERSPECTIVE_NONE = 'PROMPT_PERSPECTIVE_NONE'

export const DALL_E_SPRITE = 'DALL_E_SPRITE'

export const defaultStylePrompt = PROMPT_ART_STYLE_PIXEL_ART
export const defaultPerspectivePrompt = PROMPT_PERSPECTIVE_NONE

export const defaultDallESession = {
  interfaceCategory: DALL_E_SPRITE
}

export const defaultGenerationPrompt = {
  artStyle: defaultStylePrompt,
  perspective: defaultPerspectivePrompt,
  promptText: '',
  promptId: null,
  textureIds: {},
  imageUrls: {},
}

