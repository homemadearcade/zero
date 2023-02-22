import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './PhysicsEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import SelectColliders from '../../ui/SelectColliders/SelectColliders';
import { EFFECT_COLLIDE, ON_COLLIDE_ACTIVE, PLAYGROUND_CANVAS_ID, RELATION_ID_PREFIX } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import _ from 'lodash';
import { getOppositeRelationClassId } from '../../../utils/gameUtils';
import SelectSides from '../../ui/SelectSides/SelectSides';
import { PHYSICS_BOUNCE_IID, PHYSICS_COLLIDERS_IID, PHYSICS_FRICTION_IID, PHYSICS_IGNORE_BOUNDARIES_IID, PHYSICS_IGNORE_SIDES_IID, PHYSICS_IMMOVABLE_IID, PHYSICS_MASS_IID, PHYSICS_PUSHABLE_IID } from '../../../constants/interfaceIds';


const PhysicsEditor = ({ classId, gameModel: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]


  return (
    <div className="PhysicsEditor">
      <Unlockable interfaceId={PHYSICS_COLLIDERS_IID}>
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
                if(relation.event.classIdA === relation.event.classIdB) {
                  const index = newColliderClasses.indexOf(classId)
                  if(index >= 0) {
                    newColliderClasses.splice(index, 1)
                  }
                } else {
                  let index = newColliderClasses.indexOf(relation.event.classIdA)

                  // check for class b if we couldnt find the class a in the list OR if its our main class Id
                  // we would rather find class id b in that case so we dont mistsake this for a self-collider
                  if(index === -1 || newColliderClasses[index] === classId) {
                    index = newColliderClasses.indexOf(relation.event.classIdB)
                  }
                  if(newColliderClasses[index] === classId) {
                    //this is so we do not accidentally splice it when its new. All relations can be mistaken for a self-collision
                    if(!oldColliderRelations.some(({event}) => {
                      if(event.classIdA === event.classIdB) return true
                      return false
                    })) {
                      // if we are here, we did not have a self-collision before, so do not splice it!
                      return null
                    }
                  }
                  newColliderClasses.splice(index, 1)
                }
                
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
      {false && classSelected.graphics.layerId === PLAYGROUND_CANVAS_ID && <div>
        also collides with Player because this is on the Playground Layer
      </div>}
      <Unlockable isSlider interfaceId={PHYSICS_BOUNCE_IID}>
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
      <Unlockable isSlider interfaceId={PHYSICS_FRICTION_IID}>
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
      <Unlockable isSlider interfaceId={PHYSICS_MASS_IID}>
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
      <Unlockable interfaceId={PHYSICS_PUSHABLE_IID}>
        <Switch
          labels={['Not Pushable', 'Pushable']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { notPushable: !e.target.checked } } } })        
          }}
          checked={!classSelected.collisionResponse.notPushable}
         />
      </Unlockable>
      {false && <Unlockable interfaceId={PHYSICS_IMMOVABLE_IID}>
        <Switch
          labels={['Collisions', 'No Collisions']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { immovable: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.immovable}
         />
      </Unlockable>}
      {<Unlockable interfaceId={PHYSICS_IGNORE_BOUNDARIES_IID}>
        <Switch
          labels={['Boundaried', 'No Boundaries']}
          size="small"
          onChange={(e) => {
            editGameModel({ classes: { [classId]: { collisionResponse: { ignoreBoundaries: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.ignoreBoundaries}
         />
      </Unlockable>}
      <Unlockable interfaceId={PHYSICS_IGNORE_SIDES_IID}>
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
