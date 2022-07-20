/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../ui/SelectDescriptors/SelectDescriptors';
import RadioGroupColumn from '../../app/ui/RadioGroupColumn/RadioGroupColumn';
import { updateCreateBrush, clearEditorForms } from '../../store/actions/editorFormsActions';
import SelectSpriteInline from '../ui/SelectSpriteInline/SelectSpriteInline';
import { BACKGROUND_LAYER_DEPTH, PLAYGROUND_LAYER_DEPTH, OVERHEAD_LAYER_DEPTH } from '../../constants';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';

const CreateBrushFlow = ({ onComplete, updateCreateBrush, clearEditorForms, onClose, editorFormsState: { brush } }) => {
  function handleClose() {
    onClose()
    clearEditorForms()
  }

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateBrushFlow">
      <Typography component="h2" variant="h2">Create Brush</Typography>
      <SelectDescriptors 
        onChange={(event, descriptors) => {
          updateCreateBrush({ descriptors })
        }}
        formLabel="Describe it"
        value={brush.descriptors}
      />
      <SelectSpriteInline
        onSelect={(textureId) => {
          updateCreateBrush({ textureId })
        }}
        formLabel="Select a sprite"
        descriptors={brush.descriptors}
        textureIdSelected={brush.textureId}
      />
      <RadioGroupColumn
        value={brush.layer}
        formLabel="Pick a layer"
        onChange={(event, value) => {
          updateCreateBrush({ layer: Number(value)})
        }}
        options={[{
          label: 'Background',
          value: BACKGROUND_LAYER_DEPTH,
        },{
          label: 'Playground',
          value: PLAYGROUND_LAYER_DEPTH,
        },
        {
          label: 'Overhead',
          value: OVERHEAD_LAYER_DEPTH,
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
