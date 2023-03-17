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
import { effectEditInterface, EFFECT_ID_PREFIX, eventEditInterface, initialEffectRelation, isUseableEffect, nonRemoteEffects, ON_INTERACT, SINGLE_TAG_EFFECT, TWO_TAG_EFFECT } from '../../constants';
import { RELATION_ID_PREFIX } from '../../constants';
import { getClassAandB } from '../../../utils/gameUtils';
import { EFFECT_COOLDOWN_IID, EFFECT_DELAY_IID, EFFECT_PICK_RANDOM_ZONE_IID, EFFECT_REMOTE_IID } from '../../../constants/interfaceIds';
import SelectSpawnZoneSelectorType from '../../../ui/SelectSpawnZoneSelectorType/SelectSpawnZoneSelectorType';
import CreateEvent from '../CreateEvent/CreateEvent';
import CreateEffect from '../CreateEffect/CreateEffect';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Switch from '../../../ui/Switch/Switch';
import Typography from '../../../ui/Typography/Typography';
import Divider from '../../../ui/Divider/Divider';
import Icon from '../../../ui/Icon/Icon';
import useIsEventSaveable from '../../../hooks/useIsEventSaveable';
import useAreEffectsSaveable from '../../../hooks/areEffectsSaveable';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import { Alert, AlertTitle } from '@mui/material';
import SelectTag from '../../ui/SelectTag/SelectTag';
import SelectEffect from '../../ui/SelectEffect/SelectEffect';

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
  gameModel: { gameModel },
  updateCreateEffect,
  updateCreateEvent
 }) => {
  function handleClose() {
    closeCreateRelation()
  }
  
  useEffect(() => {
    if(!relation.relationId) {
      // const initialEffectId = EFFECT_ID_PREFIX +generateUniqueId()
      const initialEventId = EFFECT_ID_PREFIX +generateUniqueId()
      updateCreateRelation({ 
        relationId: RELATION_ID_PREFIX+generateUniqueId(), 
        isNew: true,
        // effects: {
        //   [initialEffectId]: {
        //     effectId: initialEffectId,
        //     ...initialEffectRelation
        //   }
        // },
        effects: {},
        event: EFFECT_ID_PREFIX +generateUniqueId(),
      })
      updateCreateEvent({
        sidesA: [],
        sidesB: [],
        eventId: initialEventId
      })
      // updateCreateEffect(initialEffectId, {
      //   effectId: initialEffectId
      // })
    }
  }, [])

  const isEventSaveable = useIsEventSaveable(event)
  const areEffectsSaveable = useAreEffectsSaveable(effects)

  if(!event) return null

  function isSaveDisabled() {

    if(!relation.event) return true

    if(!isEventSaveable || !areEffectsSaveable) return true

    const isAnEffectNotUseable = Object.keys(relation.effects).some((effectId) => {
      return !isUseableEffect(effects[effectId].type, event.type)
    })

    if(isAnEffectNotUseable) return true

    return false 
  }

  function updateEffectData(effectId, data) {
    if(!relation.effects[effectId]) {
      updateCreateRelation({
        effects: {
          [effectId] : {
            ...data,
            effectId
          }
        }
      })
    } else {
      updateCreateRelation({
        effects: {
          [effectId] : {
            ...relation.effects[effectId],
            ...data
          }
        }
      })
    }

  }

  function renderRelationForms(effect) {
    if(!event || !effect.type) return 
    
    const effectInterface = effectEditInterface[effect.type]
    const eventInterface = eventEditInterface[event.type]
    const effectData = relation.effects[effect.effectId] ? relation.effects[effect.effectId] : {}

    const forms = []

    const tagA = gameModel.tags[event.tagIdA]
    const tagB = gameModel.tags[event.tagIdB]

    if(effectInterface.effectableType === SINGLE_TAG_EFFECT) {
      if(event.tagIdA && event.tagIdB) {
        forms.push(<Switch
            labels={[`Effect ${tagA.name}`, `Effect ${tagB.name}`]}
            size="small"
            onChange={(e) => {
              if(e.target.checked) {
                updateEffectData(effect.effectId, { effectTagA: false, effectTagB: true })
              } else {
                updateEffectData(effect.effectId, { effectTagA: true, effectTagB: false })
              }
            }}
            checked={effectData.effectTagB}
        />)
      } else if(event.tagIdA) {
        forms.push(<Switch
          labels={['', `Effect ${tagA.name}`]}
          size="small"
          onChange={(e) => {
            updateEffectData(effect.effectId, { effectTagA: e.target.checked })
          }}
          checked={effectData.effectTagA}
        />) 
      } else if(event.tagIdB) {
        forms.push(<Switch
          labels={['', `Effect ${tagB.name}`]}
          size="small"
          onChange={(e) => {
            updateEffectData(effect.effectId, { effectTagB: e.target.checked })
          }}
          checked={effectData.effectTagB}
        />)
      }
    }

    if(effectInterface.effectableType === TWO_TAG_EFFECT) {
      if(event.tagIdA) forms.push(<Switch
          labels={['', `Effect ${tagA.name}`]}
          size="small"
          onChange={(e) => {
            updateEffectData(effect.effectId, { effectTagA: e.target.checked })
          }}
          checked={effectData.effectTagA}
      />)
      
      if(event.tagIdB) forms.push(<Switch
          labels={['', `Effect ${tagB.name}`]}
          size="small"
          onChange={(e) => {
            updateEffectData(effect.effectId, { effectTagB: e.target.checked })
          }}
          checked={effectData.effectTagB}
      />)
    }

    return forms
  }

  function renderOptionalRelationForms(effect) {
    if(!event || !effect.type) return 
    
    const { classA, classB } = getClassAandB(event.tagIdA, event.tagIdB)

    const effectInterface = effectEditInterface[effect.type]
    const eventInterface = eventEditInterface[event.type]

    const effectData = relation.effects[effect.effectId] ? relation.effects[effect.effectId] : {}

    const forms = []
    const useA = effect.zoneClassId && classA?.classId === effect.zoneClassId
    const useB = effect.zoneClassId && classB?.classId === effect.zoneClassId

    if(effectInterface.spawnZoneSelectorType && (useA || useB)) {
      forms.push(<Unlockable
        key={"effect/spawnZoneSelectorType"} 
        interfaceId={EFFECT_PICK_RANDOM_ZONE_IID}>
        <SelectSpawnZoneSelectorType
          value={[effectData.spawnZoneSelectorType]}
          useA={useA}
          useB={useB}
          onChange={(event, spawnZoneSelectorType) => {
            updateEffectData(effect.effectId, {
              'spawnZoneSelectorType': spawnZoneSelectorType
            })
          }}
        />
      </Unlockable>)
    }

    if(!nonRemoteEffects[effect.type]) {
      forms.push(<Unlockable interfaceId={EFFECT_REMOTE_IID}>
        <SelectTag
          key="effect/remoteTag"
          formLabel={"What other Tags are effected?"}
          value={effectData.remoteEffectedTagIds2 ? effectData.remoteEffectedTagIds2 : []}
          onChange={(event, tags) => {
            updateEffectData(effect.effectId,
              {
                'remoteEffectedTagIds2': tags
              }
            )
        }}/>
      </Unlockable>)
    }

    forms.push(<Unlockable key={"effect/delay"} interfaceId={EFFECT_DELAY_IID}>
      <SliderNotched
        formLabel="Delay Effect (ms)"
        step={10}
        options={[0, 10, 50, 100, 200, 400, 1000, 3000, 6000, 9000, 15000, 20000]}
        onChangeCommitted={(value) => {
          updateEffectData(effect.effectId, {
            'effectDelay': value
          })
        }}
        value={effectData.effectDelay || 0}
      />
    </Unlockable>)

    if(!event.onlyOnce && eventInterface.effectCooldown && effectInterface.effectCooldown) {
      forms.push(<Unlockable interfaceId={EFFECT_COOLDOWN_IID}>
          <SliderNotched
            key="effect/cooldown"
            formLabel="Effect Cooldown (ms)"
            step={10}
            options={[100, 200, 400, 1000, 3000]}
            onChangeCommitted={(value) => {
              updateEffectData(
                effect.effectId,
                {effectCooldown: value})
            }}
            value={effectData.effectCooldown}
          />
      </Unlockable>)
    }

    return forms
  }

  function renderEffect(effectId, index) {
    const isImported = relation.importedEffects.includes(effectId)
    const effect = isImported ? gameModel.effects[effectId] : effects[effectId]

    if(!isImported && !relation.effects[effectId]) return null

    return <>
      <Divider/>
      <Typography variant="h4">{effectId}</Typography>
      {!isUseableEffect(effect.type, event.type) && <Alert severity='error'>
        <AlertTitle>This Effect is not compatible with the Event. Change or remove it to save</AlertTitle>
      </Alert>}
      {!isImported && <CreateEffect effectId={effectId}/>}
      {effect.type && renderRelationForms(effect)}
      {effect.type &&<CobrowsingNestedList id={effectId} title="More Options" listId={effectId} >
        {renderOptionalRelationForms(effect)}
      </CobrowsingNestedList>}
      {!isImported && <Button onClick={() => {
        updateCreateRelation({
          effects: {
            ...relation.effects,
            [effectId]: null
          }
        })
      }}>Remove Effect</Button>}
    </>
  }

  function handleAddEffectId(effectId) {
    updateCreateEffect(effectId, {
      effectId,
    })
    updateCreateRelation({
      effects: {
        ...relation.effects,
        [effectId]: {
          effectId,
          ...initialEffectRelation
        }
      }
    })
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateEvent">
      <Typography variant="h4">{'Event'}</Typography>
      <CreateEvent/>
      {event.type && <SelectEffect
        eventType={event.type}
        formLabel={"Effects"}
        value={relation.importedEffects ? relation.importedEffects : []}
        onChange={(event, effects) => {
          updateCreateRelation({
            importedEffects: effects,
          })
        }}/>
      }
      {event.type && relation.importedEffects.map(renderEffect)}
      {event.type && Object.keys(relation.effects).map(renderEffect)}
      <Divider/>
      {event.type && <Button startIcon={<Icon icon="faPlus"/>} onClick={() => {
        const effectId = EFFECT_ID_PREFIX + generateUniqueId()
        handleAddEffectId(effectId)
      }}>New Custom Effect</Button>}
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
