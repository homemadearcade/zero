/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeEntityBoxModal } from '../../../store/actions/game/gameSelectorActions';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import EntityItem from '../EntityItem/EntityItem';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import './EntityBoxModal.scss'

const EntityBoxModal = ({ closeEntityBoxModal, gameSelector: { classBoxEntityType }, gameModel : { gameModel : { entityModels }} }) => {
  function handleClose() {
    closeEntityBoxModal()
  }

  const entityModelsToSelect = Object.keys(entityModels).map((entityModelId) => {
    return entityModels[entityModelId]
  }).filter((entityModel) => {
    return entityModel.entityInterfaceId === classBoxEntityType
  }).map((entityModel) => {
    return <EntityItem onClick={handleClose} entityModelId={entityModel.entityModelId}></EntityItem>
  })

  return <CobrowsingModal open onClose={handleClose}>
    <div className="EntityBoxModal">
      <BorderedGrid
     height="3.3em"
        width="3.95em"
        items={entityModelsToSelect}
      />
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
