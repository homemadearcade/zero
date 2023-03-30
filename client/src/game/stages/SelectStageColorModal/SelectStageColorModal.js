/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStageColorModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeSelectStageColorModal } from '../../../store/actions/game/gameSelectorActions';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import SelectStageColor from '../SelectStageColor/SelectStageColor';

const SelectStageColorModal = ({ 
  closeSelectStageColorModal, 
  editGameModel, 
  gameFormEditor: { isEyeDropping },
  gameModel: { currentStageId },
}) => {
  function handleClose() {
    closeSelectStageColorModal()
  }

  return <CobrowsingModal open={!isEyeDropping} onClose={handleClose}>
    <div className="SelectStageColorModal">
      <SelectStageColor onSelectColor={(hex) => {
        editGameModel({
          stages: {
            [currentStageId]: {
              color: hex
            }
          }
        })
        closeSelectStageColorModal()
      }}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { closeSelectStageColorModal, editGameModel }),
)(SelectStageColorModal);
