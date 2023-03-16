/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectTag.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { classTypeToDisplayName } from '../../constants';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { CLASS_UNLOCKABLE_IID } from '../../../constants/interfaceIds';

const SelectTag = ({ noClassTags, onChange, disabled, value, formLabel, gameModel }) => {

  const mapTagToOption = (classId) => {
    const tag = gameModel.tags[classId]

    let type = 'My Tags'

    if(tag.isLibraryTag) {
      type = 'Library'
    }

    if(tag.isClassTag) {
      const tagClass = gameModel.classes[tag.tagId]
      const interfaceId = tagClass.type + CLASS_UNLOCKABLE_IID + tag.tagId
      const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)

      return {
        label: tag.name,
        value: classId,
        textureId: tag.textureId,
        tint: tag.color,
        isRemoved: tag.isRemoved || (isObscured && tag.interfaceLocked) || noClassTags,
        type: classTypeToDisplayName[tagClass.type]
      }
    }

    return {
      label: tag.name,
      value: classId,
      tint: tag.color,
      isRemoved: tag.isRemoved,
      type: type
    }
  }

  const options = Object.keys(gameModel.tags).map(mapTagToOption)

  options.sort((a, b) => -b.type.localeCompare(a.type))

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, descriptors) => {
      onChange(event,  descriptors)
    }}
    groupBy={option => {
      return option.type
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
