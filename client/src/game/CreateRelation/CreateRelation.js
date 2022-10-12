/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelation.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateRelation, updateCreateRelation } from '../../store/actions/gameFormEditorActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../utils/webPageUtils';
import { editGameModel } from '../../store/actions/gameActions';
import FormLabel from '../../app/ui/FormLabel/FormLabel';
import SelectClass from '../ui/SelectClass/SelectClass';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';
import SelectEvent from '../ui/SelectEvent/SelectEvent';
import SelectRelationEffect from '../ui/SelectRelationEffect/SelectRelationEffect';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import { effectEditInterface } from '../../defaultData/relationship';
import { TextField } from '@mui/material';
import { ZONE_CLASS } from '../../constants';
import SelectCutscene from '../ui/SelectCutscene/SelectCutscene';

const CreateRelation = ({ closeCreateRelation, editGameModel, updateCreateRelation, gameFormEditor: { classIdRelationsMenu, relation }, game: { gameModel }}) => {
  function handleClose() {
    closeCreateRelation()
  }

  const [isNewRelation, setIsNewRelation] = useState(null)

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

    if(editForms?.cutsceneId) {
      if(!relation.effect.cutsceneId) return true
    }

    if(editForms?.text) {
      if(!relation.effect.text) return true
    }

    if(!relation.effect.type || !relation.event || !relation.classId) return true
    
    return false 
  }

  const handleRelationChange = (prop, value) => {
    relation[prop] = value
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
        key={classIdRelationsMenu + 'effectClassId'}
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
        key={classIdRelationsMenu + 'effectClassId'}
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
        key={classIdRelationsMenu + 'effectCutsceneId'}
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
      <ClassMemberTitle classId={classIdRelationsMenu} title="Relation"/>
        <SelectClass 
          formLabel="With what objects?"
          value={relation.classId ? [relation.classId] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            handleRelationChange('classId', newClassId)
         }}/>
        <SelectEvent
          disabled={!relation.effect.type}
          classId={classIdRelationsMenu}
          agentClassId={relation.classId}
          formLabel="When?"
          value={relation.event ? [relation.event] : []}
          onChange={(event, events) => {
            const newEvent = events[events.length-1]
            handleRelationChange('event', newEvent)
        }}/>
        <Unlockable interfaceId="relation/effected">
          <SelectClass 
            formLabel="What objects are effected, instead?"
            value={relation.effect.effectedClassId ? [relation.effect.effectedClassId] : []}
            onChange={(event, classes) => {
              const newClassId = classes[classes.length-1]
              handleEffectChange('effectedClassId', newClassId)
          }}/>
         </Unlockable>
        <SelectRelationEffect
          event={relation.event}
          disabled={!relation.classId}
          classId={relation.effect.effectedClassId || classIdRelationsMenu}
          agentClassId={relation.classId}
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
            classes: {
              [classIdRelationsMenu]: {
                relations: {
                  [relation.relationId] : {
                    ...relation
                  }
                }
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
        <Button onClick={() => {
        editGameModel({
          classes: {
            [classIdRelationsMenu]: {
              relations: {
                [relation.relationId]: null
              }
            }
          }
        })
        handleClose()
        }}>Remove</Button>
      </div>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  game: state.game
})

export default compose(
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation, editGameModel }),
)(CreateRelation);
