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
import { PLAYER_CLASS } from '../../constants';
import ControlsCard from '../../ui/ControlsCard/ControlsCard';
import { MOVEMENT_CONTROLS_DOWN_IID, MOVEMENT_CONTROLS_TYPE_IID, MOVEMENT_DRAG_ANGULAR_IID, MOVEMENT_DRAG_X_IID, MOVEMENT_DRAG_Y_IID, MOVEMENT_GRAVITY_X_IID, MOVEMENT_GRAVITY_Y_IID, MOVEMENT_IGNORE_GRAVITY_IID, MOVEMENT_PATTERN_IID, MOVEMENT_SPEED_ANGULAR_IID, MOVEMENT_SPEED_IID, MOVEMENT_VELOCITY_X_IID, MOVEMENT_VELOCITY_Y_IID, PHYSICS_BOUNCE_IID, TOGGLE_ALL_PARAMS_IID } from '../../../constants/interfaceIds';
import SelectClass from '../../ui/SelectClass/SelectClass';


const MovementEditor = ({ classId, gameModel: { gameModel }, editGameModel, auth: { me } }) => {
  const [seeAllParameters, setSeeAllParameters] = useState()
  const classSelected = gameModel.classes[classId]

  let movementParameters = classSelected.movement.controls ? movementToParemeters[classSelected.movement.controls] : movementToParemeters[classSelected.movement.pattern]

  if(seeAllParameters) {
    movementParameters = {
      class: true,
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
      {classSelected.type === PLAYER_CLASS && <Unlockable interfaceId={MOVEMENT_CONTROLS_TYPE_IID}>
        <SelectControls
          formLabel="Controls"
          value={classSelected.movement.controls ? [classSelected.movement.controls] : []}
          onChange={(event, controls) => {
            editGameModel({ classes: { [classId]: { ...controls[controls.length-1] } }})    
        }}/>
      </Unlockable>}
      {classSelected.type !== PLAYER_CLASS && <Unlockable interfaceId={MOVEMENT_PATTERN_IID}>
        <SelectMovementPattern
          formLabel="Pattern"
          value={classSelected.movement.pattern ? [classSelected.movement.pattern] : []}
          onChange={(event, pattern) => {
            editGameModel({ classes: { [classId]: { ...pattern[pattern.length-1] } }})    
          }}/>
      </Unlockable>}
      {movementParameters.class && <SelectClass
          formLabel="Following Class"
          value={classSelected.movement.classId ? [classSelected.movement.classId] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            editGameModel({ classes: { [classId]: { movement: { classId: newClassId ? newClassId : null  }}}})        
      }}/>}
      {classSelected.movement.controls && <ControlsCard objectClass={classSelected} controlScheme={classSelected.movement.controls} jumpStyle={classSelected.jump.style}></ControlsCard>}
      {movementParameters.speed &&<Unlockable interfaceId={MOVEMENT_SPEED_IID}>
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
      {movementParameters.velocityY && <Unlockable interfaceId={MOVEMENT_VELOCITY_Y_IID}>
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
      {movementParameters.velocityX && <Unlockable interfaceId={MOVEMENT_VELOCITY_X_IID}>
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
      {movementParameters.speedAngular && <Unlockable isSlider interfaceId={MOVEMENT_SPEED_ANGULAR_IID}>
        <SliderNotched
          formLabel={movementParameters.speedAngular.length ? movementParameters.speedAngular : "Rotation Speed ⟲"}
          options={[1, 20, 100, 200, 400]}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { speedAngular: value } }}})        
          }}
          value={classSelected.movement.speedAngular}
        />
       </Unlockable>}
      {movementParameters.dragAngular && <Unlockable isSlider interfaceId={MOVEMENT_DRAG_ANGULAR_IID}>
        <SliderNotched
          formLabel="Rotation Speed Decrease ⟲"
          step={0.01}
          options={[0, 20, 100, 200, 400]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { dragAngular: value } }}})        
          }}
          value={classSelected.movement.dragAngular}
        />
       </Unlockable>}
      {movementParameters.dragY && <Unlockable isSlider interfaceId={MOVEMENT_DRAG_Y_IID}>
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
       {movementParameters.dragX && <Unlockable isSlider interfaceId={MOVEMENT_DRAG_X_IID}>
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
       {movementParameters.gravityY && <Unlockable isSlider interfaceId={MOVEMENT_GRAVITY_Y_IID}>
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
      {movementParameters.gravityX && <Unlockable isSlider interfaceId={MOVEMENT_GRAVITY_X_IID}>
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
      {movementParameters.bounce && <Unlockable isSlider interfaceId={PHYSICS_BOUNCE_IID}>
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
      {movementParameters.ignoreGravity && <Unlockable interfaceId={MOVEMENT_IGNORE_GRAVITY_IID}>
        <Switch
          size="small"
          labels={['No Gravity', 'Gravity']}
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { ignoreGravity: !e.target.checked }}}})        
          }}
          checked={!classSelected.movement.ignoreGravity}
         />
      </Unlockable>}
      {movementParameters.disableDownKey && <Unlockable interfaceId={MOVEMENT_CONTROLS_DOWN_IID}>
        <Switch
          labels={['Enable Down', 'Disable Down']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { disableDownKey: e.target.checked }}}})        
          }}
          checked={classSelected.movement.disableDownKey}
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

export default connect(mapStateToProps, { editGameModel })(MovementEditor);
