import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './ProjectileEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { Typography } from '@mui/material';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import SelectClass from '../ui/SelectClass/SelectClass';

const ProjectileEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]
  const projectileClass = gameModel.classes[classSelected.projectileClassId]

  return (
    <div className="ProjectileEditor">
      <Typography component="h5" variant="h5">Editing Class {classId}</Typography>
      <Unlockable interfaceId="projectile/class">
        <SelectClass 
          formLabel="Projectile Class"
          value={classSelected.projectile.classId ? [classSelected.projectile.classId] : []}
          onChange={(event, classes) => {
          editGameModel({ classes: { [classId]: { projectile: { classId: classes[classes.length-1] }}}})        
        }}/>
      </Unlockable>
      {projectileClass && <>
        <Unlockable isSlider interfaceId="projectile/fireRate">
          <SliderNotched
            formLabel="Fire Rate"
            options={[1, 20, 50, 100, 200, 500]}
            step={10}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { fireRate: value }}}})        
            }}
            value={classSelected.projectile.fireRate}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId="projectile/lifetime">
          <SliderNotched
            formLabel="Lifetime"
            step={10}
            options={[200, 500, 800, 1200, 2000]}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { lifetime: value }}}})        
            }}
            value={classSelected.projectile.lifetime}
          />
        </Unlockable>      
        <Unlockable isSlider interfaceId="projectile/velocity">
          <SliderNotched
            formLabel="Velocity"
            options={[.1, .5, 1, 1.5, 2, 5, 10]}
            step={.05}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { velocity: value }}}})        
            }}
            value={classSelected.projectile.ammo}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId="projectile/Ammo">
          <SliderNotched
            formLabel="Ammo"
            options={[1, 5, 10, 20, 50, 1000, 2000]}
            step={1}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { ammo: value }}}})        
            }}
            value={classSelected.projectile.ammo}
          />
        </Unlockable>
      </>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(ProjectileEditor);
