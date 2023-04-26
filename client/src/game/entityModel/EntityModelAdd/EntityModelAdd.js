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
  entityIID,
  addEntityDialogIID,
  children,
  defaultValues = {},
  gameModel: { gameModel, currentStageId },
}) => {
  function addDefaultValuesToPlayerEntity(entityModel) {
    const defaultType = gameModel.stages[currentStageId].defaultType
    if(!defaultType) return entityModel
    const defaultTypeProperties = stageDefaultTypeProperties[defaultType]
    const entityModels = gameModel.entityModels
    const defaultEntityModel = _.cloneDeep(entityModels[defaultTypeProperties.playerEntityModelId])
    defaultEntityModel.entityModelId = null
    defaultEntityModel.isNew = true
    const newModel = mergeDeep(defaultEntityModel, entityModel)
    return newModel
  }

  function onOpenEditEntityGraphics(entityModel) {
    openEditEntityGraphics(addEntityDialogIID, mergeDeep(_.cloneDeep(entityModel), defaultValues))
  }

  if(entityIID === PLAYER_ENTITY_IID) {
    return <Unlockable interfaceId={PLAYER_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(addDefaultValuesToPlayerEntity({...defaultPlayerEntity}))
      })}
    </Unlockable>
  }

  if(entityIID === NPC_ENTITY_IID) {
    return <Unlockable interfaceId={NPC_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(defaultNpcEntity)
      })}
    </Unlockable>
  }

  if(entityIID === BASIC_ENTITY_IID) {
    return <Unlockable interfaceId={BASIC_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(defaultBasicEntity)
      })}
    </Unlockable>
  }

  if(entityIID === ZONE_ENTITY_IID) {
    return <Unlockable interfaceId={ZONE_ENTITY_ADD_IID}>
      {children(() => {
        onOpenEditEntityGraphics(defaultZoneEntity)
      })}
    </Unlockable>
  }

  // if(entityIID === POWERUP_ENTITY_IID) {
  //   return <Unlockable interfaceId={POWERUP_ENTITY_ADD_IID}>
  //     {children(() => {
  //       onOpenEditEntityGraphics(defaultPowerupEntity)
  //     })}
  //   </Unlockable>
  // }
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  // for the unlockability to show up
  gameModel: state.gameModel,
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { openEditEntityGraphics}),
)(EntityModelAdd);
