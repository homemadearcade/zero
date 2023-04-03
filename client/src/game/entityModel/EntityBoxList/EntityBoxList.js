/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EntityBoxList.scss';
import EntityItem from '../EntityItem/EntityItem';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import CobrowsingAccordianList from '../../cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import { dataSourceIdToDisplayName, dataSourceIdToIcon } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { DATA_SOURCE_AUTOGENERATED_IID, DATA_SOURCE_GAME_MODEL_IID, DATA_SOURCE_IMPORTED_GAME_MODEL, DATA_SOURCE_SYSTEM_IID, IS_DATA_HIDDEN_IID, IS_DATA_REMOVED_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID } from '../../../constants/interfaceIds';
import Icon from '../../../ui/Icon/Icon';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';

const EntityBoxList = ({
  entityModels,
  updateOpenInterfaceId,
  onSelectEntity,
  gameModel: { gameModel }
}) => {
  const [accordians, setAccordians] = useState()

  useEffect(() => {
    const accordians = []
    const renderAccordian = (dataSourceId, title, entityModels) => {
      const matchingEntityModels = entityModels.
      filter(filterEntityModels(dataSourceId)).
      map(renderEntityItem).filter((item) => !!item)
            // matchingEntityModels.push(<Unlockable interfaceId={PLAYER_ENTITY_ADD_IID}>
      //   <Button size="fit" 
      //     onClick={() => {
      //       openEditEntityGraphics(addDefaultValuesToPlayerEntity({...defaultPlayerEntity}))
      //     }}>
      //     +
      //   </Button>
      // </Unlockable>)

      if(!matchingEntityModels.length) return null

      accordians.push({
        dataSourceId,
        interfaceId: dataSourceId,
        // interfaceId: PLAYER_ENTITY_CONTAINER_IID,
        // sx: layerInvisibility[PLAYER_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
        title: <div style={{display: 'flex', alignItems: 'center', gap: '1em'}}>
          <Icon icon={dataSourceIdToIcon[dataSourceId]} />
          <Typography component="div" variant="subtitle1">{title} {`(${matchingEntityModels.length})`}</Typography>
        </div>,
        body: <>
          <BorderedGrid
            height="3.3em"
            width="3.95em"
            items={matchingEntityModels}
          />
        </>
      })
    }

    renderAccordian(DATA_SOURCE_GAME_MODEL_IID, dataSourceIdToDisplayName[DATA_SOURCE_GAME_MODEL_IID], entityModels)
    renderAccordian(DATA_SOURCE_AUTOGENERATED_IID, dataSourceIdToDisplayName[DATA_SOURCE_AUTOGENERATED_IID], entityModels)
    renderAccordian(DATA_SOURCE_SYSTEM_IID, dataSourceIdToDisplayName[DATA_SOURCE_SYSTEM_IID], entityModels)

    // make sure that the imported game has this entity model and then pass it into the render
    gameModel.importedArcadeGames.forEach((importedGameModel) => {
      const relevantEntityModels = entityModels.filter((entityModel) => {
        return !!importedGameModel.entityModels[entityModel.entityModelId]
      })
      renderAccordian(importedGameModel.metadata.title, DATA_SOURCE_IMPORTED_GAME_MODEL, relevantEntityModels)
    })

    renderAccordian(IS_DATA_HIDDEN_IID, dataSourceIdToDisplayName[IS_DATA_HIDDEN_IID], entityModels)
    renderAccordian(IS_DATA_REMOVED_IID, dataSourceIdToDisplayName[IS_DATA_REMOVED_IID], entityModels)

    setAccordians(accordians.filter((accordian) => !!accordian))
  }, [entityModels.length])

  useEffect(() => {
    if(accordians && accordians.length) {
      updateOpenInterfaceId('BoxList', accordians[0].dataSourceId)
    }
  }, [accordians])

  const renderEntityItem = (currentEntityModel, i) => {
    const el = <EntityItem key={i} onClick={() => {
      onSelectEntity(currentEntityModel.entityModelId)
    }}
    entityModelId={currentEntityModel.entityModelId}/>
    return el
  }

  const filterEntityModels = (dataSourceId) => (currentEntityModel) => {  
    if(dataSourceId === IS_DATA_REMOVED_IID) {
      if(currentEntityModel.isRemoved) return true
      return false
    }
    if(currentEntityModel.isRemoved) return 

    const isHidden = currentEntityModel.editorInterface.hiddenFromInterfaceIds[SELECTOR_ENTITY_BY_INTERFACE_ID_IID]
    if(dataSourceId === IS_DATA_HIDDEN_IID) {
      if(isHidden) return true
      return false
    }
    if(isHidden) return false

    if(currentEntityModel.isImported) return false

    if(currentEntityModel.dataSourceId === dataSourceId) {
      return true
    }

    return false
  }

  // function addDefaultValuesToPlayerEntity(entityModel) {
  //   const defaultType = gameModel.stages[currentStageId].defaultType
  //   if(!defaultType) return entityModel
  //   const defaultTypeProperties = stageDefaultTypeProperties[defaultType]
  //   const defaultEntityModel = entityModels[defaultTypeProperties].playerEntityModelId
  //   return {...entityModel, ...defaultEntityModel}
  // }
  
  if(accordians && !accordians.length) {
    return <div className="EntityBoxList">
      <Typography variant="body1">Nothing to see here!</Typography>
    </div>
  }

  if(!accordians) return null

  return <div className="EntityBoxList">
    <CobrowsingAccordianList
      interfaceGroupId="BoxList"
      accordians={accordians}
    />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId  }),
)(EntityBoxList);
