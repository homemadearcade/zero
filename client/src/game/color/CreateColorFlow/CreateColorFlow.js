/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateColorFlow.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateColorFlow, updateCreateColor } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../components/ui/Typography/Typography';
import Button from '../../../components/ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import ColorGrid from '../ColorGrid/ColorGrid';
import Icon from '../../../components/ui/Icon/Icon';

const CreateColorFlow = ({ onComplete, closeCreateColorFlow, updateCreateColor, gameFormEditor: { color }}) => {
  function handleClose() {
    closeCreateColorFlow()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateColor({ descriptors })
  // }}

  return <CobrowsingModal open={!color.isEyeDropping} onClose={handleClose}>
    <div className="CreateColorFlow">
      <Typography component="h2" variant="h2">Add Color</Typography>
      <Icon icon="faEyeDropper" onClick={() => {
        const eyeDropper = new window.EyeDropper();
        eyeDropper.open().then((result) => {
          onComplete({ canvasId: color.canvasId, hex: result.sRGBHex})
        }).catch((e) => {
          console.error(e)
        });

        updateCreateColor({
          isEyeDropping: true
        })
      }}/>
      <ColorGrid onClick={(hex) => {
          onComplete({ canvasId: color.canvasId, hex})
          handleClose()
          // updateCreateColor({hex})
      }}/>
      <div className="CreateColorFlow__buttons">

        <Button onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  </CobrowsingModal>
}

{/* <Button onClick={() => {
}}>
  Add Color
</Button> */}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateColor, closeCreateColorFlow }),
)(CreateColorFlow);
