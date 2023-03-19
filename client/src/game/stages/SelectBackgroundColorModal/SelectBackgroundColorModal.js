/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectBackgroundColorModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeSelectBackgroundColorModal } from '../../../store/actions/gameSelectorActions';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { LAYER_VISIBILITY_IID } from '../../../constants/interfaceIds';
import { STAGE_BACKGROUND_LAYER_CANVAS_ID } from '../../constants';
import { toggleLayerVisibility } from '../../../store/actions/gameViewEditorActions';
import Button from '../../../ui/Button/Button';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';

const SelectBackgroundColorModal = ({ 
  closeSelectBackgroundColorModal, 
  editGameModel, 
  gameViewEditor: { layerVisibility }, 
  gameFormEditor: { isEyeDropping },
  gameModel: { currentStageId },
  toggleLayerVisibility,
}) => {
  function handleClose() {
    closeSelectBackgroundColorModal()
  }

  return <CobrowsingModal open={!isEyeDropping} onClose={handleClose}>
    <div className="SelectBackgroundColorModal">
      <Typography component="h2" variant="h2">Background Color</Typography>
      <AggregateColorSelect onSelectColor={(hex) => {
        editGameModel({
          stages: {
            [currentStageId]: {
              backgroundColor: hex
            }
          }
        })
        closeSelectBackgroundColorModal()
      }}/>
      {<Unlockable interfaceId={LAYER_VISIBILITY_IID}>
      <Button onClick={() => {
        toggleLayerVisibility(STAGE_BACKGROUND_LAYER_CANVAS_ID)
      }}>{layerVisibility[STAGE_BACKGROUND_LAYER_CANVAS_ID] ? 'Hide Default Background Layer' : 'Show Default Background Layer'}</Button>
    </Unlockable>}
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
  gameViewEditor: state.gameViewEditor
})

export default compose(
  connect(mapStateToProps, { closeSelectBackgroundColorModal, editGameModel, toggleLayerVisibility }),
)(SelectBackgroundColorModal);
