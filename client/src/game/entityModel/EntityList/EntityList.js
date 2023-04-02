/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EntityList.scss';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import EntityItem from '../EntityItem/EntityItem';
import EditEntityGraphics from '../EditEntityGraphics/EditEntityGraphics';
import { openEditEntityGraphics, openCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import CobrowsingAccordianList from '../../cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { PLAYER_ENTITY_IID, NPC_ENTITY_IID, BASIC_ENTITY_IID, ZONE_ENTITY_IID, stageDefaultTypeProperties, POWERUP_ENTITY_IID, defaultPowerupEntity, defaultZoneEntity, defaultBasicEntity, defaultPlayerEntity, defaultNpcEntity, IS_DATA_REMOVED, DATA_SOURCE_USER_LIBRARY, DATA_SOURCE_GAME_MODEL, entityModelTypeToDisplayName, entityModelTypeToContainerIID } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { BASIC_ENTITY_ADD_IID, BASIC_ENTITY_CONTAINER_IID,  getSelectEntityFromEntityType, NPC_ENTITY_ADD_IID, NPC_ENTITY_CONTAINER_IID, OPEN_ENTITY_BOX_IID, PLAYER_ENTITY_ADD_IID, PLAYER_ENTITY_CONTAINER_IID, POWERUP_ENTITY_ADD_IID, POWERUP_ENTITY_CONTAINER_IID, SELECTOR_ENTITY_BY_CLASS_IID, ZONE_ENTITY_ADD_IID, ZONE_ENTITY_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openEntityBoxModal } from '../../../store/actions/game/gameSelectorActions';
import { sortByLastEditedDate } from '../../../utils/editorUtils';
import { addEntityModelToLibrary } from '../../../store/actions/library/entityModelLibraryActions';
import Icon from '../../../ui/Icon/Icon';
import EntityModelAdd from '../EntityModelAdd/EntityModelAdd';

const CLASS_MAX = 16

const EntityList = ({
  gameModel: { gameModel, currentStageId },
  gameFormEditor: { isEditEntityGraphicsOpen },
  gameSelector: { selectorClassInvisibility },
  editGameModel,
  openEditEntityGraphics,
  gameViewEditor: {layerInvisibility},
  openEntityBoxModal,
  addEntityModelToLibrary, 
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
    return <Unlockable interfaceId={OPEN_ENTITY_BOX_IID}>
      <Button size="fit" startIcon={<Icon icon='faBoxArchive'/>} className="EntityList__more" onClick={() => {
        openEntityBoxModal(entityModelType)
      }}>
        More
      </Button>
    </Unlockable>
  }

  const filterEntityModels = (entityModelType) => (currentEntityModelId) => {
    const currentEntityModel = entityModels[currentEntityModelId]
    if(currentEntityModel.isRemoved) return 
    if(currentEntityModel.editorInterface.hiddenFromInterfaceIds[SELECTOR_ENTITY_BY_CLASS_IID]) return false
    if(currentEntityModel.dataSource !== DATA_SOURCE_GAME_MODEL && !currentEntityModel.isImported) return false 
    if(currentEntityModel.entityInterfaceId === entityModelType) {
      return true
    }
    return false
  }

  const accordians = []
  const hiddenOpacity = 0.5

  const entityModelTypes = [PLAYER_ENTITY_IID, NPC_ENTITY_IID, BASIC_ENTITY_IID, POWERUP_ENTITY_IID, ZONE_ENTITY_IID]
  entityModelTypes.forEach((entityInterfaceId) => {
    const releventEntityModels = Object.keys(entityModels).
      filter(filterEntityModels(entityInterfaceId)).
      sort(sortByLastEditedDate(entityModels)).
      map(renderEntityItem(entityInterfaceId)).filter((item) => !!item).slice(0, CLASS_MAX -1)
    
    releventEntityModels.push(<EntityModelAdd parentInterfaceId={SELECTOR_ENTITY_BY_CLASS_IID} entityInterfaceId={entityInterfaceId}>
      {(onClick) => {
        return <Button className="EntityList__add" onClick={onClick}>
          +
        </Button>
      }}
    </EntityModelAdd>)

    accordians.push({
      interfaceId: entityModelTypeToContainerIID[entityInterfaceId],
      sx: layerInvisibility[entityInterfaceId] ? {opacity: hiddenOpacity} : {},
      title: <>
        <Typography component="div" variant="subtitle1">{entityModelTypeToDisplayName[entityInterfaceId]}</Typography>
      </>,
      body: <>
        <BorderedGrid
          maxItems={CLASS_MAX} 
          height="3.3em"
          width="3.95em"
          items={releventEntityModels}
        />
        <div className="EntityList__tools">
          <LayerVisibility layerId={entityInterfaceId} />
          {renderEntityBoxButton(entityInterfaceId)}
        </div>
      </>
    })

  })

  return <div className="EntityList">
    <CobrowsingAccordianList
      interfaceGroupId="SelectorColumns"
      accordians={accordians}
    />
    {isEditEntityGraphicsOpen === SELECTOR_ENTITY_BY_CLASS_IID && <EditEntityGraphics 
      onComplete={(entityModel) => {
        editGameModel({
          entityModels: {
            [entityModel.entityModelId] : {
              // must be a spread operator here because when this is opened it has a lot of properties brought in from some defaults
              ...entityModel,
              isNew: false,
              // graphics: entityModel.graphics,
              // editorInterface: entityModel.editorInterface,
              // visualTags: entityModel.visualTags,
              // name: entityModel.name,
            }
          }
        })
      }}
  />}
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
  connect(mapStateToProps, { editGameModel, openEditEntityGraphics, openCreateCutscene, openEntityBoxModal, addEntityModelToLibrary }),
)(EntityList);
