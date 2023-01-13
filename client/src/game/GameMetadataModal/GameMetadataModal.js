/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameMetadataModal.scss';
import CobrowsingModal from '../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { closeGameMetadataModal } from '../../store/actions/gameEditorActions';
import GameMetadataForm from '../../app/homemadeArcade/arcadeGame/GameMetadataForm/GameMetadataForm';

const GameMetadataModal = ({ closeGameMetadataModal, gameViewEditor: { isSnapshotTakerOpen } }) => {
  function handleClose() {
    closeGameMetadataModal()
  }

  return <CobrowsingModal open={!isSnapshotTakerOpen} onClose={handleClose}>
    <div className="GameMetadataModal">
      <GameMetadataForm onSubmit={handleClose}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
})

export default compose(
  connect(mapStateToProps, { closeGameMetadataModal }),
)(GameMetadataModal);
