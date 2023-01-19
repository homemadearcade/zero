/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SetupChoicesModal.scss';
import CobrowsingModal from '../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { closeSetupChoicesModal } from '../../store/actions/gameEditorActions';
import CobrowsingVerticalLinearStepper from '../cobrowsing/CobrowsingVerticalLinearStepper/CobrowsingVerticalLinearStepper';
import Typography from '../../ui/Typography/Typography';
import AggregateColorSelect from '../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../store/actions/gameModelActions';
import { STAGE_BACKGROUND_CANVAS_ID } from '../constants';

const SetupChoicesModal = ({ closeSetupChoicesModal, editGameModel, gameModel: { gameModel }}) => {
  function handleClose() {
    closeSetupChoicesModal()
  }

  return <CobrowsingModal open onClose={handleClose}>
    <div className="SetupChoicesModal">
      <CobrowsingVerticalLinearStepper
        stepperId="EditingGameSetup"
        steps={[
          {
            id: 'Background Color',
            title: <Typography component="h5" variant="h5">Background Color</Typography>,
            instructions: <>
              <AggregateColorSelect 
                selectedColor={gameModel.stages['default'].backgroundColor}
                canvasId={STAGE_BACKGROUND_CANVAS_ID} 
                onSelectColor={(hex) => {
                  editGameModel({
                    stages: {
                      ['default'] : {
                        backgroundColor: hex
                      }
                    }
                  })
                }}
              />
            </>,
            onClickNext:() => {

            }
          },
          {
            id: 'Select Game to be Edited',
            title: <Typography component="h5" variant="h5">Select Game to be Edited</Typography>,
            instructions: <Typography component="h5" variant="h5">You can not change the selected game when the game is powered on</Typography>
          },
        ]}
         completed={<>
          <Typography component="h5" variant="h5">Join Participant</Typography>
        </>}
      />
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel
})

export default compose(
  connect(mapStateToProps, { closeSetupChoicesModal, editGameModel }),
)(SetupChoicesModal);
