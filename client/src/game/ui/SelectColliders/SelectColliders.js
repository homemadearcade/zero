/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectColliders.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { getOppositeColliderRelationTagId } from '../../../utils/gameUtils';
import { entityModelTypeToDisplayName, RELATION_TAG_ENTITY_IID } from '../../constants';
import { CLASS_UNLOCKABLE_IID } from '../../../constants/interfaceIds';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';

const SelectColliders = ({ onChange, relationTagId, formLabel, gameModel }) => {
  const mapTagToOption = (collidingRelationTagId) => {
    const relationTag = gameModel.relationTags[collidingRelationTagId]

    if(relationTag.relationTagInterfaceId === RELATION_TAG_ENTITY_IID) {
      const relationTagEntity = gameModel.entityModels[relationTag.relationTagId]
      const interfaceId = relationTagEntity.entityInterfaceId + CLASS_UNLOCKABLE_IID + relationTag.relationTagId
      const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)

      return {
        label: relationTag.name,
        value: collidingRelationTagId,
        textureId: relationTag.textureId,
        textureTint: relationTag.textureTint,
        isRemoved: relationTag.isRemoved || (isObscured && relationTag.editorInterface.requiresUnlocking),
        relationTagInterfaceId: entityModelTypeToDisplayName[relationTagEntity.entityInterfaceId]
      }
    }
  }
  
  const value = Object.keys(gameModel.collisions).map((collisionId) => {
    const collision = gameModel.collisions[collisionId]
    return collision
  }).map((collision) => {
    return getOppositeColliderRelationTagId(relationTagId, collision)
  }).filter((relationTagId) => {
    return !!relationTagId
  })


  const options = Object.keys(gameModel.relationTags).
  map(mapTagToOption).filter((option) => {
    return !!option
  }).
  sort((a, b) => {
    return -b.relationTagInterfaceId.localeCompare(a.relationTagInterfaceId)
  })

  return <SelectChipsAuto 
    onChange={(event, relationTagIds) => {
      onChange(event,  relationTagIds)
    }}
    groupBy={option => {
      return option.relationTagInterfaceId
    }}
    hideRemoved
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectColliders);
