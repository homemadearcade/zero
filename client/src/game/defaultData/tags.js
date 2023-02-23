import { TAG_ID_PREFIX } from "../constants"

export const defaultTag = {
  isClassTag: null,
  isSystemTag: null,
  tagId: null,
  name: null,
  tint: null,
  textureId: null
}

export const defaultSystemTag = {
  ...defaultTag,
  isSystemTag: true,
}

function createSystemTag(tagId, name) {
  return {
    ...defaultTag,
    isSystemTag: true,
    tagId,
    name
  }
}

export const backgroundTagId = TAG_ID_PREFIX+'-background'
export const playgroundTagId = TAG_ID_PREFIX+'-playground'
export const playerTagId = TAG_ID_PREFIX+'-player'
export const foregroundTagId = TAG_ID_PREFIX+'-foreground'

export const enemyTagId = TAG_ID_PREFIX+'-enemy'
export const keyTagId = TAG_ID_PREFIX+'-key'
export const doorTagId = TAG_ID_PREFIX+'-door'
export const towerTagId = TAG_ID_PREFIX+'-tower'
export const movingPlatformTagId = TAG_ID_PREFIX+'-movingPlatform'
export const transformIntoTagId = TAG_ID_PREFIX+'-transformInto'
export const transformBackTagId = TAG_ID_PREFIX+'-transformBack'
export const explodeOnDestroyTagId = TAG_ID_PREFIX+'-explodeOnDestroy'

export const initialTags = {
  [enemyTagId]: createSystemTag(enemyTagId, 'Enemy'),
  [doorTagId]: createSystemTag(doorTagId, 'Door'),
  [keyTagId]: createSystemTag(keyTagId, 'Key'),
  [towerTagId]: createSystemTag(towerTagId, 'Tower'),
  [movingPlatformTagId]: createSystemTag(movingPlatformTagId, 'Moving Platform'),
  [transformIntoTagId]: createSystemTag(transformIntoTagId, 'Transform Into'),
  [transformBackTagId]: createSystemTag(transformBackTagId, 'Transform Back'),
  [explodeOnDestroyTagId]: createSystemTag(explodeOnDestroyTagId, 'Explode On Destroy')
}