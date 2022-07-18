/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingModal from '../../components/ui/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../../components/ui/SelectDescriptors/SelectDescriptors';
import { Button } from '@mui/material';
import RadioGroupColumn from '../../components/ui/RadioGroupColumn/RadioGroupColumn';
import { updateCreateBrush, clearEditorForms } from '../../store/actions/editorFormsActions';
import DescriptorSprites from '../DescriptorSprites/DescriptorSprites';

const CreateBrushFlow = ({ onComplete, updateCreateBrush, clearEditorForms, onClose, editorFormsState: { brush } }) => {
  function handleClose() {
    onClose()
    clearEditorForms()
  }

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateBrushFlow__body">
      <RadioGroupColumn
        value={brush.layer}
        title="Layer"
        onChange={(event, value) => {
          updateCreateBrush({ layer: value})
        }}
        options={[{
          label: 'Background',
          value: -1,
        },{
          label: 'Play Area',
          value: 0,
        },
        {
          label: 'Overhead',
          value: 1,
        }]}
      />
      <SelectDescriptors 
        onChange={(event, descriptors) => {
          updateCreateBrush({ descriptors })
        }}
        title="Descriptors"
        value={brush.descriptors}
      />
      <DescriptorSprites descriptors={brush.descriptors}/>
      <Button onClick={() => {
        onComplete(brush)
        handleClose()
      }}>
        Create Brush
      </Button>
      <Button onClick={handleClose}>
        Cancel
      </Button>
    </div>

  </CobrowsingModal>
}

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  return {
    editorFormsState: isCobrowsing ? state.cobrowsing.remoteState.editorForms : state.editorForms.editorFormsState,
  }
};

export default compose(
  connect(mapStateToProps, { updateCreateBrush, clearEditorForms }),
)(CreateBrushFlow);
