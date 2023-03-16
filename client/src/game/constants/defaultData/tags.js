import { TAG_ID_PREFIX } from "../"

export const defaultTag = {
  isClassTag: null,
  isLibraryTag: null,
  isAutomaticTag: null,
  tagId: null,
  name: null,
  color: null,
  textureId: null,
  isInterfaceLocked: false,
}

export const defaultLibraryTag = {
  ...defaultTag,
  isLibraryTag: true,
  isAutomaticTag: true
}

export const defaultClassTag = {
  ...defaultTag,
  isClassTag: true,
  isAutomaticTag: true
}

function createLibraryTag(tagId, name, color) {
  return {
    ...defaultLibraryTag,
    tagId,
    name,
    color
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
  [playerTagId]: createLibraryTag(towerTagId, 'Player', '#FFFF00'),
  [playgroundTagId]: createLibraryTag(towerTagId, 'Playground Layer', '#FFFF00'),
  [enemyTagId]: createLibraryTag(enemyTagId, 'Enemy', '#FF0000'),
  [towerTagId]: createLibraryTag(towerTagId, 'Tower', '#FF0000'),
  [doorTagId]: createLibraryTag(doorTagId, 'Door', '#FFFFFF'),
  [keyTagId]: createLibraryTag(keyTagId, 'Key', '#FFFFFF'),
  [movingPlatformTagId]: createLibraryTag(movingPlatformTagId, 'Moving Platform', '#FFFFFF'),
  [transformIntoTagId]: createLibraryTag(transformIntoTagId, 'Transform Into', '#FFFFFF'),
  [transformBackTagId]: createLibraryTag(transformBackTagId, 'Transform Back', '#FFFFFF'),
  [explodeOnDestroyTagId]: createLibraryTag(explodeOnDestroyTagId, 'Explode On Destroy', '#FFFFFF')
}