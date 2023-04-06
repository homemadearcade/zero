/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EntityList.scss';
import EntityItem from '../EntityItem/EntityItem';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import CobrowsingAccordianList from '../../cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { entityModelTypeToDisplayName, entityModelTypeToContainerIID } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { BASIC_ENTITY_IID, EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, getSelectEntityFromEntityType, NPC_ENTITY_IID, ENTITY_BOX_OPEN_IID, PLAYER_ENTITY_IID, POWERUP_ENTITY_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID, ZONE_ENTITY_IID } from '../../../constants/interfaceIds';
import { openEntityBoxDialog } from '../../../store/actions/game/gameSelectorActions';
import { sortByLastEditedDate } from '../../../utils/editorUtils';
import Icon from '../../../ui/Icon/Icon';
import EntityModelAdd from '../EntityModelAdd/EntityModelAdd';
import { IMPORT_DATA_SOURCE_AID, PLACE_ENTITY_AID } from '../../../constants/interfaceActionIds';

const ENTITY_MAX = 16

const EntityList = ({
  gameModel: { gameModel },
  gameViewEditor: {layerInvisibility},
  openEntityBoxDialog,
}) => {
  const entityModels = gameModel?.entityModels

  if(!entityModels) {
    return null
  }

  const renderEntityItem = (entityModelType) =>  (currentEntityModelId, i) => {
    const el = <EntityItem key={i} entityModelId={currentEntityModelId}/>
    return <Unlockable interfaceId={getSelectEntityFromEntityType(entityModelType)}>
      {el}
    </Unlockable>
  }

  function renderEntityBoxButton(entityModelType){
    return <>
      <Unlockable interfaceId={ENTITY_BOX_OPEN_IID}>
      <Button size="fit" startIcon={<Icon icon='faArrowPointer'/>} className="EntityList__more" onClick={() => {
        openEntityBoxDialog(PLACE_ENTITY_AID, entityModelType)
      }}>
        More
      </Button>
    </Unlockable>
    <Unlockable interfaceId={ENTITY_BOX_OPEN_IID}>
      <Button size="fit" startIcon={<Icon icon='faBoxArchive'/>} className="EntityList__more" onClick={() => {
        openEntityBoxDialog(IMPORT_DATA_SOURCE_AID, entityModelType)
      }}>
        Import
      </Button>
      </Unlockable>
   </>
  }

  const filterEntityModels = (entityModelType) => (currentEntityModelId) => {
    const currentEntityModel = entityModels[currentEntityModelId]
    if(currentEntityModel.isRemoved) return 
    if(currentEntityModel.editorInterface.hiddenFromInterfaceIds[SELECTOR_ENTITY_BY_INTERFACE_ID_IID]) return false
    if(!currentEntityModel.isImported) return false 
    if(currentEntityModel.entityIID === entityModelType) {
      return true
    }
    return false
  }

  const accordians = []
  const hiddenOpacity = 0.5

  const entityModelTypes = [PLAYER_ENTITY_IID, NPC_ENTITY_IID, BASIC_ENTITY_IID, POWERUP_ENTITY_IID, ZONE_ENTITY_IID]
  entityModelTypes.forEach((entityIID) => {
    const releventEntityModels = Object.keys(entityModels).
      filter(filterEntityModels(entityIID)).
      sort(sortByLastEditedDate(entityModels)).
      map(renderEntityItem(entityIID)).filter((item) => !!item).slice(0, ENTITY_MAX -1)
    
    releventEntityModels.push(<EntityModelAdd addEntityDialogInterfaceId={EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID} entityIID={entityIID}>
      {(onClick) => {
        return <Button className="EntityList__add" onClick={onClick}>
          +
        </Button>
      }}
    </EntityModelAdd>)

    accordians.push({
      interfaceId: entityModelTypeToContainerIID[entityIID],
      sx: layerInvisibility[entityIID] ? {opacity: hiddenOpacity} : {},
      title: <>
        <Typography component="div" variant="subtitle1">{entityModelTypeToDisplayName[entityIID]}</Typography>
      </>,
      body: <>
        <BorderedGrid
          maxItems={ENTITY_MAX} 
          height="3.3em"
          width="3.95em"
          items={releventEntityModels}
        />
        <div className="EntityList__tools">
          <LayerVisibility layerId={entityIID} />
          {renderEntityBoxButton(entityIID)}
        </div>
      </>
    })

  })

  return <div className="EntityList">
    <CobrowsingAccordianList
      interfaceGroupId="SelectorColumns"
      accordians={accordians}
    />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
  gameViewEditor: state.gameViewEditor,
  gameSelector: state.gameSelector,
  // for the unlockability to show up
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { openEntityBoxDialog }),
)(EntityList);
