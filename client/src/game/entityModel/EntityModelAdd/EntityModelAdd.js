/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EntityModelAdd.scss';
import { openEditEntityGraphics } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { stageDefaultTypeProperties, defaultPowerupEntity, defaultZoneEntity, defaultBasicEntity, defaultPlayerEntity, defaultNpcEntity} from '../../constants';
import { BASIC_ENTITY_ADD_IID, BASIC_ENTITY_IID, NPC_ENTITY_ADD_IID, NPC_ENTITY_IID, PLAYER_ENTITY_ADD_IID, PLAYER_ENTITY_IID, POWERUP_ENTITY_ADD_IID, POWERUP_ENTITY_IID, ZONE_ENTITY_ADD_IID, ZONE_ENTITY_IID} from '../../../constants/interfaceIds';
import { mergeDeep } from '../../../utils';
import _ from 'lodash';

const EntityModelAdd = ({
  openEditEntityGraphics,
  entityInterfaceId,
  parentInterfaceId,
  children,
  defaultValues = {},
  gameModel: { gameModel, currentStageId, entityModels },
}) => {
  function addDefaultValuesToPlayerEntity(entityModel) {
    const defaultType = gameModel.stages[currentStageId].defaultType
    console.log('???', defaultType)
    if(!defaultType) return entityModel
    const defaultTypeProperties = stageDefaultTypeProperties[defaultType]
    const defaultEntityModel = entityModels[defaultTypeProperties].playerEntityModelId
    console.log(defaultEntityModel, defaultTypeProperties, entityModels[defaultTypeProperties])
    return {...entityModel, ...defaultEntityModel}
  }

  function onOpenEditEntityGraphics(parentInterfaceId, entityModel) {
    openEditEntityGraphics(parentInterfaceId, mergeDeep(_.cloneDeep(entityModel), defaultValues))
  }

  if(entityInterfaceId === PLAYER_ENTITY_IID) {
    return <Unlockable interfaceId={PLAYER_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(parentInterfaceId, addDefaultValuesToPlayerEntity({...defaultPlayerEntity}))
      })}
    </Unlockable>
  }

  if(entityInterfaceId === NPC_ENTITY_IID) {
    return <Unlockable interfaceId={NPC_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(parentInterfaceId, defaultNpcEntity)
      })}
    </Unlockable>
  }

  if(entityInterfaceId === BASIC_ENTITY_IID) {
    return <Unlockable interfaceId={BASIC_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(parentInterfaceId, defaultBasicEntity)
      })}
    </Unlockable>
  }

  if(entityInterfaceId === ZONE_ENTITY_IID) {
    return <Unlockable interfaceId={ZONE_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(parentInterfaceId, defaultZoneEntity)
      })}
    </Unlockable>
  }

  if(entityInterfaceId === POWERUP_ENTITY_IID) {
    return <Unlockable interfaceId={POWERUP_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(parentInterfaceId, defaultPowerupEntity)
      })}
    </Unlockable>
  }
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  // for the unlockability to show up
  gameModel: state.gameModel,
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { openEditEntityGraphics}),
)(EntityModelAdd);
