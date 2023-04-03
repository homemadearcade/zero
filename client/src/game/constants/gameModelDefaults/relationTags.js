import {  RELATION_TAG_ID_PREFIX, } from ".."
import { ENTITY_RELATION_TAGS_IID, RELATION_TAG_GENERAL_IID , DATA_SOURCE_GAME_MODEL_IID, DATA_SOURCE_SYSTEM_IID } from "../../../constants/interfaceIds"
import { defaultEditorInterface } from "../entityModelPropertyDefaults/editorInterface"

export const defaultRelationTag = {
  relationTagInterfaceId: null,
  isRemoved: false,
  isReadOnly: false,
  dataSourceId: DATA_SOURCE_GAME_MODEL_IID,
  relationTagId: null,
  name: null,
  textureTint: '#AAAAAA',
  textureId: null,
  editorInterface: {
    ...defaultEditorInterface
  },
}

function createLibraryTag(relationTagId, name, textureTint, hiddenFromInterfaceIds = {}) {
  return {
    ...defaultRelationTag,
    isReadOnly: true,
    dataSourceId: DATA_SOURCE_SYSTEM_IID,
    relationTagInterfaceId: RELATION_TAG_GENERAL_IID,
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
    [ENTITY_RELATION_TAGS_IID]: true,
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