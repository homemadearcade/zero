import React, { useState } from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './MovementEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import SelectMovementPattern from '../../ui/SelectMovementPattern/SelectMovementPattern';
import SelectControls from '../../ui/SelectControls/SelectControls';
import { movementToParemeters } from '../../defaultData/movement';
import Button from '../../../ui/Button/Button';
import { HERO_CLASS, ADVANCED_DIRECTIONAL_CONTROLS, VEHICLE_CONTROLS } from '../../constants';
import ControlsCard from '../../ui/ControlsCard/ControlsCard';

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

const MovementEditor = ({ classId, gameModel: { gameModel }, editGameModel, auth: { me } }) => {
  const [seeAllParameters, setSeeAllParameters] = useState()
  const classSelected = gameModel.classes[classId]

  let movementParameters = classSelected.movement.controls ? movementToParemeters[classSelected.movement.controls] : movementToParemeters[classSelected.movement.pattern]

  if(seeAllParameters) {
    movementParameters = {
      ground: true,
      air: true,
      velocityX: true,
      velocityY: true,
      speed: true,
      gravityX: true,
      gravityY: true,
      dragX: true,
      dragY: true,
      cooldown: true,
      bounce: true,
      ignoreGravity: true,
      disableDownKey: true
    }
  }

  return (
    <div className="MovementEditor">
      {classSelected.type === HERO_CLASS && <Unlockable interfaceId="movement/controls/type">
        <SelectControls
          formLabel="Controls"
          value={classSelected.movement.controls ? [classSelected.movement.controls] : []}
          onChange={(event, controls) => {
            editGameModel({ classes: { [classId]: { ...controls[controls.length-1] } }})    
        }}/>
      </Unlockable>}
      {classSelected.type !== HERO_CLASS && <Unlockable interfaceId="movement/pattern">
        <SelectMovementPattern
          formLabel="Pattern"
          value={classSelected.movement.pattern ? [classSelected.movement.pattern] : []}
          onChange={(event, pattern) => {
            editGameModel({ classes: { [classId]: { ...pattern[pattern.length-1] } }})    
          }}/>
      </Unlockable>}
      {classSelected.movement.controls && <ControlsCard objectClass={classSelected} controlScheme={classSelected.movement.controls} jumpStyle={classSelected.jump.style}></ControlsCard>}
      {movementParameters.speed &&<Unlockable interfaceId="movement/speed">
        <SliderNotched
          formLabel={movementParameters.speed.length ? movementParameters.speed : "Speed"}
          options={[1, 5, 20, 100]}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { speed: value } }}})        
          }}
          value={classSelected.movement.speed}
        />
      </Unlockable>}
      {movementParameters.velocityY && <Unlockable interfaceId="movement/velocity/vertical">
        <SliderNotched
          formLabel={movementParameters.velocityY.length ? movementParameters.velocityY : "Starting Velocity ⇵"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { velocityY: value} }}})        
          }}
          value={classSelected.movement.velocityY}
        />
      </Unlockable>}
      {movementParameters.velocityX && <Unlockable interfaceId="movement/velocity/horizontal">
        <SliderNotched
          formLabel={movementParameters.velocityX.length ? movementParameters.velocityX : "Starting Velocity ⇆"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { velocityX: value} }}})        
          }}
          value={classSelected.movement.velocityX}
        />
      </Unlockable>}
      {movementParameters.dragY && <Unlockable isSlider interfaceId="movement/sliders/drag/vertical">
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
       {movementParameters.dragX && <Unlockable isSlider interfaceId="movement/sliders/drag/horizontal">
        <SliderNotched
          formLabel="Speed Decrease ⇆"
          step={0.01}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { dragX: 1 - value } }}})        
          }}
          value={1 - classSelected.movement.dragX}
        />
       </Unlockable>}
       {movementParameters.gravityY && <Unlockable isSlider interfaceId="movement/gravity/vertical">
        <SliderNotched
          formLabel={movementParameters.gravityY.length ? movementParameters.gravityY : "Gravity ⇵"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { gravityY: value} }}})        
          }}
          value={classSelected.movement.gravityY}
        />
      </Unlockable>}
      {movementParameters.gravityX && <Unlockable isSlider interfaceId="movement/gravity/horizontal">
        <SliderNotched
          formLabel={movementParameters.gravityX.length ? movementParameters.gravityX : "Gravity ⇆"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { gravityX: value} }}})        
          }}
          value={classSelected.movement.gravityX}
        />
      </Unlockable>}
      {movementParameters.bounce && <Unlockable isSlider interfaceId="physics/sliders/bounce">
        <SliderNotched
          formLabel="Bounce"
          step={0.05}
          options={[0, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { bounciness: value } }}})        
          }}
          value={classSelected.collisionResponse.bounciness}
        />
      </Unlockable>}
      {movementParameters.ignoreGravity && <Unlockable interfaceId="movement/toggle/ignoreGravity">
        <Switch
          size="small"
          labels={['No Gravity', 'Gravity']}
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { ignoreGravity: !e.target.checked }}}})        
          }}
          checked={!classSelected.movement.ignoreGravity}
         />
      </Unlockable>}
      {<Unlockable interfaceId="physics/toggle/immovable">
        <Switch
          labels={['Collisions', 'No Collisions']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { immovable: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.immovable}
         />
      </Unlockable>}
      {movementParameters.disableDownKey && <Unlockable interfaceId="advanced/disableDownKey">
        <Switch
          labels={['Enable Down', 'Disable Down']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { disableDownKey: e.target.checked }}}})        
          }}
          checked={classSelected.movement.disableDownKey}
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

export default connect(mapStateToProps, { editGameModel })(MovementEditor);
