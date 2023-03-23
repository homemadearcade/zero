import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './PhysicsEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import SelectColliders from '../../ui/SelectColliders/SelectColliders';
import { LAYER_ID_PREFIX, PLAYGROUND_LAYER_ID, RELATION_ID_PREFIX } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import _ from 'lodash';
import { getOppositeColliderRelationTagId } from '../../../utils/gameUtils';
import SelectSides from '../../ui/SelectSides/SelectSides';
import { PHYSICS_BOUNCE_IID, PHYSICS_COLLIDERS_IID, PHYSICS_FRICTION_IID, PHYSICS_IGNORE_BOUNDARIES_IID, PHYSICS_IGNORE_SIDES_IID, PHYSICS_IMMOVABLE_IID, PHYSICS_MASS_IID, PHYSICS_PUSHABLE_IID } from '../../../constants/interfaceIds';


const PhysicsEditor = ({ entityClassId, gameModel: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.entityClasses[entityClassId]

  const relationTagId = entityClassId
  return (
    <div className="PhysicsEditor">
      <Unlockable interfaceId={PHYSICS_COLLIDERS_IID}>
        <SelectColliders
          formLabel="Colliders"
          relationTagId={relationTagId}
          onChange={(event, newColliderTags) => {
            const oldColliders = Object.keys(gameModel.collisions).map((collisionId) => {
              return gameModel.collisions[collisionId]
            }).filter((collision) => {
              return collision.relationTagIdA === relationTagId || collision.relationTagIdB === relationTagId
            })

            const collisions = _.cloneDeep(gameModel.collisions)

            if(oldColliders.length < newColliderTags.length) {
              oldColliders.forEach((collision) => {
                if(collision.relationTagIdA === collision.relationTagIdB) {
                  const index = newColliderTags.indexOf(relationTagId)
                  if(index >= 0) {
                    newColliderTags.splice(index, 1)
                  }
                } else {
                  let index = newColliderTags.indexOf(collision.relationTagIdA)

                  // check for class b if we couldnt find the class a in the list OR if its our main class Id
                  // we would rather find class id b in that case so we dont mistsake this for a self-collider
                  if(index === -1 || newColliderTags[index] === relationTagId) {
                    index = newColliderTags.indexOf(collision.relationTagIdB)
                  }
                  if(newColliderTags[index] === relationTagId) {
                    //this is so we do not accidentally splice it when its new. All collisions can be mistaken for a self-collision
                    if(!oldColliders.some(({relationTagIdA, relationTagIdB}) => {
                      if(relationTagIdA === relationTagIdB) return true
                      return false
                    })) {
                      // if we are here, we did not have a self-collision before, so do not splice it!
                      return null
                    }
                  }
                  newColliderTags.splice(index, 1)
                }
                
              })
  
              newColliderTags.forEach((relationTagIdB) => {
                const newId = RELATION_ID_PREFIX+generateUniqueId()
                collisions[newId] = {
                  collisionId: newId,
                  relationTagIdA: relationTagId,
                  relationTagIdB,
                }
              })

            } else {

              const oldColliderRelationTagIds = oldColliders.map((collision) => {
                return getOppositeColliderRelationTagId(relationTagId, collision)
              })

              const toSplice = []
              newColliderTags.forEach((relationTagId) => {
                const index = oldColliderRelationTagIds.indexOf(relationTagId)
                toSplice.push(index)
              })

              console.log(toSplice)
              console.log(oldColliderRelationTagIds, newColliderTags)

              oldColliders.filter((collision, index) => {
                return toSplice.indexOf(index) === -1
              }).forEach((collision) => {
                collisions[collision.collisionId] = null
              })

              console.log(oldColliders, collisions)
            }
            
            editGameModel({ collisions })        
         }}/>
      </Unlockable>
      {false && classSelected.graphics.layerId === LAYER_ID_PREFIX+PLAYGROUND_LAYER_ID && <div>
        also collides with Player because this is on the Playground Layer
      </div>}
      <Unlockable isSlider interfaceId={PHYSICS_BOUNCE_IID}>
        <SliderNotched
          formLabel="Bounce"
          step={0.05}
          options={[0, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ entityClasses: { [entityClassId]: { collisionResponse: { bounciness: value } }}})        
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
            editGameModel({ entityClasses: { [entityClassId]: { collisionResponse: { friction: value } }}})        
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
            editGameModel({ entityClasses: { [entityClassId]: { collisionResponse: { mass: value } }}})        
          }}
          value={classSelected.collisionResponse.mass}
        />
      </Unlockable>
      <Unlockable interfaceId={PHYSICS_PUSHABLE_IID}>
        <Switch
          labels={['Not Pushable', 'Pushable']}
          size="small"
          onChange={(e) => {
            editGameModel({ entityClasses: { [entityClassId]: { collisionResponse: { notPushable: !e.target.checked } } } })        
          }}
          checked={!classSelected.collisionResponse.notPushable}
         />
      </Unlockable>
      {false && <Unlockable interfaceId={PHYSICS_IMMOVABLE_IID}>
        <Switch
          labels={['Collisions', 'No Collisions']}
          size="small"
          onChange={(e) => {
            editGameModel({ entityClasses: { [entityClassId]: { collisionResponse: { immovable: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.immovable}
         />
      </Unlockable>}
      {<Unlockable interfaceId={PHYSICS_IGNORE_BOUNDARIES_IID}>
        <Switch
          labels={['Boundaried', 'No Boundaries']}
          size="small"
          onChange={(e) => {
            editGameModel({ entityClasses: { [entityClassId]: { collisionResponse: { ignoreStageBoundaries: e.target.checked } } } })        
          }}
          checked={classSelected.collisionResponse.ignoreStageBoundaries}
         />
      </Unlockable>}
      <Unlockable interfaceId={PHYSICS_IGNORE_SIDES_IID}>
        <SelectSides
          formLabel="Ignore Sides"
          value={classSelected.collisionResponse.ignoreSides ? classSelected.collisionResponse.ignoreSides : []}
          onChange={(event, sides) => {
            editGameModel({
              entityClasses: { 
                [entityClassId]: { 
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
