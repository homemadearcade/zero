/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameTexturesModal.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeGameTexturesModal } from '../../../store/actions/game/gameSelectorActions';
import GameTextures from '../GameTextures/GameTextures';
import Typography from '../../../ui/Typography/Typography';
import { openSnapshotTaker } from '../../../store/actions/game/gameViewEditorActions';
import Button from '../../../ui/Button/Button';

const GameTexturesModal = ({ openSnapshotTaker, closeGameTexturesModal, onClickTexture, gameViewEditor: { isSnapshotTakerOpen } }) => {
  function handleClose() {
    closeGameTexturesModal()
  }

  return <CobrowsingModal open={!isSnapshotTakerOpen} onClose={handleClose}>
    <Typography component="h2" variant="h2">My Images</Typography>
    <div className="GameTexturesModal">
      <GameTextures onClickTexture={onClickTexture}/>
    </div>
    <Button onClick={() => {
      openSnapshotTaker()
    }}>Open Snapshot Taker</Button>
  </CobrowsingModal>
}

const mapStateToProps = (state) => ({
  gameViewEditor: state.gameViewEditor
})

export default compose(
  connect(mapStateToProps, { closeGameTexturesModal, openSnapshotTaker }),
)(GameTexturesModal);
