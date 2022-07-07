import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './PhysicsEditor.scss'
import ButtonGroup from '../../components/ui/ButtonGroup/ButtonGroup';

const PhysicsEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]

  return (
    <div className="PhysicsEditor">
      Editing Class:<br/> 
      {classId}
      <ButtonGroup
        title="Speed"
        options={[.01, 0.5, 1, 5, 20, 100, 500]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classId]: { speed: value }}})        
        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Mass"
        options={[.01, 0.5, 1, 5, 20, 100, 500]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classId]: { mass: value }}})       
        }}
        initialOption={classSelected.mass}
      />
      <ButtonGroup
        title="Bounce"
        options={[0, .25, .5, .75, 1]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classId]: { bounciness: value }}})        
        }}
        initialOption={classSelected.bounciness}
      />
      <ButtonGroup
        title="Friction"
        options={[0, .25, .5, .75, 1]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classId]: { friction: value }}})        
        }}
        initialOption={classSelected.friction}
      />
      <ButtonGroup
        title="Friction (Air)"
        options={[0, .25, .5, .75, 1]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classId]: { frictionAir: value }}})        
        }}
        initialOption={classSelected.frictionAir}
      />
       <ButtonGroup
        title="Friction (Static)"
        options={[0, 10, 100, 1000]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classId]: { frictionStatic: value }}})        
        }}
        initialOption={classSelected.frictionStatic}
      />
      <ButtonGroup
        title="Density"
        options={[.01, 0.5, 1, 5, 20, 100, 500]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classId]: { density: value }}})        
        }}
        initialOption={classSelected.density}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(PhysicsEditor);
