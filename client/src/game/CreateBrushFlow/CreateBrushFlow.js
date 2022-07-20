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
import { BACKGROUND_LAYER_ID, PLAYGROUND_LAYER_ID, OVERHEAD_LAYER_ID } from '../../constants';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { getRemoteCobrowsingState } from '../../utils/cobrowsing';

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
        value={brush.layerId}
        formLabel="Pick a layer"
        onChange={(event, value) => {
          updateCreateBrush({ layerId: value})
        }}
        options={[{
          label: 'Background',
          value: BACKGROUND_LAYER_ID,
        },{
          label: 'Playground',
          value: PLAYGROUND_LAYER_ID,
        },
        {
          label: 'Overhead',
          value: OVERHEAD_LAYER_ID,
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

const mapStateToProps = (state) => getRemoteCobrowsingState(state, {
  editorFormsState: state.editorForms.editorFormsState,
})

export default compose(
  connect(mapStateToProps, { updateCreateBrush, clearEditorForms }),
)(CreateBrushFlow);
