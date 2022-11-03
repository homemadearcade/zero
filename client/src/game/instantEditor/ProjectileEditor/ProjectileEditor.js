import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameActions';

import './ProjectileEditor.scss'
import SliderNotched from '../../../components/ui/SliderNotched/SliderNotched';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import SelectClass from '../../ui/SelectClass/SelectClass';

const ProjectileEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]
  const projectileClass = gameModel.classes[classSelected.projectile?.classId]

  return (
    <div className="ProjectileEditor">
      <Unlockable interfaceId="projectile/class">
        <SelectClass 
          formLabel="Projectile Class"
          value={classSelected.projectile.classId ? [classSelected.projectile.classId] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            editGameModel({ classes: { [classId]: { projectile: { classId: newClassId ? newClassId : null  }}}})        
         }}/>
      </Unlockable>
      {projectileClass && <>
        <Unlockable isSlider interfaceId="projectile/cooldown">
          <SliderNotched
            formLabel="Cooldown"
            options={[1, 5, 20, 50, 100, 200, 500]}
            step={1}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { cooldown: value }}}})        
            }}
            value={classSelected.projectile.cooldown}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId="projectile/lifetime">
          <SliderNotched
            formLabel="Lifetime"
            step={10}
            options={[30, 100, 200, 500, 1000, 2000, 5000, 10000]}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { lifetime: value }}}})        
            }}
            value={classSelected.projectile.lifetime}
          />
        </Unlockable>      
        <Unlockable isSlider interfaceId="projectile/speed">
          <SliderNotched
            formLabel="Speed"
            options={[1, 10, 100, 200, 300, 500, 1000]}
            step={10}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { speed: value }}}})        
            }}
            value={classSelected.projectile.speed}
          />
        </Unlockable>
        {false && <Unlockable isSlider interfaceId="projectile/Ammo">
          <SliderNotched
            formLabel="Ammo"
            options={[1, 5, 10, 20, 50, 1000, 2000]}
            step={1}
            onChangeCommitted={(value) => {
              editGameModel({ classes: { [classId]: { projectile: { ammo: value }}}})        
            }}
            value={classSelected.projectile.ammo}
          />
        </Unlockable>}
      </>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(ProjectileEditor);
