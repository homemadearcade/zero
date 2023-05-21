import {  RELATION_TAG_DID, } from ".."
import { ENTITY_RELATION_TAGS_IID, RELATION_TAG_GENERAL_IID , DATA_SOURCE_GAME_MODEL_IID, DATA_SOURCE_SYSTEM_IID } from "../../../constants/interfaceIds"
import { defaultEditorInterface } from "../entityModelPropertyDefaults/editorInterface"

export const defaultRelationTag = {
  relationTagIID: RELATION_TAG_GENERAL_IID,
  isRemoved: false,
  isReadOnly: false,
  dataSourceIID: DATA_SOURCE_GAME_MODEL_IID,
  relationTagId: null,
  name: null,
  icon: null,
  description: null,
  textureTint: '#AAAAAA',
  textureId: null,
  editorInterface: {
    ...defaultEditorInterface
  },
}

function createLibraryTag(relationTagId, name, textureTint, hiddenFromIDs = {}) {
  return {
    ...defaultRelationTag,
    isReadOnly: true,
    dataSourceIID: DATA_SOURCE_SYSTEM_IID,
    relationTagIID: RELATION_TAG_GENERAL_IID,
    relationTagId,
    name,
    textureTint,
    editorInterface: {
      ...defaultRelationTag.editorInterface,
      hiddenFromIDs: {
        ...defaultRelationTag.editorInterface.hiddenFromIDs,
        ...hiddenFromIDs
      }
    }
  }
}

export const playerRelationTagId = RELATION_TAG_DID+'player'

// export const playgroundRelationTagId = RELATION_TAG_DID+'playground'

// export const enemyRelationTagId = RELATION_TAG_DID+'enemy'
// export const keyRelationTagId = RELATION_TAG_DID+'key'
// export const doorRelationTagId = RELATION_TAG_DID+'door'
// export const towerRelationTagId = RELATION_TAG_DID+'tower'
// export const movingPlatformRelationTagId = RELATION_TAG_DID+'movingPlatform'
// export const transformIntoRelationTagId = RELATION_TAG_DID+'transformInto'
// export const transformBackRelationTagId = RELATION_TAG_DID+'transformBack'
// export const explodeOnDestroyRelationTagId = RELATION_TAG_DID+'explodeOnDestroy'

// export const endGameOnTouchTagId = RELATION_TAG_DID+'endGameOnTouch'
// export const endGameWhenAllDestroyedTagId = RELATION_TAG_DID+'endGameWhenAllDestroyed'

export const initialTags = {
  [playerRelationTagId]: createLibraryTag(playerRelationTagId, 'Player', '#FFFF00', {
    [ENTITY_RELATION_TAGS_IID]: true,
  }),
  // [endGameOnTouchTagId]: createLibraryTag(endGameOnTouchTagId, 'End Game on Touch', '#FF0000'),
  // [endGameWhenAllDestroyedTagId]: createLibraryTag(endGameWhenAllDestroyedTagId, 'End Game when all Destroyed', '#FF0000'),

  // [playgroundRelationTagId]: createLibraryTag(playgroundRelationTagId, 'Playground Layer', '#FFFF00', true),
  // [enemyRelationTagId]: createLibraryTag(enemyRelationTagId, 'Enemy', '#FF0000'),
  // // [towerRelationTagId]: createLibraryTag(towerRelationTagId, 'Tower', '#FF0000'),
  // [doorRelationTagId]: createLibraryTag(doorRelationTagId, 'Door', '#FFFFFF'),
  // [keyRelationTagId]: createLibraryTag(keyRelationTagId, 'Key', '#FFFFFF'),
  // [movingPlatformRelationTagId]: createLibraryTag(movingPlatformRelationTagId, 'Moving Platform', '#FFFFFF'),
}

// Object.keys(entityModelClassToDisplayName).forEach((relationTagIID) => {
//   initialTags[relationTagIID] = createLibraryTag(relationTagIID, entityModelClassToDisplayName[relationTagIID], '#FFFF00')
// })