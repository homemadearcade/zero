/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingDialog from '../../../game/cobrowsing/CobrowsingDialog/CobrowsingDialog';
import SelectVisualTags from '../../ui/SelectVisualTags/SelectVisualTags';
import { updateCreateBrush, clearGameFormEditor, closeCreateBrushFlow } from '../../../store/actions/game/gameFormEditorActions';
import CreateTexture from '../../textures/CreateTexture/CreateTexture';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { ENTITY_VISUAL_TAGS_IID } from '../../../constants/interfaceIds';

const CreateBrushFlow = ({ onComplete, updateCreateBrush, clearGameFormEditor, closeCreateBrushFlow,  gameFormEditor: { brush }}) => {
  function handleClose() {
    closeCreateBrushFlow()
    // clearGameFormEditor()
  }

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <div className="CreateBrushFlow">
      <Typography component="h2" variant="h2">Create Brush</Typography>
      <Unlockable interfaceId={ENTITY_VISUAL_TAGS_IID}><SelectVisualTags 
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

  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateBrush, clearGameFormEditor, closeCreateBrushFlow }),
)(CreateBrushFlow);
