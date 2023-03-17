/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectColliders.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { getOppositeColliderTagId } from '../../../utils/gameUtils';
import { classTypeToDisplayName, tagTypeToDisplayName, TAG_CLASS } from '../../constants';
import { CLASS_UNLOCKABLE_IID } from '../../../constants/interfaceIds';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';

const SelectColliders = ({ onChange, tagId, formLabel, gameModel }) => {
  const mapTagToOption = (collidingTagId) => {
    const tag = gameModel.tags[collidingTagId]

    let type = 'My Tags'

    if(tag.type) {
      type = tagTypeToDisplayName[tag.type]
    }

    if(tag.type === TAG_CLASS) {
      const tagClass = gameModel.classes[tag.tagId]
      const interfaceId = tagClass.type + CLASS_UNLOCKABLE_IID + tag.tagId
      const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)

      return {
        label: tag.name,
        value: collidingTagId,
        textureId: tag.textureId,
        tint: tag.color,
        isRemoved: tag.isRemoved || (isObscured && tag.interfaceLocked),
        type: classTypeToDisplayName[tagClass.type]
      }
    }

    return {
      label: tag.name,
      value: collidingTagId,
      tint: tag.color,
      isRemoved: tag.isRemoved,
      type: type
    }
  }
  
  const value = Object.keys(gameModel.collisions).map((collisionId) => {
    const collision = gameModel.collisions[collisionId]
    console.log(collision, collisionId)
    return collision
  }).map((collision) => {
    return getOppositeColliderTagId(tagId, collision)
  }).filter((tagId) => {
    return !!tagId
  })

  const options = Object.keys(gameModel.classes).
  map(mapTagToOption).
  sort((a, b) => -b.type.localeCompare(a.type))

  return <SelectChipsAuto 
    onChange={(event, tagIds) => {
      onChange(event,  tagIds)
    }}
    groupBy={option => {
      return classTypeToDisplayName[option.type]
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
