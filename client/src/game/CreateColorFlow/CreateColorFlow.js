/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateColorFlow.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateColorFlow } from '../../store/actions/editorFormsActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import ColorGrid from '../ui/ColorGrid/ColorGrid';

const CreateColorFlow = ({ closeCreateColorFlow, editorForms: { color, onCloseCreateColorFlow, onCompleteCreateColorFlow }}) => {
  function handleClose() {
    closeCreateColorFlow()
    onCloseCreateColorFlow()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateColor({ descriptors })
  // }}

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateColorFlow">
      <Typography component="h2" variant="h2">Add Color</Typography>
      <ColorGrid onClick={(hex) => {
          onCompleteCreateColorFlow({ canvasId: color.canvasId, hex})
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
  editorForms: state.editorForms,
})

export default compose(
  connect(mapStateToProps, { closeCreateColorFlow }),
)(CreateColorFlow);
