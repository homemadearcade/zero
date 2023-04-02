/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeEntityBoxModal } from '../../../store/actions/game/gameSelectorActions';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import './EntityBoxModal.scss'
import EntityBoxList from '../EntityBoxList/EntityBoxList';

const EntityBoxModal = ({ closeEntityBoxModal, gameSelector: { entityBoxModelType }, gameModel : { gameModel : { entityModels }} }) => {
  function handleClose() {
    closeEntityBoxModal()
  }

  const entityModelsToSelect = Object.keys(entityModels).map((entityModelId) => {
    return entityModels[entityModelId]
  }).filter((entityModel) => {
    return entityModel.entityInterfaceId === entityBoxModelType
  })

  return <CobrowsingModal open onClose={handleClose}>
    <div className="EntityBoxModal">
      <EntityBoxList entityModels={entityModelsToSelect} onClose={handleClose}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameModel: state.gameModel
})

export default compose(
  connect(mapStateToProps, { closeEntityBoxModal }),
)(EntityBoxModal);
