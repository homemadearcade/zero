/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationTag.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { classTypeToDisplayName, relationTagTypeToDisplayName, RELATION_TAG_CLASS } from '../../constants';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { CLASS_UNLOCKABLE_IID } from '../../../constants/interfaceIds';

const SelectRelationTag = ({ removeClassTags, hideAutoapplied, onChange, disabled, value, formLabel, gameModel }) => {

  const mapTagToOption = (entityClassId) => {
    const relationTag = gameModel.relationTags[entityClassId]

    let relationTagInterfaceType = 'My Tags'

    if(relationTag.relationTagInterfaceType) {
      relationTagInterfaceType = relationTagTypeToDisplayName[relationTag.relationTagInterfaceType]
    }

    const isRemoved = relationTag.isRemoved || (hideAutoapplied && relationTag.isAutoapplied)

    if(relationTag.relationTagInterfaceType === RELATION_TAG_CLASS) {
      const relationTagClass = gameModel.entityClasses[relationTag.relationTagId]
      const interfaceId = relationTagClass.classInterfaceCategory + CLASS_UNLOCKABLE_IID + relationTag.relationTagId
      const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)

      return {
        label: relationTag.name,
        value: entityClassId,
        textureId: relationTag.textureId,
        textureTint: relationTag.textureTint,
        isRemoved: (isObscured && relationTag.interfaceLocked) || removeClassTags || isRemoved,
        relationTagInterfaceType: classTypeToDisplayName[relationTagClass.classInterfaceCategory],
      }
    }

    return {
      label: relationTag.name,
      value: entityClassId,
      textureTint: relationTag.textureTint,
      isRemoved,
      relationTagInterfaceType
    }
  }

  const options = Object.keys(gameModel.relationTags).map(mapTagToOption)

  options.sort((a, b) => {
   return  -b.relationTagInterfaceType.localeCompare(a.relationTagInterfaceType)
  })

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, visualTags) => {
      onChange(event,  visualTags)
    }}
    groupBy={option => {
      return option.relationTagInterfaceType
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
)(SelectRelationTag);
