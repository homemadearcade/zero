import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './PhysicsEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { FormLabel, Typography } from '@mui/material';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import Switch from '../../app/ui/Switch/Switch';

const PhysicsEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]

  return (
    <div className="PhysicsEditor">
      <Typography component="h5" variant="h5">Editing Class {classId}</Typography>
      <div className="PhysicsEditor__sliders">    
        <Unlockable isSlider interfaceId="physics/sliders/bounce">
          <SliderNotched
            formLabel="Bounce"
            step={0.05}
            options={[0, .25, .5, .75, 1]}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { bounciness: value }}})        
            }}
            value={classSelected.bounciness}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId="physics/sliders/friction/ground">
          <SliderNotched
            formLabel="Friction"
            step={0.05}
            options={[0, 0.1, .25, .5, .75, 1]}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { friction: value }}})        
            }}
            value={classSelected.friction}
          />
        </Unlockable>
        {false && <SliderNotched
          formLabel="Staticness"
          step={1}
          options={[0, 1, 5, 20, 50, 100, 200]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { frictionStatic: value }}})        
          }}
          value={classSelected.frictionStatic}
        />}
        {(true || classSelected.useMass) && 
          <Unlockable isSlider interfaceId="physics/sliders/weight/mass">
            <SliderNotched
              formLabel="Weight"
              step={0.1}
              options={[.1, 1, 5, 10, 20, 50, 100, 200, 500]}
              onChangeCommitted={(value) => {
                editGameModel({ classes: { [classId]: { mass: value }}})        
              }}
              value={classSelected.mass}
            />
          </Unlockable>}
        {false && !classSelected.useMass &&  
           <Unlockable isSlider interfaceId="physics/sliders/weight/density">
            <SliderNotched
              formLabel="Weight (Density)"
              step={0.001}
              options={[.001, .01, 0.1, 0.25, 0.5, 0.75, 1]}
              onChangeCommitted={(value) => {
                editGameModel({ classes: { [classId]: { density: value }}})        
              }}
              value={classSelected.density}
            />
          </Unlockable>
        }
      </div>
      {false && <Unlockable interfaceId="physics/toggle/ignoreGravity">
          <FormLabel>Ignore Gravity</FormLabel>
          <Switch
            size="small"
            onChange={(e) => {
              editGameModel({ classes: { [classId]: { attributes: { ignoreGravity: e.target.checked }}}})        
            }}
            checked={classSelected.attributes.ignoreGravity}
          />
      </Unlockable>}
      <Unlockable interfaceId="physics/toggle/notPushable">
        <FormLabel>Not Pushable</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { attributes: { notPushable: e.target.checked } } } })        
          }}
          checked={classSelected.attributes.notPushable}
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
      {false && <Unlockable interfaceId="physics/toggle/useMass">
        <FormLabel>Use Mass For Weight</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { attributes: { useMass: e.target.checked }}}})        
          }}
          checked={classSelected.attributes.useMass}
        />
      </Unlockable>}
      {false && <Unlockable interfaceId="physics/toggle/fixedRotation">
        <FormLabel>Fixed Rotation</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { attributes: { fixedRotation: e.target.checked }}}})        
          }}
          checked={classSelected.attributes.fixedRotation}
         />
      </Unlockable>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(PhysicsEditor);
