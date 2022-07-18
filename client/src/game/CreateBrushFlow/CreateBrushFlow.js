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
import SelectSpriteInline from '../SelectSpriteInline/SelectSpriteInline';

const CreateBrushFlow = ({ onComplete, updateCreateBrush, clearEditorForms, onClose, editorFormsState: { brush } }) => {
  function handleClose() {
    onClose()
    clearEditorForms()
  }

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateBrushFlow">
      <h2>Create Brush</h2>
      <SelectDescriptors 
        onChange={(event, descriptors) => {
          updateCreateBrush({ descriptors })
        }}
        title="Describe it"
        value={brush.descriptors}
      />
      <SelectSpriteInline
        onSelect={(textureId) => {
          updateCreateBrush({ textureId })
        }}
        title="Select a sprite"
        descriptors={brush.descriptors}
        textureIdSelected={brush.textureId}
      />
      <RadioGroupColumn
        value={brush.layer}
        title="Pick a layer"
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
      <div className="CreateBrushFlow__buttons">
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
