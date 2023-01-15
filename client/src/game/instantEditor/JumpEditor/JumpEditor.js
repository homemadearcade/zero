import React, { useState } from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './JumpEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import SelectMovementPattern from '../../ui/SelectMovementPattern/SelectMovementPattern';
import SelectControls from '../../ui/SelectControls/SelectControls';
import { advancedDirectionalDefaults, movementToParemeters } from '../../defaultData/movement';
import Button from '../../../ui/Button/Button';
import { HERO_CLASS, JUMP_CONSTANT, ADVANCED_DIRECTIONAL_CONTROLS, VEHICLE_CONTROLS } from '../../constants';
import ControlsCard from '../../ui/ControlsCard/ControlsCard';
import SelectJumping from '../../ui/SelectJump/SelectJumping';
import { jumpStyleToParemeters } from '../../defaultData/jumping';

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

const JumpEditor = ({ classId, gameModel: { gameModel }, editGameModel, auth: { me } }) => {
  const [seeAllParameters, setSeeAllParameters] = useState()
  const classSelected = gameModel.classes[classId]

  const incompatibleErrors = []

  if(classSelected.movement.controls !== ADVANCED_DIRECTIONAL_CONTROLS) {
    incompatibleErrors.push('Movement control scheme must be the Advanced Directional scheme to use Jump')
    incompatibleErrors.push(<Unlockable interfaceId="movement/toggle/ignoreGravity">
        <Button
          onClick={(e) => {
            editGameModel({ classes: { [classId]:  {...advancedDirectionalDefaults } }})        
          }}
         >Set</Button>
      </Unlockable>)
  }

  if(classSelected.movement.ignoreGravity) {
    incompatibleErrors.push('Gravity must be turned on in order to use Jump')
    incompatibleErrors.push(<Unlockable interfaceId="movement/toggle/ignoreGravity">
        <Switch
          size="small"
          labels={['No Gravity', 'Gravity']}
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { ignoreGravity: !e.target.checked }}}})        
          }}
          checked={!classSelected.movement.ignoreGravity}
         />
      </Unlockable>)
  }

  if(incompatibleErrors.length) {
    return <div className="JumpEditor">
      {incompatibleErrors.map((error) => {
        return <div><br></br><br></br>{error}</div>
      })}
    </div>
  }

  let jumpParameters = jumpStyleToParemeters[classSelected.jump.style]

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
      {classSelected.type === HERO_CLASS && <Unlockable interfaceId="jump/style">
        <SelectJumping
          formLabel="Style"
          value={classSelected.jump.style ? [classSelected.jump.style] : []}
          onChange={(event, jumpStyle) => {
            editGameModel({ classes: { [classId]: { ...jumpStyle[jumpStyle.length-1] } }})    
          }}/>
      </Unlockable>}
      {classSelected.movement.controls && <ControlsCard objectClass={classSelected} jumpStyle={classSelected.jump.style}></ControlsCard>}
      {jumpParameters.ground && <Unlockable interfaceId="jump/ground">
        <SliderNotched
          formLabel={jumpParameters.ground.length ? jumpParameters.ground : "Ground Jump Speed"}
          options={[50, 100, 200, 300, 400, 500]}
          step={10}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { jump: { ground: value } }}})        
          }}
          value={classSelected.jump.ground}
        />
      </Unlockable>}
      {jumpParameters.air && <Unlockable interfaceId="jump/air">
        <SliderNotched
          formLabel={jumpParameters.air.length ? jumpParameters.air : "Air Jump Speed"}
          options={[10, 50, 100, 200, 300, 400, 500]}
          step={10}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { jump: { air: value } }}})        
          }}
          value={classSelected.jump.air}
        />
      </Unlockable>}
      {jumpParameters.cooldown && <Unlockable isSlider interfaceId="jump/cooldown">
        <SliderNotched
          formLabel={jumpParameters.cooldown.length ? jumpParameters.cooldown : "Air Jump Cooldown"}
          options={[50, 100, 200, 500, 1000, 2000, 5000]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { jump: { cooldown: value} }}})        
          }}
          value={classSelected.jump.cooldown}
        />
      </Unlockable>}
      {jumpParameters.dragY && <Unlockable isSlider interfaceId="movement/sliders/drag/vertical">
        <SliderNotched
          formLabel="Speed Decrease ⇵"
          step={0.01}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { dragY: 1 - value } }}})        
          }}
          value={1 - classSelected.movement.dragY}
        />
       </Unlockable>}
      <Unlockable interfaceId="toggleAllParams">
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
