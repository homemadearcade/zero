/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelation.scss';
import CobrowsingDialog from '../../../game/cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeCreateRelation, openCreateEffect, updateCreateEvent, updateCreateRelation } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { 
  effectInterfaceDatas, 
  EFFECT_DID, EVENT_DID, isUseableEffect, noRemoteEffectedTagEffects, 
  effectEditInterfacess, eventTypeInterfaces } from '../../constants';
import { RELATION_DID } from '../../constants';
import { getEntityAandB } from '../../../utils/gameUtils';
import {SINGLE_RELATION_TAG_EFFECT_IID, TWO_RELATION_TAG_EFFECT_IID, 
   EFFECT_ADVANCED_CONTAINER_IID, EFFECT_COOLDOWN_IID, EFFECT_DELAY_IID, 
   EFFECT_PICK_RANDOM_ZONE_IID, EFFECT_REMOTE_IID } from '../../../constants/interfaceIds';
import CreateEvent from '../../event/CreateEvent/CreateEvent';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Switch from '../../../ui/Switch/Switch';
import Typography from '../../../ui/Typography/Typography';
import Divider from '../../../ui/Divider/Divider';
import Icon from '../../../ui/Icon/Icon';
import useIsEventSaveable from '../../../hooks/relations/useIsEventSaveable';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';
import SelectGameInstanceEffect from '../../ui/SelectGameInstanceEffect/SelectGameInstanceEffect';
import EffectShorthand from '../../effect/EffectShorthand/EffectShorthand';
import { AlertTitle } from '@mui/material';
import Alert from '../../../ui/Alert/Alert';
import SelectSpawnZoneSelectorType from '../../ui/SelectSpawnZoneSelectorType/SelectSpawnZoneSelectorType';
import ReadOnlyWarning from '../../ui/ReadOnlyWarning/ReadOnlyWarning';

// {event && <SelectGameInstanceEffect
//         event={event}
//         formLabel={"What effects happen?"}
//         value={relation.effects ? relation.eventIds : []}
//         onChange={(event, effects) => {
//           // const newEntityId = entityModels[entityModels.length-1]
//           // handleEffectChange('spawnEntityModelId', newEntityId)
//       }}/>}

