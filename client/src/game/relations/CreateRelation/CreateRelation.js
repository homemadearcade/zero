/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelation.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateRelation, updateCreateEffect, updateCreateEvent, updateCreateRelation } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { effectEditInterface, EFFECT_ID_PREFIX } from '../../constants';
import { RELATION_ID_PREFIX } from '../../constants';
import { getClassAandB } from '../../../utils/gameUtils';
import { EFFECT_PICK_RANDOM_ZONE_IID } from '../../../constants/interfaceIds';
import SelectSpawnZoneSelectorType from '../../../ui/SelectSpawnZoneSelectorType/SelectSpawnZoneSelectorType';
import CreateEvent from '../CreateEvent/CreateEvent';
import CreateEffect from '../CreateEffect/CreateEffect';

/*



          <CobrowsingAccordianList
            listId="CreateRelation"
            accordians={[{
                id: 'Advanced',
                title: <>
                  Advanced
                </>,
                body: <>
                  {advancedOptions}
                </>
              }
            ]}
          />

*/

const CreateRelation = ({
  closeCreateRelation, 
  editGameModel, 
  updateCreateRelation, 
  gameFormEditor: { relation }, 
  gameModel: { gameModel},
  updateCreateEffect,
  updateCreateEvent
 }) => {
  function handleClose() {
    closeCreateRelation()
  }
  
  useEffect(() => {
    if(!relation.relationId) {
      const initialEffectId = EFFECT_ID_PREFIX +generateUniqueId()
      const initialEventId = EFFECT_ID_PREFIX +generateUniqueId()
      updateCreateRelation({ 
        relationId: RELATION_ID_PREFIX+generateUniqueId(), 
        isNew: true,
        effects: {
          [initialEffectId]: true,
        },
        event: EFFECT_ID_PREFIX +generateUniqueId(),
      })
      updateCreateEvent({
        sidesA: [],
        sidesB: [],
        eventId: initialEventId
      })
      updateCreateEffect(initialEffectId, {
        effectId: initialEffectId
      })
    }
  }, [])

  function isAutosaveDisabled() {

    if(!relation.event) return true

    return false 
  }

  function renderRelationForms() {
    const event = gameModel.events[relation.eventId]
    const effect = gameModel.effects[relation.effectId]

    if(!event || !effect) return 
    
    const { tagA, tagB } = getClassAandB(event.tagIdA, event.tagIdB)

    const effectForms = effectEditInterface(effect.effectType)

    const forms = []
    if(effectForms.spawnZoneSelectorType) {
      forms.push(<Unlockable key={"effect/spawnZoneSelectorType"} interfaceId={EFFECT_PICK_RANDOM_ZONE_IID}>
        <SelectSpawnZoneSelectorType
          value={[effect.spawnZoneSelectorType]}
          useA={tagA.zoneId === effect.zoneClassId}
          useB={tagB.zoneId === effect.zoneClassId}
          onChange={(event, spawnZoneSelectorType) => {
            updateCreateEffect({
              'spawnZoneSelectorType': spawnZoneSelectorType
            })     
          }}/>
      </Unlockable>)
    }
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateEvent">
      <CreateEvent/>
      {Object.keys(relation.effects).map((effectId) => {
        return <CreateEffect effectId={effectId}/>
      })}
      {renderRelationForms()}
      <div className="CreateRelation__buttons">
        <Button 
          disabled={isAutosaveDisabled()}
          onClick={() => {
          editGameModel({
            relations: {
              [relation.relationId] : {
                ...relation,
                isNew: false,
              }
            }
          })
          handleClose()
        }}>
          Save
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        {!relation.isNew && <Button onClick={() => {
          editGameModel({
            relations: {
              [relation.relationId]: null
            }
          })
          handleClose()
        }}>Delete</Button>}
      </div>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation, editGameModel, updateCreateEffect, updateCreateEvent }),
)(CreateRelation);
