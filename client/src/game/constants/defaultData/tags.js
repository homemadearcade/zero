import { TAG_ID_PREFIX } from "../"

export const defaultTag = {
  isClassTag: null,
  isLibraryTag: null,
  isAutomaticTag: null,
  tagId: null,
  name: null,
  tint: null,
  textureId: null
}

export const defaultSystemTag = {
  ...defaultTag,
  isLibraryTag: true,
}

function createLibraryTag(tagId, name) {
  return {
    ...defaultTag,
    isLibraryTag: true,
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
  [enemyTagId]: createLibraryTag(enemyTagId, 'Enemy'),
  [doorTagId]: createLibraryTag(doorTagId, 'Door'),
  [keyTagId]: createLibraryTag(keyTagId, 'Key'),
  [towerTagId]: createLibraryTag(towerTagId, 'Tower'),
  [movingPlatformTagId]: createLibraryTag(movingPlatformTagId, 'Moving Platform'),
  [transformIntoTagId]: createLibraryTag(transformIntoTagId, 'Transform Into'),
  [transformBackTagId]: createLibraryTag(transformBackTagId, 'Transform Back'),
  [explodeOnDestroyTagId]: createLibraryTag(explodeOnDestroyTagId, 'Explode On Destroy')
}