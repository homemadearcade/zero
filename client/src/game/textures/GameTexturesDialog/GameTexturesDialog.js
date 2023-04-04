/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameTexturesDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeGameTexturesDialog } from '../../../store/actions/game/gameSelectorActions';
import GameTextures from '../GameTextures/GameTextures';
import Typography from '../../../ui/Typography/Typography';
import { openSnapshotTaker } from '../../../store/actions/game/gameViewEditorActions';
import Button from '../../../ui/Button/Button';

const GameTexturesDialog = ({ openSnapshotTaker, closeGameTexturesDialog, onClickTexture, gameViewEditor: { isSnapshotTakerOpen } }) => {
  function handleClose() {
    closeGameTexturesDialog()
  }

  return <CobrowsingDialog open={!isSnapshotTakerOpen} onClose={handleClose}>
    <Typography component="h2" variant="h2">My Images</Typography>
    <div className="GameTexturesDialog">
      <GameTextures onClickTexture={onClickTexture}/>
    </div>
    <Button onClick={() => {
      openSnapshotTaker()
    }}>Open Snapshot Taker</Button>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => ({
  gameViewEditor: state.gameViewEditor
})

export default compose(
  connect(mapStateToProps, { closeGameTexturesDialog, openSnapshotTaker }),
)(GameTexturesDialog);
