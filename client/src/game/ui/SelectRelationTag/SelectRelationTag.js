/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationTag.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { entityModelTypeToDisplayName, relationTagTypeToDisplayName } from '../../constants';
import { DATA_SOURCE_GAME_MODEL_IID, IS_DATA_REMOVED_IID, RELATION_TAG_ENTITY_IID, SELECTOR_MORE_IID, SELECT_RELATION_TAG_IID } from '../../../constants/interfaceIds';
import DataSourceVisibilityMenu from '../../../ui/connected/DataSourceVisibilityMenu/DataSourceVisibilityMenu';
import Icon from '../../../ui/Icon/Icon';
import { MenuItem, MenuList } from '@mui/material';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import CobrowsingMenuIconButton from '../../cobrowsing/CobrowsingMenuIconButton/CobrowsingMenuIconButton';

const SelectRelationTag = ({ removeEntityTags, interfaceId, onChange, disabled, value, formLabel, gameModel, gameSelector: { selectorInterfaceListInvisibility } }) => {

  const mapTagToOption = (relationTagId) => {
    const relationTag = gameModel.relationTags[relationTagId]

    let relationTagInterfaceId = 'My Tags'

    if(relationTag.relationTagInterfaceId) {
      relationTagInterfaceId = relationTagTypeToDisplayName[relationTag.relationTagInterfaceId]
    }
    
    const isDataSourceInvisible = selectorInterfaceListInvisibility[SELECT_RELATION_TAG_IID][relationTag.dataSource]
    const isRemovedInvisible = relationTag.isRemoved && selectorInterfaceListInvisibility[SELECT_RELATION_TAG_IID][IS_DATA_REMOVED_IID]

    const isRemoved = isDataSourceInvisible || isRemovedInvisible || relationTag.editorInterface.hiddenFromInterfaceIds[interfaceId]

    if(relationTag.relationTagInterfaceId === RELATION_TAG_ENTITY_IID) {
      const relationTagEntity = gameModel.entityModels[relationTag.relationTagId]
      const isImportInvisible = relationTagEntity.isImported && relationTagEntity.dataSource !== DATA_SOURCE_GAME_MODEL_IID

      return {
        label: relationTag.name,
        value: relationTagId,
        textureId: relationTag.textureId,
        textureTint: relationTag.textureTint,
        isRemoved: removeEntityTags || isRemoved || isImportInvisible,
        relationTagInterfaceId: entityModelTypeToDisplayName[relationTagEntity.entityInterfaceId],
      }
    }

    return {
      label: relationTag.name,
      value: relationTagId,
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
      <CobrowsingMenuIconButton interfaceId={interfaceId} icon={<Icon icon='faEllipsis'/>} 
        menu={() => {
          return <MenuList>
            <MenuItem key="visible in dropdown" dense>Visible in Dropdown:</MenuItem>
            <DataSourceVisibilityMenu interfaceId={SELECT_RELATION_TAG_IID} />
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
