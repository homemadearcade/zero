/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './MyImagesModal.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeMyImagesModal } from '../../../store/actions/gameSelectorActions';
import MyImages from '../MyImages/MyImages';
import Typography from '../../../ui/Typography/Typography';
import { openSnapshotTaker } from '../../../store/actions/gameViewEditorActions';
import Button from '../../../ui/Button/Button';

const MyImagesModal = ({ openSnapshotTaker, closeMyImagesModal, onClickTexture, gameViewEditor: { isSnapshotTakerOpen } }) => {
  function handleClose() {
    closeMyImagesModal()
  }

  return <CobrowsingModal open={!isSnapshotTakerOpen} onClose={handleClose}>
    <Typography component="h2" variant="h2">My Images</Typography>
    <div className="MyImagesModal">
      <MyImages onClickTexture={onClickTexture}/>
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
  connect(mapStateToProps, { closeMyImagesModal, openSnapshotTaker }),
)(MyImagesModal);
