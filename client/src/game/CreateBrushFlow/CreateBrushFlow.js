/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../ui/SelectDescriptors/SelectDescriptors';
import { updateCreateBrush, clearEditorForms, closeCreateBrushFlow } from '../../store/actions/editorFormsActions';
import SelectSpriteInline from '../ui/SelectSpriteInline/SelectSpriteInline';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';

const CreateBrushFlow = ({ onComplete, updateCreateBrush, clearEditorForms, closeCreateBrushFlow,  editorForms: { brush }}) => {
  function handleClose() {
    closeCreateBrushFlow()
    clearEditorForms()
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateBrushFlow">
      <Typography component="h2" variant="h2">Create Brush</Typography>
      <SelectDescriptors 
        onChange={(event, descriptors) => {
          updateCreateBrush({ descriptors })
        }}
        formLabel="Search sprites"
        value={brush.descriptors}
      />
      <SelectSpriteInline
        onSelect={(textureId) => {
          updateCreateBrush({ textureId })
        }}
        onClearTint={() => {
          updateCreateBrush({ tint: null })
        }}
        tintSelected={brush.tint}
        onSelectTint={(tint) => {
          updateCreateBrush({ tint })
        }}
        descriptors={brush.descriptors}
        textureIdSelected={brush.textureId}
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

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editorForms: state.editorForms,
})

export default compose(
  connect(mapStateToProps, { updateCreateBrush, clearEditorForms, closeCreateBrushFlow }),
)(CreateBrushFlow);
