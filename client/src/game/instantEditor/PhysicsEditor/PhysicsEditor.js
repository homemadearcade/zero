import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './PhysicsEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import SelectColliders from '../../ui/SelectColliders/SelectColliders';
import { ON_COLLIDE_ACTIVE, PLAYGROUND_CANVAS_ID, RELATION_ID_PREFIX } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import _ from 'lodash';
import { getOppositeColliderTagId } from '../../../utils/gameUtils';
import SelectSides from '../../ui/SelectSides/SelectSides';
import { PHYSICS_BOUNCE_IID, PHYSICS_COLLIDERS_IID, PHYSICS_FRICTION_IID, PHYSICS_IGNORE_BOUNDARIES_IID, PHYSICS_IGNORE_SIDES_IID, PHYSICS_IMMOVABLE_IID, PHYSICS_MASS_IID, PHYSICS_PUSHABLE_IID } from '../../../constants/interfaceIds';


const PhysicsEditor = ({ classId, gameModel: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]

  const tagId = classId
  return (
    <div className="PhysicsEditor">
      <Unlockable interfaceId={PHYSICS_COLLIDERS_IID}>
        <SelectColliders
          formLabel="Colliders"
          tagId={tagId}
          onChange={(event, newColliderTags) => {
            const oldColliders = Object.keys(gameModel.collisions).map((collisionId) => {
              return gameModel.collisions[collisionId]
            }).filter((collision) => {
              if((collision.event.type === ON_COLLIDE_ACTIVE) &&
                //  collision.effect.type === EFFECT_COLLIDE &&
                 (collision.event.tagIdA === tagId || collision.event.tagIdB === tagId)
              ) {
                return true
              }
              return false
            })

            const collisions = _.cloneDeep(gameModel.collisions)

            if(oldColliders.length < newColliderTags.length) {
              oldColliders.forEach((collision) => {
                if(collision.event.tagIdA === collision.event.tagIdB) {
                  const index = newColliderTags.indexOf(tagId)
                  if(index >= 0) {
                    newColliderTags.splice(index, 1)
                  }
                } else {
                  let index = newColliderTags.indexOf(collision.event.tagIdA)

                  // check for class b if we couldnt find the class a in the list OR if its our main class Id
                  // we would rather find class id b in that case so we dont mistsake this for a self-collider
                  if(index === -1 || newColliderTags[index] === tagId) {
                    index = newColliderTags.indexOf(collision.event.tagIdB)
                  }
                  if(newColliderTags[index] === tagId) {
                    //this is so we do not accidentally splice it when its new. All collisions can be mistaken for a self-collision
                    if(!oldColliders.some(({event}) => {
                      if(event.tagIdA === event.tagIdB) return true
                      return false
                    })) {
                      // if we are here, we did not have a self-collision before, so do not splice it!
                      return null
                    }
                  }
                  newColliderTags.splice(index, 1)
                }
                
              })
  
              newColliderTags.forEach((tagIdB) => {
                const newId = RELATION_ID_PREFIX+generateUniqueId()
                collisions[newId] = {
                  collisionId: newId,
                  event: {
                    type: ON_COLLIDE_ACTIVE,
                    tagIdA: tagId,
                    tagIdB,
                  },
                  effect: {
                    // type: EFFECT_COLLIDE
                  },
                }
              })

            } else {

              const oldColliderTagIds = oldColliders.map((collision) => {
                return getOppositeColliderTagId(tagId, collision)
              })

              const toSplice = []
              newColliderTags.forEach((tagId) => {
                const index = oldColliderTagIds.indexOf(tagId)
                toSplice.push(index)
              })

              console.log(toSplice)
              console.log(oldColliderTagIds, newColliderTags)

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
