import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';

import './CollisionsEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import SelectColliders from '../../ui/SelectColliders/SelectColliders';
import { RELATION_DID } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import _ from 'lodash';
import { getOppositeColliderRelationTagId } from '../../../utils/gameUtils';
import SelectSides from '../../ui/SelectSides/SelectSides';
import { COLLISIONS_BOUNCE_IID, COLLISIONS_COLLIDERS_IID, COLLISIONS_FRICTION_IID, COLLISIONS_IGNORE_BOUNDARIES_IID, COLLISIONS_IGNORE_SIDES_IID, COLLISIONS_IMMOVABLE_IID, COLLISIONS_MASS_IID, COLLISIONS_PUSHABLE_IID } from '../../../constants/interfaceIds';


const CollisionsEditor = ({ entityModelId, gameModel: { gameModel }, editGameModel }) => {
  const entitySelected = gameModel.entityModels[entityModelId]

  const relationTagId = entityModelId
  return (
    <div className="CollisionsEditor">
      <Unlockable interfaceId={COLLISIONS_COLLIDERS_IID}>
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
                const newId = RELATION_DID+generateUniqueId()
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

              oldColliders.filter((collision, index) => {
                return toSplice.indexOf(index) === -1
              }).forEach((collision) => {
                collisions[collision.collisionId] = null
              })
            }
            
            editGameModel({ collisions })        
         }}/>
      </Unlockable>
      <Unlockable isSlider interfaceId={COLLISIONS_BOUNCE_IID}>
        <SliderNotched
          formLabel="Bounce"
          step={0.05}
          options={[0, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { collisionResponse: { bounciness: value } }}})        
          }}
          value={entitySelected.collisionResponse.bounciness}
        />
      </Unlockable>
      {false && <Unlockable isSlider interfaceId={COLLISIONS_FRICTION_IID}>
        <SliderNotched
          formLabel="Friction"
          step={0.05}
          options={[0, 0.1, .25, .5, .75, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { collisionResponse: { friction: value } }}})        
          }}
          value={entitySelected.collisionResponse.friction}
        />
      </Unlockable>}
      {false && <Unlockable isSlider interfaceId={COLLISIONS_MASS_IID}>
        <SliderNotched
          formLabel="Weight"
          step={0.1}
          options={[.1, 1, 5, 10, 20, 50, 100, 200, 500]}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { collisionResponse: { mass: value } }}})        
          }}
          value={entitySelected.collisionResponse.mass}
        />
      </Unlockable>}
      <Unlockable interfaceId={COLLISIONS_PUSHABLE_IID}>
        <Switch
          labels={['Not Pushable', 'Pushable']}
          size="small"
          onChange={(e) => {
            editGameModel({ entityModels: { [entityModelId]: { collisionResponse: { notPushable: !e.target.checked } } } })        
          }}
          checked={!entitySelected.collisionResponse.notPushable}
         />
      </Unlockable>
      {false && <Unlockable interfaceId={COLLISIONS_IMMOVABLE_IID}>
        <Switch
          labels={['Collisions', 'No Collisions']}
          size="small"
          onChange={(e) => {
            editGameModel({ entityModels: { [entityModelId]: { collisionResponse: { immovable: e.target.checked } } } })        
          }}
          checked={entitySelected.collisionResponse.immovable}
         />
      </Unlockable>}
      {<Unlockable interfaceId={COLLISIONS_IGNORE_BOUNDARIES_IID}>
        <Switch
          labels={['Boundaried', 'No Boundaries']}
          size="small"
          onChange={(e) => {
            editGameModel({ entityModels: { [entityModelId]: { collisionResponse: { ignoreStageBoundaries: e.target.checked } } } })        
          }}
          checked={entitySelected.collisionResponse.ignoreStageBoundaries}
         />
      </Unlockable>}
      <Unlockable interfaceId={COLLISIONS_IGNORE_SIDES_IID}>
        <SelectSides
          formLabel="Ignore Sides"
          value={entitySelected.collisionResponse.ignoreSides ? entitySelected.collisionResponse.ignoreSides : []}
          onChange={(event, sides) => {
            editGameModel({
              entityModels: { 
                [entityModelId]: { 
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

export default connect(mapStateToProps, { editGameModel })(CollisionsEditor);
