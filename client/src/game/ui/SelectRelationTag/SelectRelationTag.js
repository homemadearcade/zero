/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationTag.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { entityModelClassToDisplayName, relationTagTypeToDisplayName } from '../../constants';
import { DATA_SOURCE_GAME_MODEL_IID, IS_DATA_REMOVED_IID, RELATION_TAG_ENTITY_IID, SELECTOR_MORE_IID, SELECT_RELATION_TAG_IID } from '../../../constants/interfaceIds';
import DataSourceVisibilityMenu from '../../../ui/connected/DataSourceVisibilityMenu/DataSourceVisibilityMenu';
import Icon from '../../../ui/Icon/Icon';
import { MenuItem, MenuList } from '@mui/material';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import CobrowsingMenuIconButton from '../../cobrowsing/CobrowsingMenuIconButton/CobrowsingMenuIconButton';

const SelectRelationTag = ({ removeEntityTags, interfaceId, onChange, disabled, value, formLabel, gameModel, gameSelector: { selectorInterfaceListInvisibility } }) => {
  const dataSourceFilterInterfaceId = interfaceId || SELECT_RELATION_TAG_IID

  const mapTagToOption = (relationTagId) => {
    const relationTag = gameModel.relationTags[relationTagId]

    let relationTagIID = 'My Tags'

    if(relationTag.relationTagIID) {
      relationTagIID = relationTagTypeToDisplayName[relationTag.relationTagIID]
    }
    
    const isDataSourceInvisible = selectorInterfaceListInvisibility[dataSourceFilterInterfaceId][relationTag.dataSourceIID]
    const isRemovedInvisible = relationTag.isRemoved && selectorInterfaceListInvisibility[dataSourceFilterInterfaceId][IS_DATA_REMOVED_IID]

    const isRemoved = isDataSourceInvisible || isRemovedInvisible || relationTag.editorInterface.hiddenFromIDs[interfaceId]

    if(relationTag.relationTagIID === RELATION_TAG_ENTITY_IID) {
      const relationTagEntity = gameModel.entityModels[relationTag.relationTagId]
      if(!relationTagEntity) {
        console.error('missing entity for relation tag id', relationTagId)
        return {
          title: relationTag.name,
          value: relationTagId,
          isRemoved: true,
        }
      }
      const isImportInvisible = relationTagEntity.isImported && relationTagEntity.dataSourceIID !== DATA_SOURCE_GAME_MODEL_IID

      return {
        title: relationTag.name,
        value: relationTagId,
        textureId: relationTag.textureId,
        textureTint: relationTag.textureTint,
        isRemoved: removeEntityTags || isRemoved || isImportInvisible,
        relationTagIID: entityModelClassToDisplayName[relationTagEntity.entityIID],
      }
    }

    return {
      title: relationTag.name,
      value: relationTagId,
      textureTint: relationTag.textureTint,
      isRemoved,
      relationTagIID
    }
  }

  const options = Object.keys(gameModel.relationTags).map(mapTagToOption)

  options.sort((a, b) => {
    if(!a.relationTagIID) {
      return 1
    }
    if(!b.relationTagIID) {
      return -1
    }
    return  -b.relationTagIID.localeCompare(a.relationTagIID)
  })

  return <div className="SelectRelationTag">
    <SelectChipsAuto 
      disabled={disabled}
      onChange={(event, visualTags) => {
        onChange(event,  visualTags)
      }}
      groupBy={option => {
        return option.relationTagIID
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
            <DataSourceVisibilityMenu interfaceId={dataSourceFilterInterfaceId} />
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
