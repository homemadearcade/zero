/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEntityModel.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { entityModelClassToDisplayName  } from '../../constants';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { IS_DATA_REMOVED_IID, SELECTOR_MORE_IID, SELECT_ENTITY_MODEL_IID } from '../../../constants/interfaceIds';
import Icon from '../../../ui/Icon/Icon';
import { MenuItem, MenuList } from '@mui/material';
import DataSourceVisibilityMenu from '../../../ui/connected/DataSourceVisibilityMenu/DataSourceVisibilityMenu';
import CobrowsingMenuIconButton from '../../cobrowsing/CobrowsingMenuIconButton/CobrowsingMenuIconButton';

const SelectEntity = ({ onChange, disabled, value, interfaceId, formLabel, gameModel, entityModelClass, gameSelector: { selectorInterfaceListInvisibility } }) => {

  const mapEntityToOption = (entityModelId) => {
    const entityModel = gameModel.entityModels[entityModelId]

    const isDataSourceInvisible = selectorInterfaceListInvisibility[SELECT_ENTITY_MODEL_IID][entityModel.dataSourceIID]
    const isRemovedInvisible = entityModel.isRemoved && selectorInterfaceListInvisibility[SELECT_ENTITY_MODEL_IID][IS_DATA_REMOVED_IID]

    const isRemoved = isDataSourceInvisible || isRemovedInvisible || entityModel.editorInterface.hiddenFromIDs[interfaceId]

    return {
      title: entityModel.name,
      value: entityModelId,
      textureId: entityModel.graphics.textureId,
      textureTint: entityModel.graphics.textureTint,
      isRemoved,
      entityIID: entityModel.entityIID
    }
  }

  const options = Object.keys(gameModel.entityModels).filter((entityModelId) => {
    const entityModel = gameModel.entityModels[entityModelId]
    // if(entityModel.isRemoved) return false
    if(!entityModelClass) return true
    if(entityModelClass === entityModel.entityIID) return true
    return false
  }).map(mapEntityToOption)

  options.sort((a, b) => -b.entityIID.localeCompare(a.entityIID))

  return <div className="SelectEntityModel">
    <SelectChipsAuto 
      disabled={disabled}
      onChange={(event, visualTags) => {
        onChange(event,  visualTags)
      }}
      groupBy={option => {
        return entityModelClassToDisplayName[option.entityIID]
      }}
      hideRemoved
      formLabel={formLabel}
      value={value}
      options={options}
    />
    <Unlockable interfaceId={SELECTOR_MORE_IID} className="SelectEntityModel__more-menu-icon">
      <CobrowsingMenuIconButton interfaceId={interfaceId} icon={<Icon icon='faEllipsis'/>} 
        menu={() => {
          return <MenuList>
            <MenuItem key="visible in dropdown" dense>Visible in Dropdown:</MenuItem>
            <DataSourceVisibilityMenu interfaceId={SELECT_ENTITY_MODEL_IID} />
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
