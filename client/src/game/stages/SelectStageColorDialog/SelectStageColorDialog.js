/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStageColorDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeSelectStageColorDialog } from '../../../store/actions/game/gameSelectorActions';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import SelectStageColor from '../SelectStageColor/SelectStageColor';

const SelectStageColorDialog = ({ 
  closeSelectStageColorDialog, 
  editGameModel, 
  gameFormEditor: { isEyeDropping },
  gameModel: { currentStageId },
}) => {
  function handleClose() {
    closeSelectStageColorDialog()
  }

  return <CobrowsingDialog open={!isEyeDropping} onClose={handleClose}>
    <div className="SelectStageColorDialog">
      <SelectStageColor onSelectColor={(hex) => {
        editGameModel({
          stages: {
            [currentStageId]: {
              color: hex
            }
          }
        })
        closeSelectStageColorDialog()
      }}/>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { closeSelectStageColorDialog, editGameModel }),
)(SelectStageColorDialog);
