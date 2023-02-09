import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './GravityEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Typography from '../../../ui/Typography/Typography';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { STAGE_GRAVITY_X_IID, STAGE_GRAVITY_Y_IID } from '../../../constants/interfaceIds';

const GravityEditor = ({ gameModel: { gameModel, currentStageId }, editGameModel }) => {
  const stage = gameModel.stages[currentStageId]

  return (
    <div className="GravityEditor">
      <Typography component="h5" variant="h5">Editing Stage</Typography>
      <Unlockable interfaceId={STAGE_GRAVITY_Y_IID}>
        <SliderNotched
          formLabel="Gravity ⇵"
          step={0.5}
          options={[-10, -5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5, 10]}
          onChangeCommitted={(value) => {
            editGameModel({ stages: { [currentStageId] : { gravity: { y: value } }} })        
          }}
          value={stage.gravity.y}
        />
      </Unlockable>
      <Unlockable interfaceId={STAGE_GRAVITY_X_IID}>
        <SliderNotched
          formLabel="Gravity ⇆"
          step={0.5}
          options={[-10, -5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5, 10]}
          onChangeCommitted={(value) => {
            editGameModel({ stages: { [currentStageId]: { gravity: { x: value } }} })        
          }}
          value={stage.gravity.x}
        />
      </Unlockable>

    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameContext: state.gameContext
});

export default connect(mapStateToProps, { editGameModel })(GravityEditor);
