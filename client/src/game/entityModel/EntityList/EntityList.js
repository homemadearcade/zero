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
import { PLAYER_ENTITY_IID, NPC_ENTITY_IID, BASIC_ENTITY_IID, ZONE_ENTITY_IID, stageDefaultTypeProperties, POWERUP_ENTITY_IID, defaultPowerupEntity, defaultZoneEntity, defaultBasicEntity, defaultPlayerEntity, defaultNpcEntity, IS_DATA_REMOVED } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { BASIC_ENTITY_ADD_IID, BASIC_ENTITY_CONTAINER_IID, CLASS_UNLOCKABLE_IID, getSelectEntityFromEntityType, NPC_ENTITY_ADD_IID, NPC_ENTITY_CONTAINER_IID, OPEN_CLASS_BOX_IID, PLAYER_ENTITY_ADD_IID, PLAYER_ENTITY_CONTAINER_IID, POWERUP_ENTITY_ADD_IID, POWERUP_ENTITY_CONTAINER_IID, SELECTOR_ENTITY_BY_CLASS_IID, ZONE_ENTITY_ADD_IID, ZONE_ENTITY_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openEntityBoxModal } from '../../../store/actions/game/gameSelectorActions';
import { sortByLastEditedDate } from '../../../utils/editorUtils';
import SelectorMoreMenu from '../../selector/SelectorMoreMenu/SelectorMoreMenu';

const CLASS_MAX = 16

