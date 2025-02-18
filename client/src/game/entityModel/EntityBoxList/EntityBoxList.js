/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EntityBoxList.scss';
import EntityItem from '../EntityItem/EntityItem';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import CobrowsingAccordianList from '../../cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import { dataSourceIIDToDisplayName, dataSourceIIDToIcon } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { DERIVED_AUTOGENERATION_IID, DERIVED_DEFAULT_SYSTEM_IID, IS_DATA_HIDDEN_IID, IS_DATA_REMOVED_IID, NOT_DERIVED_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID } from '../../../constants/interfaceIds';
import Icon from '../../../ui/Icon/Icon';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';

const EntityBoxList = ({
  entityModels,
  updateOpenInterfaceId,
  onSelectEntity,
  gameModel: { gameModel },
  gameRoomInstance: { gameRoomInstance: { currentStageId } }
}) => {
  const [accordians, setAccordians] = useState()

  useEffect(() => {
    const accordians = []
    const renderAccordian = (dataSourceIID, title, entityModels) => {
      const matchingEntityModels = entityModels.
      filter(filterEntityModels(dataSourceIID)).
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
        dataSourceIID,
        interfaceId: dataSourceIID,
        // interfaceId: PLAYER_ENTITY_CONTAINER_IID,
        // sx: layerInvisibility[PLAYER_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
        title: <div style={{display: 'flex', alignItems: 'center', gap: '1em'}}>
          <Icon icon={dataSourceIIDToIcon[dataSourceIID]} />
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

    renderAccordian(NOT_DERIVED_IID, dataSourceIIDToDisplayName[NOT_DERIVED_IID], entityModels)

    // renderAccordian(DERIVED_AUTOGENERATION_IID, dataSourceIIDToDisplayName[DERIVED_AUTOGENERATION_IID], entityModels)
    renderAccordian(DERIVED_DEFAULT_SYSTEM_IID, dataSourceIIDToDisplayName[DERIVED_DEFAULT_SYSTEM_IID], entityModels)

    // renderAccordian(IS_DATA_HIDDEN_IID, dataSourceIIDToDisplayName[IS_DATA_HIDDEN_IID], entityModels)
    renderAccordian(IS_DATA_REMOVED_IID, dataSourceIIDToDisplayName[IS_DATA_REMOVED_IID], entityModels)

    setAccordians(accordians.filter((accordian) => !!accordian))
  }, [entityModels.length])

  useEffect(() => {
    if(accordians && accordians.length) {
      updateOpenInterfaceId('BoxList', accordians[0].dataSourceIID)
    }
  }, [accordians])

  const renderEntityItem = (currentEntityModel, i) => {
    const el = <EntityItem key={i} onClick={() => {
      onSelectEntity(currentEntityModel.entityModelId)
    }}
    entityModelId={currentEntityModel.entityModelId}/>
    return el
  }

  const filterEntityModels = (dataSourceIID) => (currentEntityModel) => {  
    if(dataSourceIID === IS_DATA_REMOVED_IID) {
      if(currentEntityModel.isRemoved) return true
      return false
    }
    if(currentEntityModel.isRemoved) return 

    const isHidden = currentEntityModel.editorInterface.notSelectableInInterface
    if(dataSourceIID === IS_DATA_HIDDEN_IID) {
      if(isHidden) return true
      return false
    }
    if(isHidden) return false

    if(currentEntityModel.importedStageIds[currentStageId]) return false

    if(currentEntityModel.dataSourceIID === dataSourceIID) {
      return true
    }

    return false
  }

  // function addDefaultValuesToPlayerEntity(entityModel) {
  //   const defaultType = gameModel.stages[currentStageId].defaultType
  //   if(!defaultType) return entityModel
  //   const defaultTypeProperties = stageClassIIDProperties[defaultType]
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
  gameRoomInstance: state.gameRoomInstance,
})

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId  }),
)(EntityBoxList);
