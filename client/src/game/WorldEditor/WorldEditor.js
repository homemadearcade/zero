import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './WorldEditor.scss'
import ButtonGroup from '../../app/ui/ButtonGroup/ButtonGroup';

const WorldEditor = ({ game: { gameModel }, editGameModel }) => {
  const world = gameModel.world

  return (
    <div className="WorldEditor">
      Editing World
      <ButtonGroup
        title="Gravity X"
        options={[-5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5]}
        onSelectOption={(value) => {
          editGameModel({ world: { gravity: { x: value }}})        
        }}
        initialOption={world.gravity.x}
      />
      <ButtonGroup
        title="Gravity Y"
        options={[-5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5]}
        onSelectOption={(value) => {
          editGameModel({ world: { gravity: { y: value }}})        
        }}
        initialOption={world.gravity.y}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(WorldEditor);
