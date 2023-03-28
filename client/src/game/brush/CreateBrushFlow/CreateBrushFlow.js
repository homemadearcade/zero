/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../../ui/SelectDescriptors/SelectDescriptors';
import { updateCreateBrush, clearGameFormEditor, closeCreateBrushFlow } from '../../../store/actions/gameFormEditorActions';
import CreateTexture from '../../textures/CreateTexture/CreateTexture';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { CHOOSE_TEXTURES_IID } from '../../../constants/interfaceIds';

const CreateBrushFlow = ({ onComplete, updateCreateBrush, clearGameFormEditor, closeCreateBrushFlow,  gameFormEditor: { brush }}) => {
  function handleClose() {
    closeCreateBrushFlow()
    // clearGameFormEditor()
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateBrushFlow">
      <Typography component="h2" variant="h2">Create Brush</Typography>
      <Unlockable interfaceId={CHOOSE_TEXTURES_IID}><SelectDescriptors 
        onChange={(event, visualTags) => {
          updateCreateBrush({ visualTags })
        }}
        formLabel="Search sprites"
        value={brush.visualTags}
      /></Unlockable>
      <CreateTexture
        onSelect={(textureId) => {
          updateCreateBrush({ textureId })
        }}
        onClearTint={() => {
          updateCreateBrush({ textureTint: null })
        }}
        textureTintSelected={brush.textureTint}
        onSelectTint={(textureTint) => {
          updateCreateBrush({ textureTint })
        }}
        visualTags={brush.visualTags}
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
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateBrush, clearGameFormEditor, closeCreateBrushFlow }),
)(CreateBrushFlow);
