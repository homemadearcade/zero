/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateClassFlow.scss';
import CobrowsingModal from '../../components/ui/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../../components/ui/SelectDescriptors/SelectDescriptors';
import { Button } from '@mui/material';
import { clearEditorForms, updateCreateClass } from '../../store/actions/editorFormsActions';

const CreateClassFlow = ({ onComplete, clearEditorForms, updateCreateClass, onClose, editorFormsState: { class: objectClass } }) => {
  function handleClose() {
    onClose()
    clearEditorForms()
  }

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateClassFlow__body">
      <SelectDescriptors 
        onChange={(event, descriptors) => {
          updateCreateClass({ descriptors })
        }}
        title="Descriptors"
        value={objectClass.descriptors}
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

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  return {
    editorFormsState: isCobrowsing ? state.cobrowsing.remoteState.editorForms : state.editorForms.editorFormsState,
  }
};

export default compose(
  connect(mapStateToProps, { updateCreateClass, clearEditorForms }),
)(CreateClassFlow);
