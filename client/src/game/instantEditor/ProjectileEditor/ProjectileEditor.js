import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';

import './ProjectileEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import SelectClass from '../../ui/SelectClass/SelectClass';
import ControlsCard from '../../ui/ControlsCard/ControlsCard';
import { PROJECTILE_CLASS_IID, PROJECTILE_COOLDOWN_IID, PROJECTILE_LIFETIME_IID, PROJECTILE_SPEED_IID } from '../../../constants/interfaceIds';
import { PLAYER_CLASS, PROJECTILE_TARGET_CLASS } from '../../constants';
import SelectProjectileBehavior from '../../ui/SelectProjectileBehavior/SelectProjectileBehavior';

        // {false && <Unlockable isSlider interfaceId={PROJECTILE_AMMO_IID}>
        //   <SliderNotched
        //     formLabel="Ammo"
        //     options={[1, 5, 10, 20, 50, 1000, 2000]}
        //     step={1}
        //     onChangeCommitted={(value) => {
        //       editGameModel({ entityClasses: { [entityClassId]: { projectile: { ammo: value }}}})        
        //     }}
        //     value={classSelected.projectile.ammo}
        //   />
        // </Unlockable>}

const ProjectileEditor = ({ entityClassId, gameModel: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.entityClasses[entityClassId]
  const projectileClass = gameModel.entityClasses[classSelected.projectile?.entityClassId]

  return (
    <div className="ProjectileEditor">
      <Unlockable interfaceId={PROJECTILE_CLASS_IID}>
        <SelectClass 
          formLabel="Projectile Class"
          value={classSelected.projectile.entityClassId ? [classSelected.projectile.entityClassId] : []}
          onChange={(event, entityClasses) => {
            const newClassId = entityClasses[entityClasses.length-1]
            editGameModel({ entityClasses: { [entityClassId]: { projectile: { entityClassId: newClassId ? newClassId : null  }}}})        
         }}/>
      </Unlockable>
      {classSelected.movement.movementControlsBehavior && <ControlsCard entityClass={classSelected} projectileClass={projectileClass}></ControlsCard>}
      {projectileClass && <>
        {classSelected.classInterfaceCategory !== PLAYER_CLASS && <Unlockable interfaceId={PROJECTILE_SPEED_IID}>
          <SelectProjectileBehavior
            formLabel="Behavior"
            value={classSelected.projectile.projectileBehavior ? [classSelected.projectile.projectileBehavior] : []}
            onChange={(event, projectileBehavior) => {
              editGameModel({ entityClasses: { [entityClassId]: { projectile: { projectileBehavior: projectileBehavior[projectileBehavior.length-1] } } }})    
            }}/>
        </Unlockable>}
        {classSelected.projectile.projectileBehavior === PROJECTILE_TARGET_CLASS && <Unlockable interfaceId={PROJECTILE_SPEED_IID}>
          <SelectClass
            formLabel="Target Class"
            value={classSelected.projectile.targetClassId ? [classSelected.projectile.targetClassId] : []}
            onChange={(event, entityClasses) => {
              const newClassId = entityClasses[entityClasses.length-1]
              editGameModel({ entityClasses: { [entityClassId]: { projectile: { targetClassId: newClassId ? newClassId : null  }}}})        
          }}/>
        </Unlockable>}
        <Unlockable isSlider interfaceId={PROJECTILE_SPEED_IID}>
          <SliderNotched
            formLabel="Speed"
            options={[1, 10, 100, 200, 300, 500, 1000]}
            step={10}
            onChangeCommitted={(value) => {
              editGameModel({ entityClasses: { [entityClassId]: { projectile: { speed: value }}}})        
            }}
            value={classSelected.projectile.speed}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId={PROJECTILE_COOLDOWN_IID}>
          <SliderNotched
            formLabel="Cooldown"
            options={[1, 5, 20, 50, 100, 200, 500]}
            step={1}
            onChangeCommitted={(value) => {
              editGameModel({ entityClasses: { [entityClassId]: { projectile: { cooldown: value }}}})        
            }}
            value={classSelected.projectile.cooldown}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId={PROJECTILE_LIFETIME_IID}>
          <SliderNotched
            formLabel="Lifetime"
            step={10}
            options={[30, 100, 200, 500, 1000, 2000, 5000, 10000]}
            onChangeCommitted={(value) => {
              editGameModel({ entityClasses: { [entityClassId]: { projectile: { lifetime: value }}}})        
            }}
            value={classSelected.projectile.lifetime}
          />
        </Unlockable>      
      </>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { editGameModel })(ProjectileEditor);
