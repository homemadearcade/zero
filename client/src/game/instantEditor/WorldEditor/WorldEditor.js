import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameActions';

import './WorldEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Typography from '../../../ui/Typography/Typography';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';

const WorldEditor = ({ game: { gameModel }, editGameModel }) => {
  const world = gameModel.world

  return (
    <div className="WorldEditor">
      <Typography component="h5" variant="h5">Editing World</Typography>
      <Unlockable interfaceId="world/gravityX">
        <SliderNotched
          formLabel="Gravity X"
          step={0.5}
          options={[-5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5]}
          onChangeCommitted={(value) => {
            editGameModel({ world: { gravity: { x: value }}})        
          }}
          value={world.gravity.x}
        />
      </Unlockable>
      <Unlockable interfaceId="world/gravityY">
        <SliderNotched
          formLabel="Gravity Y"
          step={0.5}
          options={[-5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5]}
          onChangeCommitted={(value) => {
            editGameModel({ world: { gravity: { y: value }}})        
          }}
          value={world.gravity.y}
        />
      </Unlockable>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(WorldEditor);
