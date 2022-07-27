/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateColorFlow.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { updateCreateColor, clearEditorForms, closeCreateColorFlow } from '../../store/actions/editorFormsActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import ColorGrid from '../ui/ColorGrid/ColorGrid';
import { color } from '@mui/system';

const CreateColorFlow = ({ onComplete, updateCreateColor, clearEditorForms, closeCreateColorFlow,  editorForms: { color }}) => {
  function handleClose() {
    closeCreateColorFlow()
    clearEditorForms()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateColor({ descriptors })
  // }}

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateColorFlow">
      <Typography component="h2" variant="h2">Add Color</Typography>
      <ColorGrid onClick={(hex) => {
          onComplete({ layerId: color.layerId, hex})
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
  connect(mapStateToProps, { updateCreateColor, clearEditorForms, closeCreateColorFlow }),
)(CreateColorFlow);
