/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelation.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateRelation, updateCreateRelation } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import SelectClass from '../../ui/SelectClass/SelectClass';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';
import SelectEvent from '../../ui/SelectEvent/SelectEvent';
import SelectRelationEffect from '../../ui/SelectRelationEffect/SelectRelationEffect';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { defaultRelationship, effectEditInterface, nonRemoteEffects } from '../../defaultData/relationship';
import { TextField } from '@mui/material';
import { EFFECT_SPAWN, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, RELATION_ID_PREFIX, ZONE_CLASS } from '../../constants';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import SelectSides from '../../ui/SelectSides/SelectSides';
import { getClassAandB } from '../../../utils/gameUtils';
import CobrowsingAccordianList from '../../cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import Switch from '../../../ui/Switch/Switch';
import Typography from '../../../ui/Typography/Typography';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';

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

const CreateRelation = ({ closeCreateRelation, editGameModel, updateCreateRelation, gameFormEditor: { relation }, gameModel: { gameModel} }) => {
  function handleClose() {
    closeCreateRelation()
  }

  const { classA, classB } = getClassAandB(relation.event.classIdA, relation.event.classIdB)

  useEffect(() => {
    if(!relation.relationId) {
      updateCreateRelation({ relationId: RELATION_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  function isSaveDisabled() {
    const editForms = effectEditInterface[relation.effect.type]

    if(editForms?.classId) {
      if(!relation.effect.classId) return true
    }

    if(editForms?.zoneClassId) {
      if(!relation.effect.zoneClassId) return true
    }

    if(editForms?.cutsceneId) {
      if(!relation.effect.cutsceneId) return true
    }

    if(editForms?.text) {
      if(!relation.effect.text) return true
    }

    if(!relation.effect.type || !relation.event.type || !relation.event.classIdA || !relation.event.classIdB) return true
    
    return false 
  }

  const handleEventChange = (prop, value) => {
    relation.event[prop] = value
    updateCreateRelation(relation)
  }

  const handleEffectChange = (prop, value) => {
    relation.effect[prop] = value
    updateCreateRelation(relation)
  }

  function renderEffectForms(effect, effectedClass) {
    const editForms = effectEditInterface[effect]

    const forms = []
    if(editForms.classId) {
      forms.push(<SelectClass 
        includePlayerInstance
        key={relation.event.classIdA + 'effectClassId'}
        formLabel={editForms.classId}
        value={relation.effect.classId ? [relation.effect.classId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('classId', newClassId)
        }}/>
      )
    }

    if(editForms.zoneClassId) {
      forms.push(<SelectClass 
        key={relation.event.classIdA + 'zoneClassId'}
        classType={ZONE_CLASS}
        formLabel={editForms.zoneClassId}
        value={relation.effect.zoneClassId ? [relation.effect.zoneClassId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('zoneClassId', newClassId)
        }}/>
      )
    }

    if(editForms.cutsceneId) {
      forms.push(<SelectCutscene
        key={relation.event.classIdA + 'effectCutsceneId'}
        formLabel={editForms.cutsceneId}
        value={relation.effect.cutsceneId ? [relation.effect.cutsceneId] : []}
        onChange={(event, cutscenes) => {
          const newCutsceneId = cutscenes[cutscenes.length-1]
          handleEffectChange('cutsceneId', newCutsceneId)
        }}/>
      )
    }

    if(editForms.text) {
      forms.push(<TextField multiline value={relation.effect.text} onChange={(e) => {
        handleEffectChange('text', e.target.value)
      }} label={editForms.text}/>
      )
    }

    if(editForms.onlyOnce) {
      forms.push(<Unlockable interfaceId="relation/onlyOnce">
        <Switch
          labels={['Recurring', 'Only Occurs Once']}
          size="small"
          onChange={(e) => {
            updateCreateRelation({ onlyOnce: e.target.checked })
          }}
          checked={relation.onlyOnce}
         />
      </Unlockable>)
    }

    if(editForms.useClassAZoneInstance && classA.classId === relation.effect.zoneClassId) {
      forms.push(<Unlockable interfaceId="relation/useClassAZoneInstance">
        <Switch
          labels={['Pick Random Zone', 'Use this zone']}
          size="small"
          onChange={(e) => {
            handleEffectChange('useClassAZoneInstance', e.target.value)
          }}
          checked={relation.effect.useClassAZoneInstance}
         />
      </Unlockable>)
    }

    return forms
  }

  const advancedOptions = [
    classB && relation.effect.type && !nonRemoteEffects[relation.effect.type] && <Unlockable interfaceId="relation/advanced/effected">
      <SelectClass 
        includePlayerInstance
        formLabel={"What class is effected remotely? ( " + classA.name + " will no longer be effected"}
        value={relation.effect.remoteEffectedClassId ? [relation.effect.remoteEffectedClassId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('remoteEffectedClassId', newClassId)
      }}/>
    </Unlockable>,
    classB && !relation.onlyOnce && effectEditInterface[relation.effect.type]?.delayInterval && <Unlockable interfaceId="relation/advanced/delayInterval">
      <SliderNotched
        formLabel="Delay Interval"
        step={10}
        options={[10, 100, 200, 400, 1000, 3000]}
        onChangeCommitted={(value) => {
          updateCreateRelation({delayInterval: value})
        }}
        value={relation.delayInterval || 10}
      />
    </Unlockable>,
    classB && (relation.event.type === ON_COLLIDE_START || relation.event.type === ON_COLLIDE_ACTIVE || relation.event.type === ON_COLLIDE_END) && <Unlockable interfaceId="relation/advanced/ignoreSides">
      <SelectSides
      formLabel={"Touching which side of " + classB.name + '? ( leave blank for all sides )'}
      value={relation.sides ? relation.sides : []}
      onChange={(event, sides) => {
        updateCreateRelation({
          sides
        })
      }}/>
    </Unlockable>,
  ].filter((i) => {
    return !!i
  })

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateRelation">
      <ClassMemberTitle classId={relation.event.classIdA} title="Relation"/>
        <SelectClass
          disabled={relation.event.classIdB}
          includePlayerInstance
          formLabel="With what objects?"
          value={relation.event.classIdB ? [relation.event.classIdB] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            updateCreateRelation({
              ...defaultRelationship,
              event: {
                classIdA: classA.classId,
                classIdB: newClassId
              }, 
              effect: {

              }
            })
            // handleEventChange('classIdB', newClassId)
         }}/>
        <SelectEvent
          classIdA={relation.event.classIdA}
          classIdB={relation.event.classIdB}
          formLabel="When?"
          disabled={relation.event.type}
          value={relation.event.type ? [relation.event.type] : []}
          onChange={(event, events) => {
            const newEvent = events[events.length-1]
            updateCreateRelation({
              ...defaultRelationship,
              event: {
                classIdA: classA.classId,
                classIdB: relation.event.classIdB,
                type: newEvent
              },
              effect: {

              }
            })
        }}/>
        <SelectRelationEffect
          effect={relation.effect}
          event={relation.event}
          disabled={relation.effect.type}
          classIdA={relation.effect.remoteEffectedClassId || relation.event.classIdA}
          classIdB={relation.event.classIdB}
          formLabel={`What is the effect?`}
          value={relation.effect.type ? [relation.effect.type] : []}
          onChange={(event, effects) => {
            const effect = effects[effects.length-1]
            updateCreateRelation({
              ...defaultRelationship,
              event: {
                classIdA: classA.classId,
                classIdB: relation.event.classIdB,
                type: relation.event.type
              },
              effect: {
                type: effect
              }
            })
        }}/>
        {classB && relation.effect.type === EFFECT_SPAWN &&
          <SelectClass
            formLabel={"What class is spawned? ( If different than " + classA.name  + ')'}
            value={relation.effect.spawnClassId ? [relation.effect.spawnClassId] : []}
            onChange={(event, classes) => {
              const newClassId = classes[classes.length-1]
              handleEffectChange('spawnClassId', newClassId)
          }}/>
        }
        {relation.effect.type && renderEffectForms(relation.effect.type)}
        {advancedOptions.length > 0 && <Unlockable interfaceId="relation/advanced">
          <Typography variant="h5">Advanced</Typography>
          {advancedOptions}
        </Unlockable>}
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
          }}>Remove</Button>}
      </div>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation, editGameModel }),
)(CreateRelation);
