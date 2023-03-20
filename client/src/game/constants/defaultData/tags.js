import { TAG_ID_PREFIX } from "../"

export const TAG_LIBRARY = 'TAG_LIBRARY';
export const TAG_DIALOGUE = 'TAG_DIALOGUE';
export const TAG_CUTSCENE = 'TAG_CUTSCENE';
export const TAG_CLASS = 'TAG_CLASS';

export const tagTypeToDisplayName = {
  TAG_LIBRARY: 'Library',
  TAG_DIALOGUE: 'Dialogue',
  TAG_CUTSCENE: 'Cutscene'
}

export const defaultTag = {
  tagInterfaceType: null,
  isAutogenerated: false,
  tagId: null,
  name: null,
  textureTint: null,
  textureId: null,
  isInterfaceLocked: false,
  isAutoapplied: false
}

function createLibraryTag(tagId, name, textureTint, isAutoapplied) {
  return {
    ...defaultTag,
    isAutogenerated: true,
    tagInterfaceType: TAG_LIBRARY,
    tagId,
    name,
    textureTint,
    isAutoapplied
  }
}

export const backgroundTagId = TAG_ID_PREFIX+'background'
export const playgroundTagId = TAG_ID_PREFIX+'playground'
export const playerTagId = TAG_ID_PREFIX+'player'
export const foregroundTagId = TAG_ID_PREFIX+'foreground'

export const enemyTagId = TAG_ID_PREFIX+'enemy'
export const keyTagId = TAG_ID_PREFIX+'key'
export const doorTagId = TAG_ID_PREFIX+'door'
export const towerTagId = TAG_ID_PREFIX+'tower'
export const movingPlatformTagId = TAG_ID_PREFIX+'movingPlatform'
export const transformIntoTagId = TAG_ID_PREFIX+'transformInto'
export const transformBackTagId = TAG_ID_PREFIX+'transformBack'
export const explodeOnDestroyTagId = TAG_ID_PREFIX+'explodeOnDestroy'

export const initialTags = {
  [playerTagId]: createLibraryTag(towerTagId, 'Player', '#FFFF00', true),
  [playgroundTagId]: createLibraryTag(towerTagId, 'Playground Layer', '#FFFF00', true),
  [enemyTagId]: createLibraryTag(enemyTagId, 'Enemy', '#FF0000'),
  // [towerTagId]: createLibraryTag(towerTagId, 'Tower', '#FF0000'),
  [doorTagId]: createLibraryTag(doorTagId, 'Door', '#FFFFFF'),
  [keyTagId]: createLibraryTag(keyTagId, 'Key', '#FFFFFF'),
  // [movingPlatformTagId]: createLibraryTag(movingPlatformTagId, 'Moving Platform', '#FFFFFF'),
}

// Object.keys(classTypeToDisplayName).forEach((tagInterfaceType) => {
//   initialTags[tagInterfaceType] = createLibraryTag(tagInterfaceType, classTypeToDisplayName[tagInterfaceType], '#FFFF00')
// })