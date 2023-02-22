/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
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
import Switch from '../../../ui/Switch/Switch';
import Typography from '../../../ui/Typography/Typography';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import SelectStage from '../../ui/SelectStage/SelectStage';
import { RELATION_ADVANCED_CONTAINER_IID, RELATION_ADVANCED_DELAY_INTERVAL_IID, RELATION_ADVANCED_IGNORE_SIDES_IID, RELATION_ADVANCED_REMOTE_EFFECTED_IID, RELATION_DELAY_EFFECT_IID, RELATION_ONLY_ONCE_IID, RELATION_PICK_RANDOM_ZONE_IID } from '../../../constants/interfaceIds';

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

    if(editForms?.stageId) {
      if(!relation.effect.stageId) return true
    }


    if(editForms?.text) {
      if(!relation.effect.text) return true
    }

    if(!relation.effect.type || !relation.event.type || !relation.event.classIdA || !relation.event.classIdB) return true
    
    return false 
  }

  // const handleEventChange = (prop, value) => {
  //   relation.event[prop] = value
  //   updateCreateRelation(relation)
  // }

  const handleEffectChange = (prop, value) => {
    relation.effect[prop] = value
    updateCreateRelation(relation)
  }

  function renderEffectForms(effect, effectedClass) {
    const editForms = effectEditInterface[effect]

    const forms = []
    if(editForms.classId) {
      forms.push(<SelectClass 
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

    if(editForms.stageId) {
      forms.push(<SelectStage
        key={relation.event.classIdA + 'effectStageId'}
        formLabel={editForms.stageId}
        value={relation.effect.stageId ? [relation.effect.stageId] : []}
        onChange={(event, stages) => {
          const newStageId = stages[stages.length-1]
          handleEffectChange('stageId', newStageId)
        }}/>
      )
    }

    if(editForms.text) {
      forms.push(<TextField key={"relation/text"}  multiline value={relation.effect.text} onChange={(e) => {
        handleEffectChange('text', e.target.value)
      }} label={editForms.text}/>
      )
    }

    if(editForms.onlyOnce) {
      forms.push(<Unlockable key={"relation/onlyOnce"} interfaceId={RELATION_ONLY_ONCE_IID}>
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

    if(editForms.delayEffect) {
      forms.push(<Unlockable key={"relation/delayEffect"} interfaceId={RELATION_DELAY_EFFECT_IID}>
        <SliderNotched
          formLabel="Delay Effect (ms)"
          step={10}
          options={[0, 10, 50, 100, 200, 400, 1000, 3000, 6000, 9000, 15000, 20000]}
          onChangeCommitted={(value) => {
            handleEffectChange('delayEffect', value)
          }}
          value={relation.delayEffect || 0}
        />
      </Unlockable>)
    }

    if(editForms.pickRandomZone && classA.classId === relation.effect.zoneClassId) {
      forms.push(<Unlockable key={"relation/pickRandomZone"} interfaceId={RELATION_PICK_RANDOM_ZONE_IID}>
        <Switch
          labels={['Use this zone', 'Pick Random Zone']}
          size="small"
          onChange={(e) => {
            handleEffectChange('pickRandomZone', e.target.value)
          }}
          checked={relation.effect.pickRandomZone}
         />
      </Unlockable>)
    }

    return forms
  }

  const advancedOptions = [
    classB && relation.effect.type && !nonRemoteEffects[relation.effect.type] && <Unlockable interfaceId={RELATION_ADVANCED_REMOTE_EFFECTED_IID}>
      <SelectClass 
        key="relation/remoteClass"
        includePlayerInstance
        formLabel={"What class is effected remotely? ( " + classA.name + " will no longer be effected )"}
        value={relation.effect.remoteEffectedClassId ? [relation.effect.remoteEffectedClassId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('remoteEffectedClassId', newClassId)
      }}/>
    </Unlockable>,
    classB && !relation.onlyOnce && effectEditInterface[relation.effect.type]?.delayInterval && <Unlockable interfaceId={RELATION_ADVANCED_DELAY_INTERVAL_IID}>
      <SliderNotched
              key="relation/delayInterval"
        formLabel="Delay Interval (ms)"
        step={10}
        options={[100, 200, 400, 1000, 3000]}
        onChangeCommitted={(value) => {
          updateCreateRelation({delayInterval: value})
        }}
        value={relation.delayInterval || 200}
      />
    </Unlockable>,
    classB && (relation.event.type === ON_COLLIDE_START || relation.event.type === ON_COLLIDE_ACTIVE || relation.event.type === ON_COLLIDE_END) && <Unlockable interfaceId={RELATION_ADVANCED_IGNORE_SIDES_IID}>
      <SelectSides
       key="relation/sidesA"
      formLabel={"Touching which side of " + classA.name + '? ( leave blank for all sides )'}
      value={relation.sidesA ? relation.sidesA : []}
      onChange={(event, sides) => {
        updateCreateRelation({
          sidesA: sides
        })
      }}/>
            <SelectSides
       key="relation/sidesB"
      formLabel={"Touching which side of " + classB.name + '? ( leave blank for all sides )'}
      value={relation.sidesB ? relation.sidesB : []}
      onChange={(event, sides) => {
        updateCreateRelation({
          sidesB: sides
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
        {advancedOptions.length > 0 && <Unlockable interfaceId={RELATION_ADVANCED_CONTAINER_IID}>
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
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation, editGameModel }),
)(CreateRelation);
