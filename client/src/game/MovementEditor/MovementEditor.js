import React, { useState } from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './MovementEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import Switch from '../../app/ui/Switch/Switch';
import FormLabel from '../../app/ui/FormLabel/FormLabel';
import SelectMovementPattern from '../ui/SelectMovementPattern/SelectMovementPattern';
import SelectControls from '../ui/SelectControls/SelectControls';
import { movementToParemeters } from '../../defaultData/movement';
import Button from '../../app/ui/Button/Button';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';

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

const MovementEditor = ({ classId, game: { gameModel }, editGameModel, auth: { me } }) => {
  const [seeAllParameters, setSeeAllParameters] = useState()
  const classSelected = gameModel.classes[classId]

  let parameters = classSelected.movement.controls ? movementToParemeters[classSelected.movement.controls] : movementToParemeters[classSelected.movement.pattern]
  
  if(seeAllParameters) {
    parameters = {
      jumpSpeed: true,
      velocityX: true,
      velocityY: true,
      speed: true,
      gravityX: true,
      gravityY: true,
      dragX: true,
      dragY: true,
      bounce: true
    }
  }

  return (
    <div className="MovementEditor">
      <ClassMemberTitle title="Movement" classId={classId}/>
      <Unlockable interfaceId="movement/masterToggle">
        <Button onClick={() => {
        setSeeAllParameters(!seeAllParameters)
        }}>Toggle See All Parameters</Button>
      </Unlockable>
      {classSelected.type === 'hero' && <Unlockable interfaceId="movement/controls/type">
        <SelectControls
          formLabel="Controls"
          value={classSelected.movement.controls ? [classSelected.movement.controls] : []}
          onChange={(event, type) => {
          editGameModel({ classes: { [classId]: { movement: { controls: type[type.length-1]} } }})        
        }}/>
      </Unlockable>}
      {classSelected.type !== 'hero' && <Unlockable interfaceId="movement/pattern">
        <SelectMovementPattern
          formLabel="Pattern"
          value={classSelected.movement.pattern ? [classSelected.movement.pattern] : []}
          onChange={(event, pattern) => {
            editGameModel({ classes: { [classId]: { ...pattern[pattern.length-1] } }})    
          }}/>
      </Unlockable>}
      {parameters.jumpSpeed && <Unlockable interfaceId="movement/speed">
        <SliderNotched
          formLabel={parameters.jumpSpeed.length ? parameters.jumpSpeed : "Jump Speed"}
          options={[50, 100, 200, 300, 400, 500]}
          step={10}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { jumpSpeed: value } }}})        
          }}
          value={classSelected.movement.jumpSpeed}
        />
      </Unlockable>}
      {parameters.velocityY && <Unlockable interfaceId="movement/velocity/vertical">
        <SliderNotched
          formLabel={parameters.velocityY.length ? parameters.velocityY : "Vertical Velocity"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { velocityY: value} }}})        
          }}
          value={classSelected.movement.velocityY}
        />
      </Unlockable>}
      {parameters.velocityX && <Unlockable interfaceId="movement/velocity/horizontal">
        <SliderNotched
          formLabel={parameters.velocityX.length ? parameters.velocityX : "Horizontal Velocity"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { velocityX: value} }}})        
          }}
          value={classSelected.movement.velocityX}
        />
      </Unlockable>}
      {parameters.speed &&<Unlockable interfaceId="movement/speed">
        <SliderNotched
          formLabel={parameters.speed.length ? parameters.speed : "Speed"}
          options={[1, 5, 20, 100]}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { speed: value } }}})        
          }}
          value={classSelected.movement.speed}
        />
      </Unlockable>}
      {parameters.dragY && <Unlockable isSlider interfaceId="movement/sliders/drag/vertical">
        <SliderNotched
          formLabel="Vertical Slow Down"
          step={0.01}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { dragY: 1 - value } }}})        
          }}
          value={1 - classSelected.movement.dragY}
        />
       </Unlockable>}
       {parameters.dragX && <Unlockable isSlider interfaceId="movement/sliders/drag/horizontal">
        <SliderNotched
          formLabel="Horizontal Slow Down"
          step={0.01}
          options={[0, .01, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { dragX: 1 - value } }}})        
          }}
          value={1 - classSelected.movement.dragX}
        />
       </Unlockable>}
       {parameters.gravityY && <Unlockable isSlider interfaceId="movement/gravity/vertical">
        <SliderNotched
          formLabel={parameters.gravityY.length ? parameters.gravityY : "Vertical Gravity"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { gravityY: value} }}})        
          }}
          value={classSelected.movement.gravityY}
        />
      </Unlockable>}
      {parameters.gravityX && <Unlockable isSlider interfaceId="movement/gravity/horizontal">
        <SliderNotched
          formLabel={parameters.gravityX.length ? parameters.gravityX : "Horizontal Gravity"}
          options={[-100, -20, -5, 0, 1, 5, 20, 100]}
          step={1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { movement: { gravityX: value} }}})        
          }}
          value={classSelected.movement.gravityX}
        />
      </Unlockable>}
      {parameters.bounce && <Unlockable isSlider interfaceId="physics/sliders/bounce">
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
      <Unlockable interfaceId="movement/toggle/ignoreGravity">
        <FormLabel>Ignore Gravity</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { movement: { ignoreGravity: e.target.checked }}}})        
          }}
          checked={classSelected.movement.ignoreGravity}
         />
      </Unlockable>
      {<Unlockable interfaceId="physics/toggle/immovable">
        <FormLabel>Free Movement</FormLabel>
        <Switch
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { immovable: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.immovable}
         />
      </Unlockable>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
  auth: state.auth
});

export default connect(mapStateToProps, { editGameModel })(MovementEditor);
