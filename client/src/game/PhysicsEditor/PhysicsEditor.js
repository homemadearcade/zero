import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './PhysicsEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import Switch from '@mui/material/Switch';
import { FormLabel, Typography } from '@mui/material';

const PhysicsEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]

  return (
    <div className="PhysicsEditor">
      <Typography component="h5" variant="h5">Editing Class {classId}</Typography>
      <div className="PhysicsEditor__sliders">
        <SliderNotched
          formLabel="Speed"
          options={[1, 5, 20, 100]}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { speed: value }}})        
          }}
          value={classSelected.speed}
        />
        <SliderNotched
          formLabel="Density"
          step={0.1}
          options={[.001, .01, 0.1, 0.25, 0.5, 0.75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { density: value }}})        
          }}
          value={classSelected.density}
        />
        <SliderNotched
          formLabel="Bounce"
          step={0.05}
          options={[0, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { bounciness: value }}})        
          }}
          value={classSelected.bounciness}
        />
        <SliderNotched
          formLabel="Friction"
          step={0.05}
          options={[0, 0.1, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { friction: value }}})        
          }}
          value={classSelected.friction}
        />
        <SliderNotched
          formLabel="Friction (Air)"
          step={0.05}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { frictionAir: value }}})        
          }}
          value={classSelected.frictionAir}
        />
        <SliderNotched
          formLabel="Friction (Static)"
          step={1}
          options={[0.5, 1, 5, 20]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { frictionStatic: value }}})        
          }}
          value={classSelected.frictionStatic}
        />
      </div>
      <div>
        <FormLabel>Ignore Gravity</FormLabel>
        <Switch
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { ignoreGravity: e.target.checked }}})        
          }}
          checked={classSelected.ignoreGravity}
         />
      </div>
      <div>
        <FormLabel>Controlled Rotation</FormLabel>
        <Switch
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { fixedRotation: e.target.checked }}})        
          }}
          checked={classSelected.fixedRotation}
         />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(PhysicsEditor);
