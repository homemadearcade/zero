import { DATA_SOURCE_CORE_LIBRARY, DATA_SOURCE_GAME_MODEL, RELATION_TAG_ID_PREFIX, RELATION_TAG_LIBRARY } from ".."
import { CLASS_RELATION_TAGS_IID } from "../../../constants/interfaceIds"
import { defaultEditorInterface } from "../entityModelPropertyDefaults/editorInterface"

export const defaultRelationTag = {
  relationTagInterfaceId: null,
  dataSource: DATA_SOURCE_GAME_MODEL,
  relationTagId: null,
  name: null,
  textureTint: null,
  textureId: null,
  editorInterface: {
    ...defaultEditorInterface
  },
}

function createLibraryTag(relationTagId, name, textureTint, hiddenFromInterfaceIds = {}) {
  return {
    ...defaultRelationTag,
    dataSource: DATA_SOURCE_CORE_LIBRARY,
    relationTagInterfaceId: RELATION_TAG_LIBRARY,
    relationTagId,
    name,
    textureTint,
    editorInterface: {
      ...defaultRelationTag.editorInterface,
      hiddenFromInterfaceIds: {
        ...defaultRelationTag.editorInterface.hiddenFromInterfaceIds,
        ...hiddenFromInterfaceIds
      }
    }
  }
}

export const playerRelationTagId = RELATION_TAG_ID_PREFIX+'player'

// export const playgroundRelationTagId = RELATION_TAG_ID_PREFIX+'playground'

// export const enemyRelationTagId = RELATION_TAG_ID_PREFIX+'enemy'
// export const keyRelationTagId = RELATION_TAG_ID_PREFIX+'key'
// export const doorRelationTagId = RELATION_TAG_ID_PREFIX+'door'
// export const towerRelationTagId = RELATION_TAG_ID_PREFIX+'tower'
// export const movingPlatformRelationTagId = RELATION_TAG_ID_PREFIX+'movingPlatform'
// export const transformIntoRelationTagId = RELATION_TAG_ID_PREFIX+'transformInto'
// export const transformBackRelationTagId = RELATION_TAG_ID_PREFIX+'transformBack'
// export const explodeOnDestroyRelationTagId = RELATION_TAG_ID_PREFIX+'explodeOnDestroy'

export const gameOverOnTouchTagId = RELATION_TAG_ID_PREFIX+'gameOverOnTouch'
export const gameOverWhenAllDestroyedTagId = RELATION_TAG_ID_PREFIX+'gameOverWhenAllDestroyed'
export const winGameOnTouchTagId = RELATION_TAG_ID_PREFIX+'winGameOnTouch'
export const winGameWhenAllDestroyedTagId = RELATION_TAG_ID_PREFIX+'winGameWhenAllDestroyed'

export const initialTags = {
  [playerRelationTagId]: createLibraryTag(playerRelationTagId, 'Player', '#FFFF00', {
    [CLASS_RELATION_TAGS_IID]: true,
  }),
  [gameOverOnTouchTagId]: createLibraryTag(gameOverOnTouchTagId, 'Game Over on Touch', '#FF0000'),
  [gameOverWhenAllDestroyedTagId]: createLibraryTag(gameOverWhenAllDestroyedTagId, 'Game Over when all Destroyed', '#FF0000'),
  [winGameOnTouchTagId]: createLibraryTag(winGameOnTouchTagId, 'Win Game on Touch', '#FF0000'),
  [winGameWhenAllDestroyedTagId]: createLibraryTag(winGameWhenAllDestroyedTagId, 'Win Game when all Destroyed', '#FF0000'),

  // [playgroundRelationTagId]: createLibraryTag(playgroundRelationTagId, 'Playground Layer', '#FFFF00', true),
  // [enemyRelationTagId]: createLibraryTag(enemyRelationTagId, 'Enemy', '#FF0000'),
  // // [towerRelationTagId]: createLibraryTag(towerRelationTagId, 'Tower', '#FF0000'),
  // [doorRelationTagId]: createLibraryTag(doorRelationTagId, 'Door', '#FFFFFF'),
  // [keyRelationTagId]: createLibraryTag(keyRelationTagId, 'Key', '#FFFFFF'),
  // [movingPlatformRelationTagId]: createLibraryTag(movingPlatformRelationTagId, 'Moving Platform', '#FFFFFF'),
}

// Object.keys(entityModelTypeToDisplayName).forEach((relationTagInterfaceId) => {
//   initialTags[relationTagInterfaceId] = createLibraryTag(relationTagInterfaceId, entityModelTypeToDisplayName[relationTagInterfaceId], '#FFFF00')
// })