/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectBackgroundColorModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeSelectBackgroundColorModal } from '../../../store/actions/gameSelectorActions';
import { editGameModel } from '../../../store/actions/gameModelActions';
import SelectBackgroundColor from '../SelectBackgroundColor/SelectBackgroundColor';

const SelectBackgroundColorModal = ({ 
  closeSelectBackgroundColorModal, 
  editGameModel, 
  gameFormEditor: { isEyeDropping },
  gameModel: { currentStageId },
}) => {
  function handleClose() {
    closeSelectBackgroundColorModal()
  }

  return <CobrowsingModal open={!isEyeDropping} onClose={handleClose}>
    <div className="SelectBackgroundColorModal">
      <SelectBackgroundColor onSelectColor={(hex) => {
        editGameModel({
          stages: {
            [currentStageId]: {
              backgroundColor: hex
            }
          }
        })
        closeSelectBackgroundColorModal()
      }}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { closeSelectBackgroundColorModal, editGameModel }),
)(SelectBackgroundColorModal);
