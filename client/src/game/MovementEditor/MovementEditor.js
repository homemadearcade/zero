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
          value={classSelected.controls.type ? [classSelected.controls.type] : []}
          onChange={(event, type) => {
          editGameModel({ classes: { [classId]: { controls: { type: type[type.length-1]} } }})        
        }}/>
      </Unlockable>}
      {classSelected.type === 'hero' && <Unlockable isSlider interfaceId="movement/controls/sticky">
      <FormLabel>Sticky Controls</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { controls: { sticky: e.target.checked }}}})        
          }}
          checked={classSelected.controls.sticky}
         />
      </Unlockable>}
      {classSelected.type === 'hero' && classSelected.controls.type === PLATFORMER_CONTROLS && <Unlockable interfaceId="movement/speed">
        <SliderNotched
          formLabel="Jump Speed"
          options={[50, 100, 200, 300, 400, 500]}
          step={10}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { jumpSpeed: value }}})        
          }}
          value={classSelected.jumpSpeed}
        />
      </Unlockable>}
      {classSelected.type !== 'hero' && <Unlockable isSlider interfaceId="movement/pattern">
        <SelectMovementPattern
          formLabel="Pattern"
          value={classSelected.movement.pattern ? [classSelected.movement.pattern] : []}
          onChange={(event, pattern) => {
          editGameModel({ classes: { [classId]: { movement: { pattern: pattern[pattern.length-1]} } }})        
        }}/>
      </Unlockable>}
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
      <Unlockable isSlider interfaceId="physics/sliders/friction/air">
        <SliderNotched
          formLabel="Drag"
          step={0.05}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { drag: value }}})        
          }}
          value={classSelected.drag}
        />
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
      {<Unlockable interfaceId="physics/toggle/immovable">
        <FormLabel>Free Movement</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { attributes: { immovable: e.target.checked } } } })        
          }}
          checked={classSelected.attributes.immovable}
         />
      </Unlockable>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(MovementEditor);
