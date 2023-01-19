import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './GravityEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Typography from '../../../ui/Typography/Typography';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';

const GravityEditor = ({ gameModel: { gameModel }, editGameModel }) => {
  const stage = gameModel.stages['default']

  return (
    <div className="GravityEditor">
      <Typography component="h5" variant="h5">Editing Stage</Typography>
      <Unlockable interfaceId="stage/gravityX">
        <SliderNotched
          formLabel="Gravity ⇆"
          step={0.5}
          options={[-10, -5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5, 10]}
          onChangeCommitted={(value) => {
            editGameModel({ stages: { ['default']: { gravity: { x: value } }} })        
          }}
          value={stage.gravity.x}
        />
      </Unlockable>
      <Unlockable interfaceId="stage/gravityY">
        <SliderNotched
          formLabel="Gravity ⇵"
          step={0.5}
          options={[-10, -5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5, 10]}
          onChangeCommitted={(value) => {
            editGameModel({ stages: { ['default'] : { gravity: { y: value } }} })        
          }}
          value={stage.gravity.y}
        />
      </Unlockable>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { editGameModel })(GravityEditor);
