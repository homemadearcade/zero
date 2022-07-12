import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './PhysicsEditor.scss'
import SliderNotched from '../../components/ui/SliderNotched/SliderNotched';
import Switch from '@mui/material/Switch';

const PhysicsEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]

  return (
    <div className="PhysicsEditor">
      Editing Class:<br/> 
      {classId}
      <SliderNotched
        title="Speed"
        options={[.01, 0.5, 1, 5, 20, 100]}
        step={0.1}
        onChangeCommitted={(value) => {
          editGameModel({ classes: { [classId]: { speed: value }}})        
        }}
        initialValue={classSelected.speed}
      />
      <SliderNotched
        title="Density"
        step={0.1}
        options={[.01, 0.5, 1, 5, 20, 100]}
        onChangeCommitted={(value) => {
          editGameModel({ classes: { [classId]: { density: value }}})        
        }}
        initialValue={classSelected.density}
      />
      <SliderNotched
        title="Bounce"
        step={0.05}
        options={[0, .25, .5, .75, 1]}
        onChangeCommitted={(value) => {
          editGameModel({ classes: { [classId]: { bounciness: value }}})        
        }}
        initialValue={classSelected.bounciness}
      />
      <SliderNotched
        title="Friction"
        step={0.05}
        options={[0, .25, .5, .75, 1]}
        onChangeCommitted={(value) => {
          editGameModel({ classes: { [classId]: { friction: value }}})        
        }}
        initialValue={classSelected.friction}
      />
      <SliderNotched
        title="Friction (Air)"
        step={0.05}
        options={[0, .25, .5, .75, 1]}
        onChangeCommitted={(value) => {
          editGameModel({ classes: { [classId]: { frictionAir: value }}})        
        }}
        initialValue={classSelected.frictionAir}
      />
       <SliderNotched
        title="Friction (Static)"
        step={1}
        options={[0, 10, 100]}
        onChangeCommitted={(value) => {
          editGameModel({ classes: { [classId]: { frictionStatic: value }}})        
        }}
        initialValue={classSelected.frictionStatic}
      />
      <div>
        Ignore Gravity
        <Switch
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { ignoreGravity: e.target.checked }}})        
          }}
          defaultChecked={classSelected.ignoreGravity}
         />
      </div>
      <div>
        Controlled Rotation
        <Switch
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { fixedRotation: e.target.checked }}})        
          }}
          defaultChecked={classSelected.fixedRotation}
         />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(PhysicsEditor);
