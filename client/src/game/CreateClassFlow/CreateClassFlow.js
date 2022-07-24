/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateClassFlow.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '..//ui/SelectDescriptors/SelectDescriptors';
import { clearEditorForms, updateCreateClass } from '../../store/actions/editorFormsActions';
import SelectSpriteInline from '../ui/SelectSpriteInline/SelectSpriteInline';
import Button from '../../app/ui/Button/Button';
import Typography from '../../app/ui/Typography/Typography';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const CreateClassFlow = ({ onComplete, clearEditorForms, updateCreateClass, onClose, editorForms: { class: objectClass } }) => {
  function handleClose() {
    onClose()
    clearEditorForms()
  }

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateClassFlow">
      <Typography component="h2" variant="h2">Create Class</Typography>
      <SelectDescriptors 
        onChange={(event, descriptors) => {
          updateCreateClass({ descriptors })
        }}
        formLabel="Descriptors"
        value={objectClass.descriptors}
      />
      <SelectSpriteInline
        onSelect={(textureId) => {
          updateCreateClass({ textureId })
        }}
        formLabel="Select a sprite"
        descriptors={objectClass.descriptors}
        textureIdSelected={objectClass.textureId}
      />
      <Button onClick={() => {
        onComplete(objectClass)
        handleClose()
      }}>
        Create Class
      </Button>
      <Button onClick={handleClose}>
        Cancel
      </Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editorForms: state.editorForms,
})

export default compose(
  connect(mapStateToProps, { updateCreateClass, clearEditorForms }),
)(CreateClassFlow);
