/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectColliders.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { getOppositeColliderRelationTagId } from '../../../utils/gameUtils';
import { classTypeToDisplayName, tagTypeToDisplayName, RELATION_TAG_CLASS } from '../../constants';
import { CLASS_UNLOCKABLE_IID } from '../../../constants/interfaceIds';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';

const SelectColliders = ({ onChange, relationTagId, formLabel, gameModel }) => {
  const mapTagToOption = (collidingRelationTagId) => {
    const relationTag = gameModel.relationTags[collidingRelationTagId]

    // let relationTagInterfaceType = 'My Tags'

    // if(relationTag.relationTagInterfaceType) {
    //   relationTagInterfaceType = relationTagTypeToDisplayName[relationTag.relationTagInterfaceType]
    // }

    if(relationTag.relationTagInterfaceType === RELATION_TAG_CLASS) {
      const relationTagClass = gameModel.entityClasses[relationTag.relationTagId]
      const interfaceId = relationTagClass.classInterfaceCategory + CLASS_UNLOCKABLE_IID + relationTag.relationTagId
      const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)

      return {
        label: relationTag.name,
        value: collidingRelationTagId,
        textureId: relationTag.textureId,
        textureTint: relationTag.textureTint,
        isRemoved: relationTag.isRemoved || (isObscured && relationTag.interfaceLocked),
        relationTagInterfaceType: classTypeToDisplayName[relationTagClass.classInterfaceCategory]
      }
    }

    // return {
    //   label: tag.name,
    //   value: collidingRelationTagId,
    //   textureTint: tag.textureTint,
    //   isRemoved: tag.isRemoved,
    //   relationTagInterfaceType
    // }
  }
  
  const value = Object.keys(gameModel.collisions).map((collisionId) => {
    const collision = gameModel.collisions[collisionId]
    return collision
  }).map((collision) => {
    return getOppositeColliderRelationTagId(relationTagId, collision)
  }).filter((relationTagId) => {
    return !!relationTagId
  })

  const options = Object.keys(gameModel.entityClasses).
  map(mapTagToOption).
  sort((a, b) => -b.relationTagInterfaceType.localeCompare(a.relationTagInterfaceType))

  return <SelectChipsAuto 
    onChange={(event, relationTagIds) => {
      onChange(event,  relationTagIds)
    }}
    groupBy={option => {
      return classTypeToDisplayName[option.relationTagInterfaceType]
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
