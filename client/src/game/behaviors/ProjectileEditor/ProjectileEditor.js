import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';

import './ProjectileEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import SelectEntityModel from '../../ui/SelectEntityModel/SelectEntityModel';
import PlayerControlsCard from '../../selector/PlayerControlsCard/PlayerControlsCard';
import { PLAYER_ENTITY_IID, PROJECTILE_COOLDOWN_IID, PROJECTILE_LIFETIME_IID, PROJECTILE_SPEED_IID, PROJECTILE_ENTITY_SELECTOR_IID, PROJECTILE_ENTITY_IID, PROJECTILE_ENTITY_TARGET_SELECTOR_IID } from '../../../constants/interfaceIds';
import { PROJECTILE_TARGET_ENTITY_MODEL } from '../../constants';
import SelectProjectileBehavior from '../../ui/SelectProjectileBehavior/SelectProjectileBehavior';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';

        // {false && <Unlockable isSlider interfaceId={PROJECTILE_AMMO_IID}>
        //   <SliderNotched
        //     formLabel="Ammo"
        //     options={[1, 5, 10, 20, 50, 1000, 2000]}
        //     step={1}
        //     onChangeCommitted={(value) => {
        //       editGameModel({ entityModels: { [entityModelId]: { projectile: { ammo: value }}}})        
        //     }}
        //     value={entitySelected.projectile.ammo}
        //   />
        // </Unlockable>}

const ProjectileEditor = ({ entityModelId, gameModel: { gameModel }, editGameModel }) => {
  const entitySelected = gameModel.entityModels[entityModelId]
  const projectileEntityModel = gameModel.entityModels[entitySelected?.projectile?.entityModelId]

  return (
    <div className="ProjectileEditor">
      <Unlockable interfaceId={PROJECTILE_ENTITY_SELECTOR_IID}>
        <SelectEntityModel 
          interfaceId={PROJECTILE_ENTITY_SELECTOR_IID}
          formLabel="Projectile"
          hideEntityModelsIds={[entityModelId]}
          entityModelClass={PROJECTILE_ENTITY_IID}
          value={entitySelected.projectile.entityModelId ? [entitySelected.projectile.entityModelId] : []}
          onChange={(event, entityModels) => {
            const newEntityId = entityModels[entityModels.length-1]
            editGameModel({ entityModels: { [entityModelId]: { projectile: { entityModelId: newEntityId ? newEntityId : null  }}}})        
         }}/>
      </Unlockable>
      {entitySelected.movement.movementControlsBehavior && <PlayerControlsCard entityModel={entitySelected} projectileEntityModel={projectileEntityModel}></PlayerControlsCard>}
      {projectileEntityModel && <>
        {entitySelected.entityClassIID !== PLAYER_ENTITY_IID && <Unlockable interfaceId={PROJECTILE_SPEED_IID}>
          <SelectProjectileBehavior
            formLabel="Behavior"
            value={entitySelected.projectile.projectileBehavior ? [entitySelected.projectile.projectileBehavior] : []}
            onChange={(event, projectileBehavior) => {
              editGameModel({ entityModels: { [entityModelId]: { projectile: { projectileBehavior: projectileBehavior[projectileBehavior.length-1] } } }})    
            }}/>
        </Unlockable>}
        {entitySelected.projectile.projectileBehavior === PROJECTILE_TARGET_ENTITY_MODEL && <Unlockable interfaceId={PROJECTILE_TARGET_ENTITY_MODEL}>
          <SelectRelationTag
            formLabel="Target"
            interfaceId={PROJECTILE_ENTITY_TARGET_SELECTOR_IID}
            value={entitySelected.projectile.targetRelationTagId ? [entitySelected.projectile.targetRelationTagId] : []}
            onChange={(event, entityModels) => {
              const newEntityId = entityModels[entityModels.length-1]
              editGameModel({ entityModels: { [entityModelId]: { projectile: { targetRelationTagId: newEntityId ? newEntityId : null  }}}})        
          }}/>
        </Unlockable>}
        <Unlockable isSlider interfaceId={PROJECTILE_SPEED_IID}>
          <SliderNotched
            formLabel="Speed"
            options={[1, 10, 100, 200, 300, 500, 1000]}
            step={10}
            onChangeCommitted={(value) => {
              editGameModel({ entityModels: { [entityModelId]: { projectile: { speed: value }}}})        
            }}
            value={entitySelected.projectile.speed}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId={PROJECTILE_COOLDOWN_IID}>
          <SliderNotched
            formLabel="Cooldown"
            options={[1, 5, 20, 50, 100, 200, 500]}
            step={1}
            onChangeCommitted={(value) => {
              editGameModel({ entityModels: { [entityModelId]: { projectile: { cooldown: value }}}})        
            }}
            value={entitySelected.projectile.cooldown}
          />
        </Unlockable>
        <Unlockable isSlider interfaceId={PROJECTILE_LIFETIME_IID}>
          <SliderNotched
            formLabel="Lifetime"
            step={10}
            options={[30, 100, 200, 500, 1000, 2000, 5000, 10000]}
            onChangeCommitted={(value) => {
              editGameModel({ entityModels: { [entityModelId]: { projectile: { lifetime: value }}}})        
            }}
            value={entitySelected.projectile.lifetime}
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
