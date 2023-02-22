/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './MySpritesModal.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeMySpritesModal } from '../../../store/actions/gameSelectorActions';
import MySprites from '../MySprites/MySprites';
import Typography from '../../../ui/Typography/Typography';
import { openSnapshotTaker } from '../../../store/actions/gameViewEditorActions';
import Button from '../../../ui/Button/Button';

const MySpritesModal = ({ openSnapshotTaker, closeMySpritesModal, onClickSprite, gameViewEditor: { isSnapshotTakerOpen } }) => {
  function handleClose() {
    closeMySpritesModal()
  }

  return <CobrowsingModal open={!isSnapshotTakerOpen} onClose={handleClose}>
    <Typography component="h2" variant="h2">My Images</Typography>
    <div className="MySpritesModal">
      <MySprites onClickSprite={onClickSprite}/>
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
  connect(mapStateToProps, { closeMySpritesModal, openSnapshotTaker }),
)(MySpritesModal);
