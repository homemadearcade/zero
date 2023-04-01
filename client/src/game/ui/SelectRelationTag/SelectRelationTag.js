/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationTag.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { entityModelTypeToDisplayName, IS_DATA_REMOVED, relationTagTypeToDisplayName, RELATION_TAG_ABSTRACT_IID, RELATION_TAG_ENTITY_IID } from '../../constants';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { CLASS_UNLOCKABLE_IID, SELECTOR_MORE_IID, SELECT_RELATION_TAG_IID } from '../../../constants/interfaceIds';
import MenuIconButton from '../../../ui/MenuIconButton/MenuIconButton';
import DataSourceVisibilityMenu from '../../../ui/connected/DataSourceVisibilityMenu/DataSourceVisibilityMenu';
import Icon from '../../../ui/Icon/Icon';
import { MenuItem, MenuList } from '@mui/material';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';

const SelectRelationTag = ({ removeEntityTags, interfaceId, onChange, disabled, value, formLabel, gameModel, gameSelector: { selectorClassInvisibility } }) => {

  const mapTagToOption = (entityModelId) => {
    const relationTag = gameModel.relationTags[entityModelId]

    let relationTagInterfaceId = 'My Tags'

    if(relationTag.relationTagInterfaceId) {
      relationTagInterfaceId = relationTagTypeToDisplayName[relationTag.relationTagInterfaceId]
    }
    
    const isDataSourceInvisible = selectorClassInvisibility[RELATION_TAG_ABSTRACT_IID][relationTag.dataSource]
    const isRemovedInvisible = relationTag.isRemoved && selectorClassInvisibility[RELATION_TAG_ABSTRACT_IID][IS_DATA_REMOVED]

    const isRemoved = isDataSourceInvisible || isRemovedInvisible || relationTag.editorInterface.hiddenFromInterfaceIds[interfaceId]

    if(relationTag.relationTagInterfaceId === RELATION_TAG_ENTITY_IID) {
      const relationTagEntity = gameModel.entityModels[relationTag.relationTagId]
      const interfaceId = relationTagEntity.entityInterfaceId + CLASS_UNLOCKABLE_IID + relationTag.relationTagId
      const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)

      return {
        label: relationTag.name,
        value: entityModelId,
        textureId: relationTag.textureId,
        textureTint: relationTag.textureTint,
        isRemoved: (isObscured && relationTag.editorInterface.requiresUnlocking) || removeEntityTags || isRemoved,
        relationTagInterfaceId: entityModelTypeToDisplayName[relationTagEntity.entityInterfaceId],
      }
    }

    return {
      label: relationTag.name,
      value: entityModelId,
      textureTint: relationTag.textureTint,
      isRemoved,
      relationTagInterfaceId
    }
  }

  const options = Object.keys(gameModel.relationTags).map(mapTagToOption)

  options.sort((a, b) => {
    return  -b.relationTagInterfaceId.localeCompare(a.relationTagInterfaceId)
  })

  return <div className="SelectRelationTag">
    <SelectChipsAuto 
      disabled={disabled}
      onChange={(event, visualTags) => {
        onChange(event,  visualTags)
      }}
      groupBy={option => {
        return option.relationTagInterfaceId
      }}
      hideRemoved
      formLabel={formLabel}
      value={value}
      options={options}
    />
    <Unlockable className="SelectRelationTag__more-menu-icon" interfaceId={SELECTOR_MORE_IID}>
      <MenuIconButton icon={<Icon icon='faEllipsis'/>} 
        menu={() => {
          return <MenuList>
            <MenuItem key="visible in dropdown" dense divider>Visible in Dropdown:</MenuItem>
            <DataSourceVisibilityMenu selectorClass={SELECT_RELATION_TAG_IID} />
          </MenuList>
        }}/>
    </Unlockable>
  </div>
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel.gameModel,
    gameSelector: state.gameSelector,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectRelationTag);
