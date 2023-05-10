/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectColliders.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { getOppositeColliderRelationTagId } from '../../../utils/gameUtils';
import { entityModelClassToDisplayName } from '../../constants';
import { RELATION_TAG_ENTITY_IID } from '../../../constants/interfaceIds';

const SelectColliders = ({ onChange, relationTagId, formLabel, gameModel: { gameModel } }) => {
  const mapTagToOption = (collidingRelationTagId) => {
    const relationTag = gameModel.relationTags[collidingRelationTagId]

    if(relationTag.relationTagIID === RELATION_TAG_ENTITY_IID) {
      const relationTagEntity = gameModel.entityModels[relationTag.relationTagId]
      if(!relationTagEntity) {
        console.error('missing entity for relation tag id', collidingRelationTagId)
        return {
          title: relationTag.name,
          value: collidingRelationTagId,
          isRemoved: true,
        }
      }

      return {
        title: relationTag.name,
        value: collidingRelationTagId,
        textureId: relationTag.textureId,
        textureTint: relationTag.textureTint,
        isRemoved: relationTag.isRemoved,
        relationTagIID: entityModelClassToDisplayName[relationTagEntity.entityIID]
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
    return -b.relationTagIID.localeCompare(a.relationTagIID)
  })

  return <SelectChipsAuto 
    onChange={(event, relationTagIds) => {
      onChange(event,  relationTagIds)
    }}
    groupBy={option => {
      return option.relationTagIID
    }}
    hideRemoved
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectColliders);
