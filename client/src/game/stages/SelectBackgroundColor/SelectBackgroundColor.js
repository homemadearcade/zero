/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectBackgroundColor.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeSelectBackgroundColor } from '../../../store/actions/gameSelectorActions';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../../store/actions/gameModelActions';

const SelectBackgroundColor = ({ closeSelectBackgroundColor, editGameModel, gameFormEditor: { color}, gameModel: { currentStageId } }) => {
  function handleClose() {
    closeSelectBackgroundColor()
  }

  return <CobrowsingModal open={!color.isEyeDropping} onClose={handleClose}>
    <div className="SelectBackgroundColor">
      <Typography component="h2" variant="h2">Background Color</Typography>
      <AggregateColorSelect onSelectColor={(hex) => {
        editGameModel({
          stages: {
            [currentStageId]: {
              backgroundColor: hex
            }
          }
        })
        closeSelectBackgroundColor()
      }}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { closeSelectBackgroundColor, editGameModel }),
)(SelectBackgroundColor);
