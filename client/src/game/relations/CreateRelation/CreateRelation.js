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
import { effectEditInterface, EFFECT_ID_PREFIX, eventEditInterface, nonRemoteEffects,  SINGLE_TAG_EFFECT, TWO_TAG_EFFECT } from '../../constants';
import { RELATION_ID_PREFIX } from '../../constants';
import { getClassAandB } from '../../../utils/gameUtils';
import { EFFECT_PICK_RANDOM_ZONE_IID, EFFECT_REMOTE_IID, EVENT_DELAY_INTERVAL_IID } from '../../../constants/interfaceIds';
import SelectSpawnZoneSelectorType from '../../../ui/SelectSpawnZoneSelectorType/SelectSpawnZoneSelectorType';
import CreateEvent from '../CreateEvent/CreateEvent';
import CreateEffect from '../CreateEffect/CreateEffect';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import SelectTag from '../../ui/SelectTag/SelectTag';
import Switch from '../../../ui/Switch/Switch';
import Typography from '../../../ui/Typography/Typography';
import Divider from '../../../ui/Divider/Divider';
import Icon from '../../../ui/Icon/Icon';
import useIsEventSaveable from '../../../hooks/useIsEventSaveable';
import useAreEffectsSaveable from '../../../hooks/areEffectsSaveable';

// {event && <SelectEffect
//         event={event}
//         formLabel={"What effects happen?"}
//         value={relation.effects ? relation.events : []}
//         onChange={(event, effects) => {
//           // const newClassId = classes[classes.length-1]
//           // handleEffectChange('spawnClassId', newClassId)
//       }}/>}

const CreateRelation = ({
  closeCreateRelation, 
  editGameModel, 
  updateCreateRelation, 
  gameFormEditor: { relation, event, effects }, 
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

  const isEventSaveable = useIsEventSaveable(event)
  const areEffectsSaveable = useAreEffectsSaveable(effects)

  if(!event) return null

  function isSaveDisabled() {

    if(!relation.event) return true

    if(!isEventSaveable || !areEffectsSaveable) return true

    return false 
  }

  function renderRelationForms(effect) {
    if(!event || !effect.type) return 
    
    const { classA, classB } = getClassAandB(event.tagIdA, event.tagIdB)

    const effectInterface = effectEditInterface[effect.type]
    const eventInterface = eventEditInterface[event.type]

    const forms = []
    const useA = effect.zoneClassId && classA?.classId === effect.zoneClassId
    const useB = effect.zoneClassId && classB?.classId === effect.zoneClassId

    if(effectInterface.spawnZoneSelectorType && (useA || useB)) {
      forms.push(<Unlockable
        key={"effect/spawnZoneSelectorType"} 
        interfaceId={EFFECT_PICK_RANDOM_ZONE_IID}>
        <SelectSpawnZoneSelectorType
          value={[effect.spawnZoneSelectorType]}
          useA={useA}
          useB={useB}
          onChange={(event, spawnZoneSelectorType) => {
            updateCreateEffect(effect.effectId, {
              'spawnZoneSelectorType': spawnZoneSelectorType
            })     
          }}
        />
      </Unlockable>)
    }

    if(!event.onlyOnce && eventInterface.delayInterval && effectInterface.delayInterval) {
       forms.push(<Unlockable interfaceId={EVENT_DELAY_INTERVAL_IID}>
          <SliderNotched
            key="event/delayInterval"
            formLabel="Delay Interval (ms)"
            step={10}
            options={[100, 200, 400, 1000, 3000]}
            onChangeCommitted={(value) => {
              updateCreateEvent({delayInterval: value})
            }}
            value={event.delayInterval || 200}
          />
      </Unlockable>)
    }

    if(effectInterface.effectableType === SINGLE_TAG_EFFECT) {
      forms.push(<Switch
          labels={['Effect Tag A', 'Effect Tag B']}
          size="small"
          onChange={(e) => {
            updateCreateEffect(effect.effectId, { effectTagA: e.target.checked })
          }}
          checked={effect.effectTagA}
      />)
    }

    if(effectInterface.effectableType === TWO_TAG_EFFECT) {
      forms.push(<Switch
          labels={['', 'Effect Tag A']}
          size="small"
          onChange={(e) => {
            updateCreateEffect(effect.effectId, { effectTagA: e.target.checked })
          }}
          checked={effect.effectTagA}
      />)
      
      forms.push(<Switch
          labels={['', 'Effect Tag B']}
          size="small"
          onChange={(e) => {
            updateCreateEffect(effect.effectId, { effectTagB: e.target.checked })
          }}
          checked={effect.effectTagB}
      />)
    }

    if(!nonRemoteEffects[effect.type]) {
      forms.push(<Unlockable interfaceId={EFFECT_REMOTE_IID}>
        <SelectTag
          key="effect/remoteTag"
          formLabel={"What other Tags are effected?"}
          value={effect.remoteEffectedTagId ? [effect.remoteEffectedTagId] : []}
          onChange={(event, tags) => {
            const newTagId = tags[tags.length-1]
            updateCreateEffect(
              effect.effectId,
              {
              'remoteEffectedTagId': newTagId
            })
        }}/>
      </Unlockable>)
    }

    return forms
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateEvent">
      <Typography variant="h4">{'Event'}</Typography>
      <CreateEvent/>
      {event.type && Object.keys(relation.effects).map((effectId, index) => {
        if(relation.effects[effectId] !== true) return null
        return <>
          <Divider/>
          <Typography variant="h4">{'Effect #' + (index + 1)}</Typography>
          <CreateEffect effectId={effectId}/>
          {renderRelationForms(effects[effectId])}
          <Button onClick={() => {
            updateCreateRelation({
              effects: {
                ...relation.effects,
                [effectId]: false
              }
            })
          }}>Remove Effect</Button>
        </>
      })}
      <Divider/>
      {event.type && <Button startIcon={<Icon icon="faPlus"/>} onClick={() => {
        const effectId = EFFECT_ID_PREFIX + generateUniqueId()
        updateCreateEffect(effectId, {
          effectId,
        })
        updateCreateRelation({
          effects: {
            ...relation.effects,
            [effectId]: true
          }
        })
      }}>New Effect</Button>}
      <div className="CreateRelation__buttons">
        <Button 
          disabled={isSaveDisabled()}
          onClick={() => {
          editGameModel({
            relations: {
              [relation.relationId] : {
                ...relation,
                isNew: false,
              }
            },
            events: {
              [relation.event]: event
            },
            effects
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
