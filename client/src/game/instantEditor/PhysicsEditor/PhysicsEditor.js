import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './PhysicsEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import { FormLabel } from '@mui/material';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import SelectColliders from '../../ui/SelectColliders/SelectColliders';
import { EFFECT_COLLIDE, ON_COLLIDE, ON_COLLIDE_ACTIVE, PLAYGROUND_CANVAS_ID, RELATION_ID_PREFIX } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import _, { last } from 'lodash';
import { getOppositeRelationClassId } from '../../../utils/gameUtils';
import SelectSides from '../../ui/SelectSides/SelectSides';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';


// {false && <Unlockable interfaceId="physics/toggle/useMass">
// <FormLabel>Use Mass For Weight</FormLabel>
// <Switch
//   size="small"
//   onChange={(e) => {
//     editGameModel({ classes: { [classId]: { collisionResponse: { useMass: e.target.checked }}}})        
//   }}
//   checked={classSelected.collisionResponse.useMass}
// />
// </Unlockable>}
// {false && <Unlockable interfaceId="physics/toggle/fixedRotation">
// <FormLabel>Fixed Rotation</FormLabel>
// <Switch
//   size="small"
//   onChange={(e) => {
//     editGameModel({ classes: { [classId]: { attributes: { fixedRotation: e.target.checked }}}})        
//   }}
//   checked={classSelected.attributes.fixedRotation}
//  />
// </Unlockable>}
// {false && !classSelected.useMass &&  
//   <Unlockable isSlider interfaceId="physics/sliders/weight/density">
//    <SliderNotched
//      formLabel="Weight (Density)"
//      step={0.001}
//      options={[.001, .01, 0.1, 0.25, 0.5, 0.75, 1]}
//      onChangeCommitted={(value) => {
//        editGameModel({ classes: { [classId]: { density: value }}})        
//      }}
//      value={classSelected.density}
//    />
//  </Unlockable>
// }
// {false && <SliderNotched
//   formLabel="Staticness"
//   step={1}
//   options={[0, 1, 5, 20, 50, 100, 200]}
//   onChangeCommitted={(value) => {
//     editGameModel({ classes: { [classId]: { frictionStatic: value }}})        
//   }}
//   value={classSelected.frictionStatic}
// />}


      // <Switch
      //   labels={['Does not collide', 'Does collide']}
      //   size="small"
      //   onChange={(e) => {
      //     editGameModel({ classes: { [classId]: { collisionResponse: { immovable: e.target.checked } } } })        
      //   }}
      //   checked={classSelected.collisionResponse.immovable}
      // />

const PhysicsEditor = ({ classId, gameModel: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]


  return (
    <div className="PhysicsEditor">
      <Unlockable interfaceId="physics/select/colliders">
        <SelectColliders
          formLabel="Colliders"
          classId={classId}
          onChange={(event, newColliderClasses) => {
            const oldColliderRelations = Object.keys(gameModel.relations).map((relationId) => {
              return gameModel.relations[relationId]
            }).filter((relation) => {
              if((relation.event.type === ON_COLLIDE_ACTIVE) &&
                 relation.effect.type === EFFECT_COLLIDE &&
                 (relation.event.classIdA === classId || relation.event.classIdB === classId)
              ) {
                return true
              }
              return false
            })

            const relations = _.cloneDeep(gameModel.relations)

            if(oldColliderRelations.length < newColliderClasses.length) {
              oldColliderRelations.forEach((relation) => {
                let index = newColliderClasses.indexOf(relation.event.classIdA)
                if(index === -1) {
                  index = newColliderClasses.indexOf(relation.event.classIdB)
                }
                newColliderClasses.splice(index, 1)
              })
  
              newColliderClasses.forEach((classIdB) => {
                const newId = RELATION_ID_PREFIX+generateUniqueId()
                relations[newId] = {
                  relationId: newId,
                  event: {
                    type: ON_COLLIDE_ACTIVE,
                    classIdA: classId,
                    classIdB,
                  },
                  effect: {
                    type: EFFECT_COLLIDE
                  },
                }
              })

            } else {

              const oldColliderClassIds = oldColliderRelations.map((relation) => getOppositeRelationClassId(classId, relation))

              const toSplice = []
              newColliderClasses.forEach((classId) => {
                const index = oldColliderClassIds.indexOf(classId)
                toSplice.push(index)
              })

              oldColliderRelations.filter((relation, index) => {
                return toSplice.indexOf(index) === -1
              }).forEach((relation) => {
                relations[relation.relationId] = null
              })
            }
            
            editGameModel({ relations })        
         }}/>
      </Unlockable>
      {classSelected.graphics.layerId === PLAYGROUND_CANVAS_ID && <div>
        also collides with Player because this is on the Playground Layer
      </div>}
      <ClassMemberTitle classId={classId} title="Collides with self?"></ClassMemberTitle>
      <Unlockable isDefaultUnlocked isSlider interfaceId="physics/sliders/bounce">
        <SliderNotched
          formLabel="Bounce"
          step={0.05}
          options={[0, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { bounciness: value } }}})        
          }}
          value={classSelected.collisionResponse.bounciness}
        />
      </Unlockable>
      <Unlockable isSlider interfaceId="physics/sliders/friction/ground">
        <SliderNotched
          formLabel="Friction"
          step={0.05}
          options={[0, 0.1, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { friction: value } }}})        
          }}
          value={classSelected.collisionResponse.friction}
        />
      </Unlockable>
      <Unlockable isSlider interfaceId="physics/sliders/weight/mass">
        <SliderNotched
          formLabel="Weight"
          step={0.1}
          options={[.1, 1, 5, 10, 20, 50, 100, 200, 500]}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { mass: value } }}})        
          }}
          value={classSelected.collisionResponse.mass}
        />
      </Unlockable>
      <Unlockable interfaceId="physics/toggle/notPushable">
        <Switch
          labels={['Not Pushable', 'Pushable']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { notPushable: !e.target.checked } } } })        
          }}
          checked={!classSelected.collisionResponse.notPushable}
         />
      </Unlockable>
      {false && <Unlockable interfaceId="physics/toggle/immovable">
        <Switch
          labels={['Collisions', 'No Collisions']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { immovable: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.immovable}
         />
      </Unlockable>}
      {<Unlockable adminOnly interfaceId="advanced/ignoreBoundaries physics/toggle/ignoreBoundaries">
        <Switch
          labels={['Boundaried', 'No Boundaries']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { ignoreBoundaries: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.ignoreBoundaries}
         />
      </Unlockable>}
      <Unlockable interfaceId="physics/ignoreSides">
        <SelectSides
          formLabel="Ignore Sides"
          value={classSelected.collisionResponse.ignoreSides ? classSelected.collisionResponse.ignoreSides : []}
          onChange={(event, sides) => {
            editGameModel({
              classes: { 
                [classId]: { 
                  collisionResponse: { ignoreSides: sides } 
                } 
              }
            })
         }}/>
      </Unlockable>

    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { editGameModel })(PhysicsEditor);
