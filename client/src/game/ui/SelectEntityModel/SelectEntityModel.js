/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEntityModel.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { entityModelTypeToDisplayName, IS_DATA_LOCKED, IS_DATA_REMOVED } from '../../constants';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CLASS_UNLOCKABLE_IID, SELECTOR_MORE_IID, SELECT_ENTITY_MODEL_IID, SELECT_RELATION_TAG_IID } from '../../../constants/interfaceIds';
import Icon from '../../../ui/Icon/Icon';
import { MenuItem, MenuList } from '@mui/material';
import DataSourceVisibilityMenu from '../../../ui/connected/DataSourceVisibilityMenu/DataSourceVisibilityMenu';
import CobrowsingMenuIconButton from '../../cobrowsing/CobrowsingMenuIconButton/CobrowsingMenuIconButton';
import { getInterfaceIdData } from '../../../utils';

const SelectEntity = ({ onChange, disabled, value, interfaceId, formLabel, gameModel, entityModelType, gameSelector: { selectorClassInvisibility } }) => {

  const mapEntityToOption = (entityModelId) => {
    const entityModel = gameModel.entityModels[entityModelId]

    const isDataSourceInvisible = selectorClassInvisibility[SELECT_ENTITY_MODEL_IID][entityModel.dataSource]
    const isRemovedInvisible = entityModel.isRemoved && selectorClassInvisibility[SELECT_ENTITY_MODEL_IID][IS_DATA_REMOVED]
    const interfaceId = entityModel.entityInterfaceId + '/' + CLASS_UNLOCKABLE_IID + '/' + entityModel.entityModelId
    const { isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceId)
    const isLockedInvisible = entityModel.editorInterface.requiresUnlocking && isObscured && selectorClassInvisibility[SELECT_RELATION_TAG_IID][IS_DATA_LOCKED]

    const isRemoved = isDataSourceInvisible || isLockedInvisible || isRemovedInvisible || entityModel.editorInterface.hiddenFromInterfaceIds[interfaceId]

    return {
      label: entityModel.name,
      value: entityModelId,
      textureId: entityModel.graphics.textureId,
      textureTint: entityModel.graphics.textureTint,
      isRemoved,
      entityInterfaceId: entityModel.entityInterfaceId
    }
  }

  const options = Object.keys(gameModel.entityModels).filter((entityModelId) => {
    const entityModel = gameModel.entityModels[entityModelId]
    // if(entityModel.isRemoved) return false
    if(!entityModelType) return true
    if(entityModelType === entityModel.entityInterfaceId) return true
    return false
  }).map(mapEntityToOption)

  options.sort((a, b) => -b.entityInterfaceId.localeCompare(a.entityInterfaceId))

  return <div className="SelectEntityModel">
    <SelectChipsAuto 
      disabled={disabled}
      onChange={(event, visualTags) => {
        onChange(event,  visualTags)
      }}
      groupBy={option => {
        return entityModelTypeToDisplayName[option.entityInterfaceId]
      }}
      hideRemoved
      formLabel={formLabel}
      value={value}
      options={options}
    />
    <Unlockable interfaceId={SELECTOR_MORE_IID} className="SelectEntityModel__more-menu-icon">
      <CobrowsingMenuIconButton interfaceId={SELECT_ENTITY_MODEL_IID} icon={<Icon icon='faEllipsis'/>} 
        menu={() => {
          return <MenuList>
            <MenuItem key="visible in dropdown" dense>Visible in Dropdown:</MenuItem>
            <DataSourceVisibilityMenu selectorClass={SELECT_ENTITY_MODEL_IID} />
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
)(SelectEntity);
