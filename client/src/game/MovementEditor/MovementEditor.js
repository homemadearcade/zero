import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './MovementEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { Typography } from '@mui/material';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import SelectClass from '../ui/SelectClass/SelectClass';
import Switch from '../../app/ui/Switch/Switch';
import FormLabel from '../../app/ui/FormLabel/FormLabel';
import SelectMovementPattern from '../ui/SelectMovementPattern/SelectMovementPattern';

{/* <Unlockable interfaceId="physics/toggle/ignoreGravity">
<FormLabel>Ignore Gravity</FormLabel>
<Switch
  size="small"
  onChange={(e) => {
    editGameModel({ classes: { [classId]: { attributes: { ignoreGravity: e.target.checked }}}})        
  }}
  checked={classSelected.attributes.ignoreGravity}
 />
</Unlockable> */}

const MovementEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]
  
  return (
    <div className="MovementEditor">
      <Typography component="h5" variant="h5">Editing Class {classId}</Typography>
      <Unlockable interfaceId="movement/speed">
        <SliderNotched
          formLabel="Speed"
          options={[1, 5, 20, 100]}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { speed: value }}})        
          }}
          value={classSelected.speed}
        />
      </Unlockable>
      <Unlockable isSlider interfaceId="movement/pattern">
        <SelectMovementPattern
          formLabel="Pattern"
          value={classSelected.movement.pattern ? [classSelected.movement.pattern] : []}
          onChange={(event, pattern) => {
          editGameModel({ classes: { [classId]: { movement: { pattern: pattern[pattern.length-1]} } }})        
        }}/>
      </Unlockable>
      <Unlockable interfaceId="movement/toggle/ignoreGravity">
        <FormLabel>Ignore Gravity</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { attributes: { ignoreGravity: e.target.checked }}}})        
          }}
          checked={classSelected.attributes.ignoreGravity}
         />
      </Unlockable>
      <Unlockable interfaceId="movement/toggle/movingPlatform">
        <FormLabel>Moving Platform</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { movingPlatform: e.target.checked }}}})        
          }}
          checked={classSelected.movement.movingPlatform}
         />
      </Unlockable>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(MovementEditor);
