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

const SelectEntityModel = ({ hideEntityModelsIds = [], onChange, disabled, value, interfaceId, formLabel, gameModel: { gameModel }, entityModelClass, gameSelector: { selectorInterfaceListInvisibility } }) => {
  const dataSourceFilterInterfaceId = interfaceId || SELECT_ENTITY_MODEL_IID

  const mapEntityToOption = (entityModelId) => {
    const entityModel = gameModel.entityModels[entityModelId]

    const isDataSourceInvisible = selectorInterfaceListInvisibility[dataSourceFilterInterfaceId][entityModel.dataSourceIID]
    const isRemovedInvisible = entityModel.isRemoved && selectorInterfaceListInvisibility[dataSourceFilterInterfaceId][IS_DATA_REMOVED_IID]

    let isRemoved = isDataSourceInvisible || isRemovedInvisible || entityModel.editorInterface.notSelectableInInterface|| !entityModel.entityClassIID

    if(entityModelClass) {
      if(entityModel.entityClassIID !== entityModelClass) {
        isRemoved = true
      }
    }

    if(hideEntityModelsIds) {
      if(hideEntityModelsIds.includes(entityModelId)) {
        isRemoved = true
      }
    }

    if(!entityModel.entityClassIID) {
      console.error("missing entityClassIID for entityId", entityModel.entityModelId)
    }

    return {
      title: entityModel.name,
      value: entityModelId,
      textureId: entityModel.graphics.textureId,
      textureTint: entityModel.graphics.textureTint,
      isRemoved,
      entityClassIID: entityModel.entityClassIID
    }
  }

  const options = Object.keys(gameModel.entityModels).map(mapEntityToOption)

  options.sort((a, b) => -b.entityClassIID?.localeCompare(a.entityClassIID))

  return <div className="SelectEntityModel">
    <SelectChipsAuto 
      disabled={disabled}
      onChange={(event, visualTags) => {
        onChange(event,  visualTags)
      }}
      groupBy={option => {
        return entityModelClassToDisplayName[option.entityClassIID]
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
            <DataSourceVisibilityMenu interfaceId={dataSourceFilterInterfaceId} />
          </MenuList>
        }}/>
    </Unlockable>
  </div>
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel,
    gameSelector: state.gameSelector,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectEntityModel);
