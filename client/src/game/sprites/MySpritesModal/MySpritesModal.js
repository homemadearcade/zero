/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './MySpritesModal.scss';
import CobrowsingModal from '../../../components/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeMySpritesModal } from '../../../store/actions/gameEditorActions';
import MySprites from '../MySprites/MySprites';
import Typography from '../../../components/ui/Typography/Typography';

const MySpritesModal = ({ closeMySpritesModal, onClickSprite }) => {
  function handleClose() {
    closeMySpritesModal()
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <Typography component="h2" variant="h2">My Images</Typography>
    <div className="MySpritesModal">
      <MySprites onClickSprite={onClickSprite}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => ({

})

export default compose(
  connect(mapStateToProps, { closeMySpritesModal }),
)(MySpritesModal);
