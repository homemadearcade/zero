/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffect.scss';
import { closeCreateEffect, updateCreateEffect} from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import SelectClass from '../../ui/SelectClass/SelectClass';
import { defaultEffect, effectEditInterface } from '../../constants';
import { TextField } from '@mui/material';
import { ZONE_CLASS } from '../../constants';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import SelectStage from '../../ui/SelectStage/SelectStage';
import SelectGame from '../../../ui/connected/SelectGame/SelectGame';
import SelectEffectType from '../../ui/SelectEffectType/SelectEffectType';

const CreateEffect = ({ updateCreateEffect, gameFormEditor: { effects, event }, effectId}) => {
  const effect = effects[effectId]

  const handleEffectChange = (prop, value) => {
    effect[prop] = value
    updateCreateEffect(effectId, effect)
  }
  
  function renderEffectForms() {
    const effectForms = effectEditInterface[effect.type]

    const forms = []

    if(effectForms.cutsceneId) {
      forms.push(<SelectCutscene
        key={'effectCutsceneId'}
        formLabel={effectForms.cutsceneId}
        value={effect.cutsceneId ? [effect.cutsceneId] : []}
        onChange={(event, cutscenes) => {
          const newCutsceneId = cutscenes[cutscenes.length-1]
          handleEffectChange('cutsceneId', newCutsceneId)
        }}/>
      )
    }

    if(effectForms.stageId) {
      forms.push(<SelectStage
        key={'effectStageId'}
        formLabel={effectForms.stageId}
        value={effect.stageId ? [effect.stageId] : []}
        onChange={(event, stages) => {
          const newStageId = stages[stages.length-1]
          handleEffectChange('stageId', newStageId)
        }}/>
      )
    }

    if(effectForms.gameId) {
      forms.push(<SelectGame
        key={'effectGameId'}
        formLabel={effectForms.gameId}
        value={effect.gameId ? [effect.gameId] : []}
        onChange={(event, games) => {
          const newGameId = games[games.length-1]
          handleEffectChange('gameId', newGameId)
        }}/>
      )
    }

    if(effectForms.text) {
      forms.push(<TextField key={"effect/text"}  multiline value={effect.text} onChange={(e) => {
        handleEffectChange('text', e.target.value)
      }} label={effectForms.text}/>
      )
    }

    if(effectForms.classId) {
      forms.push(<SelectClass 
        key={'effectClassId'}
        formLabel={effectForms.classId}
        value={effect.classId ? [effect.classId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('classId', newClassId)
        }}/>
      )
    }

    if(effectForms.spawnClassId) {
      forms.push(<SelectClass
        formLabel={effectForms.spawnClassId}
        value={effect.spawnClassId ? [effect.spawnClassId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('spawnClassId', newClassId)
      }}/>)
    }

    if(effectForms.zoneClassId) {
      forms.push(<SelectClass 
        key={'zoneClassId'}
        classType={ZONE_CLASS}
        formLabel={effectForms.zoneClassId}
        value={effect.zoneClassId ? [effect.zoneClassId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('zoneClassId', newClassId)
        }}/>
      )
    }

    return forms
  }

  return  <div className="CreateEffect">
    <SelectEffectType
      effect={effect}
      event={event.type}
      formLabel={`What is the effect?`}
      value={effect.type ? [effect.type] : []}
      onChange={(event, effectTypes) => {
        const effectType = effectTypes[effectTypes.length-1]
        updateCreateEffect(effectId, {
          ...defaultEffect,
          type: effectType,
          effectId,
        })
    }}/>
    {effect.type && renderEffectForms(effect.type)}

    </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEffect, closeCreateEffect, editGameModel }),
)(CreateEffect);
