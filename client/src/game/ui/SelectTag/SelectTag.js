/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectTag.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { classTypeToDisplayName, tagTypeToDisplayName, TAG_CLASS } from '../../constants';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { CLASS_UNLOCKABLE_IID } from '../../../constants/interfaceIds';

const SelectTag = ({ hideClassTags, hideAutoapplied, onChange, disabled, value, formLabel, gameModel }) => {

  const mapTagToOption = (entityClassId) => {
    const tag = gameModel.tags[entityClassId]

    let tagInterfaceType = 'My Tags'

    if(tag.tagInterfaceType) {
      tagInterfaceType = tagTypeToDisplayName[tag.tagInterfaceType]
    }

    const isRemoved = tag.isRemoved || (hideAutoapplied && tag.isAutoapplied)

    if(tag.tagInterfaceType === TAG_CLASS) {
      const tagClass = gameModel.entityClasses[tag.tagId]
      const interfaceId = tagClass.classInterfaceCategory + CLASS_UNLOCKABLE_IID + tag.tagId
      const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)

      return {
        label: tag.name,
        value: entityClassId,
        textureId: tag.textureId,
        textureTint: tag.textureTint,
        isRemoved: (isObscured && tag.interfaceLocked) || hideClassTags || isRemoved,
        tagInterfaceType: classTypeToDisplayName[tagClass.classInterfaceCategory],
      }
    }

    return {
      label: tag.name,
      value: entityClassId,
      textureTint: tag.textureTint,
      isRemoved,
      tagInterfaceType
    }
  }

  const options = Object.keys(gameModel.tags).map(mapTagToOption)

  options.sort((a, b) => {
   return  -b.tagInterfaceType.localeCompare(a.tagInterfaceType)
  })

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, descriptors) => {
      onChange(event,  descriptors)
    }}
    groupBy={option => {
      return option.tagInterfaceType
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
)(SelectTag);
