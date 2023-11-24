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
import { entityModelClassToDisplayName, entityModelClassToContainerIID } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { BASIC_ENTITY_IID, EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, getSelectEntityFromEntityType, NPC_ENTITY_IID, ENTITY_BOX_OPEN_IID, PLAYER_ENTITY_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID, ZONE_ENTITY_IID, PROJECTILE_ENTITY_IID } from '../../../constants/interfaceIds';
import { openEntityBoxDialog } from '../../../store/actions/game/gameSelectorActions';
import { sortByLastEditedDate } from '../../../utils/editorUtils';
import Icon from '../../../ui/Icon/Icon';
import EntityModelAdd from '../EntityModelAdd/EntityModelAdd';
import { IMPORT_DATA_SOURCE_AID, PLACE_ENTITY_AID } from '../../../constants/interfaceActionIds';

const ENTITY_MAX = 16

const EntityList = ({
  gameModel: { gameModel },
  gameRoomInstance: { gameRoomInstance: { currentStageId } },
  gameViewEditor: {layerInvisibility},
  openEntityBoxDialog,
}) => {
  const entityModels = gameModel?.entityModels

  if(!entityModels) {
    return null
  }

  const renderEntityItem = (entityModelClassIID) =>  (currentEntityModelId, i) => {
    const el = <EntityItem key={i} entityModelId={currentEntityModelId}/>
    return <Unlockable interfaceId={getSelectEntityFromEntityType(entityModelClassIID)}>
      {el}
    </Unlockable>
  }

  function renderEntityBoxButton(entityModelClassIID){
    return <>
      <Unlockable interfaceId={ENTITY_BOX_OPEN_IID}>
      <Button size="fit" startIcon={<Icon icon='faArrowPointer'/>} className="EntityList__more" onClick={() => {
        openEntityBoxDialog(PLACE_ENTITY_AID, entityModelClassIID)
      }}>
        More
      </Button>
    </Unlockable>
    <Unlockable interfaceId={ENTITY_BOX_OPEN_IID}>
      <Button size="fit" startIcon={<Icon icon='faBoxArchive'/>} className="EntityList__more" onClick={() => {
        openEntityBoxDialog(IMPORT_DATA_SOURCE_AID, entityModelClassIID)
      }}>
        Import
      </Button>
      </Unlockable>
   </>
  }

  const filterEntityModels = (entityModelClassIID) => (currentEntityModelId) => {
    const currentEntityModel = entityModels[currentEntityModelId]
    if(currentEntityModel.isRemoved) return 
    if(currentEntityModel.editorInterface.notSelectableInInterface) return false
    if(!currentEntityModel.importedStageIds[currentStageId]) return false 
    if(currentEntityModel.entityClassIID === entityModelClassIID) {
      return true
    }
    return false
  }

  const accordians = []
  const hiddenOpacity = 0.5

  const entityModelClasss = [PLAYER_ENTITY_IID, NPC_ENTITY_IID, BASIC_ENTITY_IID, ZONE_ENTITY_IID, PROJECTILE_ENTITY_IID]
  entityModelClasss.forEach((entityClassIID) => {
    const releventEntityModels = Object.keys(entityModels).
      filter(filterEntityModels(entityClassIID)).
      sort(sortByLastEditedDate(entityModels)).
      map(renderEntityItem(entityClassIID)).filter((item) => !!item).slice(0, ENTITY_MAX -1)
    
    releventEntityModels.push(<EntityModelAdd addEntityDialogIID={EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID} entityClassIID={entityClassIID}>
      {(onClick) => {
        return <Button className="EntityList__add" onClick={onClick}>
          +
        </Button>
      }}
    </EntityModelAdd>)

    accordians.push({
      interfaceId: entityModelClassToContainerIID[entityClassIID],
      sx: layerInvisibility[entityClassIID] ? {opacity: hiddenOpacity} : {},
      title: <>
        <Typography component="div" variant="subtitle1">{entityModelClassToDisplayName[entityClassIID]}</Typography>
      </>,
      body: <>
        <BorderedGrid
          maxItems={ENTITY_MAX} 
          height="3.3em"
          width="3.95em"
          items={releventEntityModels}
        />
        <div className="EntityList__tools">
          <LayerVisibility layerId={entityClassIID} />
          {renderEntityBoxButton(entityClassIID)}
        </div>
      </>
    })

  })

  return <div className="EntityList">
    {/* <div className='EntityList__title'>
      <Icon icon="faChessPawn"/>
      Classes
    </div> */}
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
  gameRoomInstance: state.gameRoomInstance,
  // for the unlockability to show up
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { openEntityBoxDialog }),
)(EntityList);
