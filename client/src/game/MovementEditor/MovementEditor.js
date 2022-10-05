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
import SelectControls from '../ui/SelectControls/SelectControls';
import { PLATFORMER_CONTROLS } from '../../constants';

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

{/* <Unlockable interfaceId="movement/toggle/movingPlatform">
<FormLabel>Moving Platform</FormLabel>
<Switch
  size="small"
  onChange={(e) => {
    editGameModel({ classes: { [classId]: { movement: { movingPlatform: e.target.checked }}}})        
  }}
  checked={classSelected.movement.movingPlatform}
 />
</Unlockable> */}

const MovementEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]
  
  return (
    <div className="MovementEditor">
      <Typography component="h5" variant="h5">Editing Class {classId}</Typography>
      {classSelected.type === 'hero' && <Unlockable isSlider interfaceId="movement/controls/type">
        <SelectControls
          formLabel="Controls"
          value={classSelected.movement.controls ? [classSelected.movement.controls] : []}
          onChange={(event, type) => {
          editGameModel({ classes: { [classId]: { movement: { controls: type[type.length-1]} } }})        
        }}/>
      </Unlockable>}
      {classSelected.type === 'hero' && classSelected.movement.controls === PLATFORMER_CONTROLS && <Unlockable interfaceId="movement/speed">
        <SliderNotched
          formLabel="Jump Speed"
          options={[50, 100, 200, 300, 400, 500]}
          step={10}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { jumpSpeed: value } }}})        
          }}
          value={classSelected.movement.jumpSpeed}
        />
      </Unlockable>}
      {classSelected.type !== 'hero' && <Unlockable isSlider interfaceId="movement/pattern">
        <SelectMovementPattern
          formLabel="Pattern"
          value={classSelected.movement.pattern ? [classSelected.movement.pattern] : []}
          onChange={(event, pattern) => {
            editGameModel({ classes: { [classId]: { ...pattern[pattern.length-1] } }})    
            editGameModel({ classes: { [classId]: { ...pattern[pattern.length-1] } }})            
          }}/>
      </Unlockable>}
      <Unlockable interfaceId="movement/initialVelocity/vertical">
        <SliderNotched
          formLabel="Vertical Velocity"
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { initialVelocityY: value} }}})        
          }}
          value={classSelected.movement.initialVelocityY}
        />
      </Unlockable>
      <Unlockable interfaceId="movement/initialVelocity/horizontal">
        <SliderNotched
          formLabel="Horizontal Velocity"
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { initialVelocityX: value} }}})        
          }}
          value={classSelected.movement.initialVelocityX}
        />
      </Unlockable>
      <Unlockable interfaceId="movement/speed">
        <SliderNotched
          formLabel="Speed"
          options={[1, 5, 20, 100]}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { speed: value } }}})        
          }}
          value={classSelected.movement.speed}
        />
      </Unlockable>
      <Unlockable isSlider interfaceId="movement/sliders/decay/vertical">
        <SliderNotched
          formLabel="Vertical Slow Down"
          step={0.01}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { dragY: 1 - value } }}})        
          }}
          value={1 - classSelected.movement.dragY}
        />
       </Unlockable>
       <Unlockable isSlider interfaceId="movement/sliders/decay/horizontal">
        <SliderNotched
          formLabel="Horizontal Slow Down"
          step={0.01}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { dragX: 1 - value } }}})        
          }}
          value={1 - classSelected.movement.dragX}
        />
       </Unlockable>
      <Unlockable interfaceId="movement/toggle/ignoreGravity">
        <FormLabel>Ignore Gravity</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { ignoreGravity: e.target.checked }}}})        
          }}
          checked={classSelected.movement.ignoreGravity}
         />
      </Unlockable>
      {<Unlockable interfaceId="physics/toggle/immovable">
        <FormLabel>Free Movement</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { immovable: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.immovable}
         />
      </Unlockable>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(MovementEditor);
