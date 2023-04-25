import React, { useState } from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';

import './JumpEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import { advancedDirectionalDefaults } from '../../constants';
import Button from '../../../ui/Button/Button';
import { ADVANCED_DIRECTIONAL_CONTROLS } from '../../constants';
import ControlsCard from '../../ui/ControlsCard/ControlsCard';
import SelectJumpControlsBehavior from '../../ui/SelectJumpControlsBehavior/SelectJumpControlsBehavior';
import { jumpControlsBehaviorToParemeters } from '../../constants';
import { JUMP_AIR_IID, JUMP_COOLDOWN_IID, JUMP_GROUND_IID, JUMP_BEHAVIOR_IID, MOVEMENT_CONTROLS_BEHAVIOR_IID, MOVEMENT_DRAG_Y_IID, MOVEMENT_IGNORE_GRAVITY_IID, TOGGLE_ALL_PARAMS_IID, PLAYER_ENTITY_IID } from '../../../constants/interfaceIds';

const JumpEditor = ({ entityModelId, gameModel: { gameModel }, editGameModel, auth: { me } }) => {
  const [seeAllParameters, setSeeAllParameters] = useState()
  const entitySelected = gameModel.entityModels[entityModelId]

  const incompatibleErrors = []

  if(entitySelected.movement.movementControlsBehavior !== ADVANCED_DIRECTIONAL_CONTROLS) {
    incompatibleErrors.push('Movement control scheme must be the Advanced Directional scheme to use Jump')
    incompatibleErrors.push(<Unlockable interfaceId={MOVEMENT_CONTROLS_BEHAVIOR_IID}>
        <Button
          onClick={(e) => {
            editGameModel({ entityModels: { [entityModelId]:  {...advancedDirectionalDefaults } }})        
          }}
         >Set</Button>
      </Unlockable>)
  }

  if(entitySelected.movement.ignoreGravity) {
    incompatibleErrors.push('Gravity must be turned on in order to use Jump')
    incompatibleErrors.push(<Unlockable key="gravity" interfaceId={MOVEMENT_IGNORE_GRAVITY_IID}>
        <Switch
          size="small"
          labels={['No Gravity', 'Gravity']}
          onChange={(e) => {
            editGameModel({ entityModels: { [entityModelId]: { movement: { ignoreGravity: !e.target.checked }}}})        
          }}
          checked={!entitySelected.movement.ignoreGravity}
         />
      </Unlockable>)
  }

  if(incompatibleErrors.length) {
    return <div className="JumpEditor">
      {incompatibleErrors.map((error, index) => {
        return <div key={index}><br></br><br></br>{error}</div>
      })}
    </div>
  }

  let jumpParameters = jumpControlsBehaviorToParemeters[entitySelected.jump.jumpControlsBehavior]

  if(seeAllParameters) {
    jumpParameters = {
      air: true,
      ground: true,
      cooldown: true,
      dragY: true,
      gravityY: true,
    }
  }

  return (
    <div className="JumpEditor">
      {entitySelected.entityIID === PLAYER_ENTITY_IID && <Unlockable interfaceId={JUMP_BEHAVIOR_IID}>
        <SelectJumpControlsBehavior
          formLabel="Behavior"
          value={entitySelected.jump.jumpControlsBehavior ? [entitySelected.jump.jumpControlsBehavior] : []}
          onChange={(event, jumpControlsBehavior) => {
            editGameModel({ entityModels: { [entityModelId]: { ...jumpControlsBehavior[jumpControlsBehavior.length-1] } }})    
          }}/>
      </Unlockable>}
      {entitySelected.movement.movementControlsBehavior && <ControlsCard entityModel={entitySelected} jumpControlsBehavior={entitySelected.jump.jumpControlsBehavior}></ControlsCard>}
      {jumpParameters.ground && <Unlockable interfaceId={JUMP_GROUND_IID}>
        <SliderNotched
          formLabel={jumpParameters.ground.length ? jumpParameters.ground : "Ground Jump Speed"}
          options={[50, 100, 200, 300, 400, 500]}
          step={10}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { jump: { ground: value } }}})        
          }}
          value={entitySelected.jump.ground}
        />
      </Unlockable>}
      {jumpParameters.air && <Unlockable  interfaceId={JUMP_AIR_IID}>
        <SliderNotched
          formLabel={jumpParameters.air.length ? jumpParameters.air : "Air Jump Speed"}
          options={[10, 50, 100, 200, 300, 400, 500]}
          step={10}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { jump: { air: value } }}})        
          }}
          value={entitySelected.jump.air}
        />
      </Unlockable>}
      {jumpParameters.cooldown && <Unlockable isSlider interfaceId={JUMP_COOLDOWN_IID}>
        <SliderNotched
          formLabel={jumpParameters.cooldown.length ? jumpParameters.cooldown : "Air Jump Cooldown"}
          options={[50, 100, 200, 500, 1000, 2000, 5000]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { jump: { cooldown: value} }}})        
          }}
          value={entitySelected.jump.cooldown}
        />
      </Unlockable>}
      {jumpParameters.dragY && <Unlockable isSlider interfaceId={MOVEMENT_DRAG_Y_IID}>
        <SliderNotched
          formLabel="Speed Decrease ⇵"
          step={0.01}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { movement: { dragY: 1 - value } }}})        
          }}
          value={1 - entitySelected.movement.dragY}
        />
       </Unlockable>}
      <Unlockable interfaceId={TOGGLE_ALL_PARAMS_IID}>
        <Button onClick={() => {
        setSeeAllParameters(!seeAllParameters)
        }}>See All Parameters</Button>
      </Unlockable>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  auth: state.auth
});

export default connect(mapStateToProps, { editGameModel })(JumpEditor);