const CreateRelation = ({
  closeCreateRelation, 
  editGameModel, 
  updateCreateRelation, 
  gameFormEditor: { relation, event }, 
  gameModel: { gameModel },
  updateCreateEvent,
  openCreateEffect
 }) => {
  function handleClose() {
    closeCreateRelation()
  }
  
  useEffect(() => {
    if(!relation.relationId) {
      const initialEventId = EVENT_DID +generateUniqueId()
      updateCreateRelation({ 
        relationId: RELATION_DID+generateUniqueId(), 
        isNew: true,
        effects: {},
        effectIds: [],
        eventId: initialEventId
      })
      updateCreateEvent({
        sidesA: [],
        sidesB: [],
        eventId: initialEventId
      })
    }
  }, [])

  const isEventSaveable = useIsEventSaveable(event)

  if(!event) return null

  function isSaveDisabled() {

    if(!relation.eventId) return true

    if(!isEventSaveable) return true
    
    const isAnEffectNotUseable = relation.effectIds.some((effectId) => {
      const effect = gameModel.effects[effectId]
      if(!effect) return false
      return !isUseableEffect(effect, effect.effectBehavior, event.eventType)
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

  function renderSelectGameInstanceEffectedTagInstances(effect) {
    if(!event || !effect.effectBehavior) return 
    
    const effectEditInterfaces = effectEditInterfacess[effect.effectBehavior]
    const eventTypeInterface = eventTypeInterfaces[event.eventType]
    const effectData = relation.effects[effect.effectId] ? relation.effects[effect.effectId] : {}

    const forms = []

    const relationTagA = gameModel.relationTags[event.relationTagIdA]
    const relationTagB = gameModel.relationTags[event.relationTagIdB]

    if(effect.remoteEffectedRelationTagIds?.length) return

    const effectShortName = effectInterfaceDatas[effect.effectBehavior].displayName

    if(effectEditInterfaces.effectableType === SINGLE_RELATION_TAG_EFFECT_IID) {
      if(event.relationTagIdA && event.relationTagIdB) {
        forms.push(<Switch
            labels={[`${effectShortName} ${relationTagA.name}`, `${effectShortName} ${relationTagB.name}`]}
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
      } else if(event.relationTagIdA) {
        forms.push(<Switch
          labels={['', `${effectShortName} ${relationTagA.name}`]}
          size="small"
          onChange={(e) => {
            updateEffectData(effect.effectId, { effectTagA: e.target.checked })
          }}
          checked={effectData.effectTagA}
        />) 
      } else if(event.relationTagIdB) {
        forms.push(<Switch
          labels={['', `${effectShortName} ${relationTagB.name}`]}
          size="small"
          onChange={(e) => {
            updateEffectData(effect.effectId, { effectTagB: e.target.checked })
          }}
          checked={effectData.effectTagB}
        />)
      }
    }

    if(effectEditInterfaces.effectableType === TWO_RELATION_TAG_EFFECT_IID) {
      if(event.relationTagIdA) forms.push(<Switch
          labels={['', `${effectShortName} ${relationTagA.name}`]}
          size="small"
          onChange={(e) => {
            updateEffectData(effect.effectId, { effectTagA: e.target.checked })
          }}
          checked={effectData.effectTagA}
      />)
      
      if(event.relationTagIdB) forms.push(<Switch
          labels={['', `${effectShortName} ${relationTagB.name}`]}
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
    if(!event || !effect.effectBehavior) return 
    
    const { classA, classB } = getEntityAandB(event.relationTagIdA, event.relationTagIdB)

    const effectEditInterfaces = effectEditInterfacess[effect.effectBehavior]
    const eventTypeInterface = eventTypeInterfaces[event.eventType]

    const effectData = relation.effects[effect.effectId] ? relation.effects[effect.effectId] : {}

    const forms = []
    const useA = effect.zoneEntityModelId && classA?.entityModelId === effect.zoneEntityModelId
    const useB = effect.zoneEntityModelId && classB?.entityModelId === effect.zoneEntityModelId

    if(effectEditInterfaces.spawnZoneSelectorType && (useA || useB)) {
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

    if(!noRemoteEffectedTagEffects[effect.effectBehavior] && !effect.remoteEffectedRelationTagIds?.length) {
      forms.push(<Unlockable interfaceId={EFFECT_REMOTE_IID}>
        <SelectRelationTag
          interfaceId={EFFECT_REMOTE_IID}
          key="effect/remoteTag"
          formLabel={"What other Tags are effected?"}
          value={effectData.remoteEffectedRelationTagIdsExtension ? effectData.remoteEffectedRelationTagIdsExtension : []}
          onChange={(event, relationTags) => {
            updateEffectData(effect.effectId,
              {
                'remoteEffectedRelationTagIdsExtension': relationTags
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

    if(!event.onlyOnce && eventTypeInterface.effectCooldown && effectEditInterfaces.effectCooldown) {
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
    const effect = gameModel.effects[effectId]
    if(!effect) return
    return <>
      <Divider/>
      <EffectShorthand effect={effect}/>
      {!isUseableEffect(effect, effect.effectBehavior, event.eventType) && <Alert severity='error'>
        <AlertTitle>This Effect is not compatible with the Event. Change or remove it to save</AlertTitle>
      </Alert>}
      {effect.effectBehavior && renderSelectGameInstanceEffectedTagInstances(effect)}
      {effect.effectBehavior &&<CobrowsingNestedList interfaceId={EFFECT_ADVANCED_CONTAINER_IID+effectId} title="More Options" interfaceGroupId={"Relation Effect Data"} >
        {renderOptionalRelationForms(effect)}
      </CobrowsingNestedList>}
    </>
  }

  function handleAddEffectId(effectId) {
    const newEffectsIds = [
      ...relation.effectIds,
      effectId
    ]
    updateCreateRelation({
      effectIds: newEffectsIds
      // effects: {
      //   ...relation.effects,
      //   [effectId]: {
      //     effectId,
      //     ...initialEffectRelation
      //   }
      // }
    })
  }

  function renderButtons() {
    if(relation.isReadOnly) return <ReadOnlyWarning text={"This Relation is Read Only"}/>

    return <div className="CreateRelation__buttons">
      <Button 
          disabled={isSaveDisabled()}
          onClick={() => {
          relation.effectIds = relation.effectIds.filter((effectId) => {
            return !!gameModel.effects[effectId]
          })
          editGameModel({
            relations: {
              [relation.relationId] : {
                ...relation,
                isNew: false,
              }
            },
            events: {
              [relation.eventId]: event
            },
          })
          handleClose()
        }}>
          Save
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        {!relation.isNew && relation.isRemoved && <Button onClick={() => {
          editGameModel({
            relations: {
              [relation.relationId]: null
            }
          })
          handleClose()
        }}>Delete</Button>}
      </div>
  }

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <div className="CreateEvent">
      <Typography variant="h4">{'Relationship'}</Typography>
      <CreateEvent/>
      {event.eventType && <SelectGameInstanceEffect
        removeInterfaceActions
        eventType={event.eventType}
        formLabel={"Effects"}
        value={relation.effectIds.filter((effectId) => {
            return !!gameModel.effects[effectId]
        })}
        onChange={(event, effectIds) => {
          updateCreateRelation({
            effectIds: effectIds,
          })
        }}/>
      }
      {event.eventType && relation.effectIds?.map(renderEffect)}
      <Divider/>
      {event.eventType && <Button startIcon={<Icon icon="faPlus"/>} onClick={() => {
        const effectId = EFFECT_DID+generateUniqueId()
        openCreateEffect({
          effectId,
          isNew: true,
        })
        handleAddEffectId(effectId)
      }}>New Effect</Button>}
      {renderButtons()}
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation, editGameModel, updateCreateEvent, openCreateEffect }),
)(CreateRelation);
