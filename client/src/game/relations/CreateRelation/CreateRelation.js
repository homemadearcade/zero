/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelation.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateRelation, updateCreateRelation } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../components/ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameActions';
import SelectClass from '../../ui/SelectClass/SelectClass';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';
import SelectEvent from '../../ui/SelectEvent/SelectEvent';
import SelectRelationEffect from '../../ui/SelectRelationEffect/SelectRelationEffect';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { effectEditInterface } from '../../../defaultData/relationship';
import { TextField } from '@mui/material';
import { ON_COLLIDE, ZONE_CLASS } from '../../../constants';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import SelectSides from '../../ui/SelectSides/SelectSides';

const CreateRelation = ({ closeCreateRelation, editGameModel, updateCreateRelation, gameFormEditor: { relation }, game: { gameModel} }) => {
  function handleClose() {
    closeCreateRelation()
  }

  const [isNewRelation, setIsNewRelation] = useState(null)

  const classA = gameModel.classes[relation.event.classIdA]
  const classB = gameModel.classes[relation.event.classIdB]

  useEffect(() => {
    if(!relation.relationId) {
      updateCreateRelation({ relationId: generateUniqueId() })
      setIsNewRelation(true)
    } else {
      setIsNewRelation(false)
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

    const forms =[]
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
        key={relation.event.classIdA + 'effectClassId'}
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

    return forms
  }
  

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateRelation">
      <ClassMemberTitle classId={relation.event.classIdA} title="Relation"/>
        <SelectClass 
          formLabel="With what objects?"
          value={relation.event.classIdB ? [relation.event.classIdB] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            handleEventChange('classIdB', newClassId)
         }}/>
        <SelectEvent
          classIdA={relation.event.classIdA}
          classIdB={relation.event.classIdB}
          formLabel="When?"
          value={relation.event.type ? [relation.event.type] : []}
          onChange={(event, events) => {
            const newEvent = events[events.length-1]
            handleEventChange('type', newEvent)
        }}/>
        {classB && relation.event.type === ON_COLLIDE && <Unlockable interfaceId="physics/ignoreSides">
          <SelectSides
            formLabel={"Overlapping with which side of " + classB.name + '? ( leave blank for all sides )'}
            value={relation.sides ? relation.sides : []}
            onChange={(event, sides) => {
              updateCreateRelation({
                sides
              })
          }}/>
        </Unlockable>}
        {classB && <Unlockable interfaceId="relation/effected">
          <SelectClass 
            formLabel={"What class is effected? Instead of the " + classA.name + ' instance'}
            value={relation.effect.effectedClassId ? [relation.effect.effectedClassId] : []}
            onChange={(event, classes) => {
              const newClassId = classes[classes.length-1]
              handleEffectChange('effectedClassId', newClassId)
          }}/>
         </Unlockable>}
        <SelectRelationEffect
          effect={relation.effect}
          event={relation.event}
          classIdA={relation.effect.effectedClassId || relation.event.classIdA}
          classIdB={relation.event.classIdB}
          formLabel={`What is the effect?`}
          value={relation.effect.type ? [relation.effect.type] : []}
          onChange={(event, effects) => {
            const effect = effects[effects.length-1]
            handleEffectChange('type', effect)
        }}/>
        {relation.effect.type && renderEffectForms(relation.effect.type)}
        <div className="CreateRelation__buttons">
        <Button 
        disabled={isSaveDisabled()}
        onClick={() => {
           editGameModel({
            relations: {
              [relation.relationId] : {
                ...relation
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
        {!isNewRelation && <Button onClick={() => {
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
  game: state.game,
})

export default compose(
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation, editGameModel }),
)(CreateRelation);
