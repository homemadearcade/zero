/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingModal from '../../components/ui/CobrowsingModal/CobrowsingModal';
import SelectChipsAuto from '../../components/ui/SelectChipsAuto/SelectChipsAuto';
import { Button } from '@mui/material';
import RadioGroupColumn from '../../components/ui/RadioGroupColumn/RadioGroupColumn';
import { updateCreateBrush, clearEditorForms } from '../../store/actions/editorFormsActions';

const CreateBrushFlow = ({ onComplete, updateCreateBrush, clearEditorForms, onClose, game: { descriptorOptions }, editorFormsState: { brush } }) => {
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
      <SelectChipsAuto 
        onChange={(event, descriptors) => {
          updateCreateBrush({ descriptors: descriptors.map(({value}) => value) })
        }}
        title="Descriptors"
        value={brush.descriptors}
        options={descriptorOptions}
      />
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
    game: state.game,
    editorFormsState: isCobrowsing ? state.cobrowsing.remoteState.editorForms : state.editorForms.editorFormsState,
  }
};

export default compose(
  connect(mapStateToProps, { updateCreateBrush, clearEditorForms }),
)(CreateBrushFlow);
