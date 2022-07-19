import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './WorldEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';

const WorldEditor = ({ game: { gameModel }, editGameModel }) => {
  const world = gameModel.world

  return (
    <div className="WorldEditor">
      <h3>Editing World</h3>
      <SliderNotched
        title="Gravity X"
        step={0.5}
        options={[-5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5]}
        onChangeCommitted={(value) => {
          editGameModel({ world: { gravity: { x: value }}})        
        }}
        value={world.gravity.x}
      />
      <SliderNotched
        title="Gravity Y"
        step={0.5}
        options={[-5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5]}
        onChangeCommitted={(value) => {
          editGameModel({ world: { gravity: { y: value }}})        
        }}
        value={world.gravity.y}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(WorldEditor);