const EntityList = ({
  gameModel: { gameModel, currentStageId },
  gameFormEditor: { isEditEntityGraphicsOpen },
  gameSelector: { selectorClassInvisibility },
  editGameModel,
  openEditEntityGraphics,
  gameViewEditor: {layerInvisibility},
  openEntityBoxModal
}) => {
  const entityModels = gameModel?.entityModels

  if(!entityModels) {
    return null
  }

  function isDataSourceInvisible(entityModel) {
    const dataSource = entityModel.dataSource
    const selectorClass = entityModel.entityInterfaceId
    return selectorClassInvisibility[selectorClass][dataSource]
  }
  function isRemovedDataInvisible(entityModel) {
    const isRemoved = entityModel.isRemoved
    const selectorClass = entityModel.entityInterfaceId
    return isRemoved && selectorClassInvisibility[selectorClass][IS_DATA_REMOVED]
  }

  const renderEntityItem = (entityModelType) =>  (currentEntityModelId, i) => {
    const el = <EntityItem key={i} entityModelId={currentEntityModelId}/>
    const currentEntityModel = entityModels[currentEntityModelId]
    if(currentEntityModel.editorInterface.requiresUnlocking) {

      // if this is uncommented thats great but it has extra fireworks in cobrowsing...

      // const interfaceIdToUnlock = entityModelType + '/' + CLASS_UNLOCKABLE_IID + '/' + currentEntityModel.entityModelId
      // const {isObscured } = getInterfaceIdData(CLASS_UNLOCKABLE_IID, interfaceIdToUnlock)
      // if(isObscured) return null
      return <Unlockable interfaceIdPrefix={entityModelType} interfaceId={CLASS_UNLOCKABLE_IID} interfaceIdExtension={currentEntityModel.entityModelId}>
        {el}
      </Unlockable>
    } else {
      return <Unlockable interfaceId={getSelectEntityFromEntityType(entityModelType)}>
        {el}
      </Unlockable>
    }
  }

  function renderEntityBoxButton(entityModelType){
    return <Unlockable interfaceId={OPEN_CLASS_BOX_IID}>
      <Button size="fit" className="EntityList__more" onClick={() => {
        openEntityBoxModal(entityModelType)
      }}>
        More
      </Button>
    </Unlockable>
  }

  const filterEntityModels = (entityModelType) => (currentEntityModelId) => {
    const currentEntityModel = entityModels[currentEntityModelId]
    if(currentEntityModel.editorInterface.hiddenFromInterfaceIds[SELECTOR_ENTITY_BY_CLASS_IID]) return false
    if(currentEntityModel.entityInterfaceId === entityModelType) {
      if(isDataSourceInvisible(currentEntityModel)) return false
      if(isRemovedDataInvisible(currentEntityModel)) return false
      return true
    }
    return false
  }

  function addDefaultValuesToPlayerEntity(entityModel) {
    const defaultType = gameModel.stages[currentStageId].defaultType
    if(!defaultType) return entityModel
    const defaultTypeProperties = stageDefaultTypeProperties[defaultType]
    const defaultEntityModel = entityModels[defaultTypeProperties].playerEntityModelId
    return {...entityModel, ...defaultEntityModel}
  }

  const playerEntityModels = Object.keys(entityModels).
    filter(filterEntityModels(PLAYER_ENTITY_IID)).
    sort(sortByLastEditedDate(entityModels)).
    map(renderEntityItem(PLAYER_ENTITY_IID)).filter((item) => !!item).slice(0, CLASS_MAX -1)
  
  playerEntityModels.push(<Unlockable interfaceId={PLAYER_ENTITY_ADD_IID}>
    <Button size="fit" 
      onClick={() => {
        openEditEntityGraphics(addDefaultValuesToPlayerEntity({...defaultPlayerEntity}))
      }}>
      +
    </Button>
  </Unlockable>)

  const npcModels = Object.keys(entityModels).
    filter(filterEntityModels(NPC_ENTITY_IID)).
    sort(sortByLastEditedDate(entityModels)).
    map(renderEntityItem(NPC_ENTITY_IID)).filter((item) => !!item).slice(0, CLASS_MAX -1)

  npcModels.push(<Unlockable interfaceId={NPC_ENTITY_ADD_IID}>
    <Button size="fit" className="EntityList__add" onClick={() => {
      openEditEntityGraphics(defaultNpcEntity)
    }}>
      +
    </Button>
  </Unlockable>)

  const basicModels = Object.keys(entityModels).
    filter(filterEntityModels(BASIC_ENTITY_IID)).
    sort(sortByLastEditedDate(entityModels)).
    map(renderEntityItem(BASIC_ENTITY_IID)).filter((item) => !!item).slice(0, CLASS_MAX -1)


  basicModels.push(<Unlockable interfaceId={BASIC_ENTITY_ADD_IID}>
    <Button size="fit" className="EntityList__add" onClick={() => {
      openEditEntityGraphics(defaultBasicEntity)
    }}>
      +
    </Button>
  </Unlockable>)

  const powerupModels = Object.keys(entityModels).
    filter(filterEntityModels(POWERUP_ENTITY_IID)).
    sort(sortByLastEditedDate(entityModels)).
    map(renderEntityItem(POWERUP_ENTITY_IID)).filter((item) => !!item).slice(0, CLASS_MAX -1)


  powerupModels.push(<Unlockable interfaceId={POWERUP_ENTITY_ADD_IID}>
    <Button size="fit" className="EntityList__add" onClick={() => {
      openEditEntityGraphics(defaultPowerupEntity)
    }}>
      +
    </Button>
  </Unlockable>)

  const zoneModels = Object.keys(entityModels).
    filter(filterEntityModels(ZONE_ENTITY_IID)).
    sort(sortByLastEditedDate(entityModels)).
    map(renderEntityItem(ZONE_ENTITY_IID)).filter((item) => !!item).
    slice(0, CLASS_MAX -1)

  zoneModels.push(<Unlockable interfaceId={ZONE_ENTITY_ADD_IID}>
    <Button size="fit" className="EntityList__add" onClick={() => {
      openEditEntityGraphics(defaultZoneEntity)
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  const hiddenOpacity = 0.5
  accordians.push({
    id: 'players',
    interfaceId: PLAYER_ENTITY_CONTAINER_IID,
    sx: layerInvisibility[PLAYER_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Players</Typography>
    </>,
    moreMenu: <SelectorMoreMenu selectorClass={PLAYER_ENTITY_IID} />,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="3.3em"
        width="3.95em"
        items={playerEntityModels}
      />
      <div className="EntityList__tools">
        <LayerVisibility layerId={PLAYER_ENTITY_IID} />
        {Object.keys(playerEntityModels).length >= CLASS_MAX && renderEntityBoxButton(PLAYER_ENTITY_IID)}
      </div>
    </>
  })

  accordians.push({
    id: 'NPCs',
    interfaceId: NPC_ENTITY_CONTAINER_IID,
    sx: layerInvisibility[NPC_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">NPCs</Typography>
    </>,
    moreMenu: <SelectorMoreMenu selectorClass={NPC_ENTITY_IID} />,
    body: <>
      <BorderedGrid
      maxItems={CLASS_MAX} 
      height="3.3em"
        width="3.95em"
      items={npcModels}
      />
      <div className="EntityList__tools">
        <LayerVisibility layerId={NPC_ENTITY_IID} />
        {Object.keys(npcModels).length >= CLASS_MAX && renderEntityBoxButton(NPC_ENTITY_IID)}
      </div>
    </>
  })

  accordians.push({
    id: 'objects',
    interfaceId: BASIC_ENTITY_CONTAINER_IID,
    sx: layerInvisibility[BASIC_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Objects</Typography>
    </>,
    moreMenu: <SelectorMoreMenu selectorClass={BASIC_ENTITY_IID} />,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="3.3em"
        width="3.95em"
        items={basicModels}
      />
      <div className="EntityList__tools">
        <LayerVisibility layerId={BASIC_ENTITY_IID} />
        {Object.keys(basicModels).length >= CLASS_MAX && renderEntityBoxButton(BASIC_ENTITY_IID)}
      </div>
    </>
  })

  accordians.push({
    id: 'powerups',
    interfaceId: POWERUP_ENTITY_CONTAINER_IID,
    sx: layerInvisibility[POWERUP_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Power Ups</Typography>
    </>,
    moreMenu: <SelectorMoreMenu selectorClass={POWERUP_ENTITY_IID} />,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="3.3em"
        width="3.95em"
        items={powerupModels}
      />
      <div className="EntityList__tools">
        <LayerVisibility layerId={POWERUP_ENTITY_IID} />
        {Object.keys(powerupModels).length >= CLASS_MAX && renderEntityBoxButton(POWERUP_ENTITY_IID)}
      </div>
    </>
  })

  accordians.push({
    id: 'zones',
    interfaceId: ZONE_ENTITY_CONTAINER_IID,
    moreMenu: <SelectorMoreMenu selectorClass={ZONE_ENTITY_IID} />,
    sx: layerInvisibility[ZONE_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Zones</Typography>
    </>,
    body: <>
      <BorderedGrid
        maxItems={CLASS_MAX} 
        height="3.3em"
        width="3.95em"
        items={zoneModels}
      />
      <div className="EntityList__tools">
        <LayerVisibility layerId={ZONE_ENTITY_IID} />
        {Object.keys(zoneModels).length >= CLASS_MAX && renderEntityBoxButton(ZONE_ENTITY_IID)}
      </div>
    </>
  })


  return <div className="EntityList">
    <CobrowsingAccordianList
      listId="LeftColumn"
      accordians={accordians}
    />
    {isEditEntityGraphicsOpen && <EditEntityGraphics 
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
  connect(mapStateToProps, { editGameModel, openEditEntityGraphics, openCreateCutscene, openEntityBoxModal }),
)(EntityList);
