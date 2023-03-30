/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffect.scss';
import { closeCreateEffect, updateCreateEffect} from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import SelectClass from '../../ui/SelectClass/SelectClass';
import { defaultEffect, effectBehaviorInterfaces } from '../../constants';
import { TextField } from '@mui/material';
import { ZONE_CLASS } from '../../constants';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import SelectStage from '../../ui/SelectStage/SelectStage';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import SelectEffectBehavior from '../../ui/SelectEffectBehavior/SelectEffectBehavior';

const CreateEffect = ({ updateCreateEffect, gameFormEditor: { effect, event }}) => {
  const handleEffectChange = (prop, value) => {
    effect[prop] = value
    updateCreateEffect(effect)
  }
  
  function renderEffectForms() {
    const effectForms = effectBehaviorInterfaces[effect.effectBehavior]

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
      forms.push(<SelectArcadeGame
        key={'effectGameId'}
        formLabel={effectForms.gameId}
        value={effect.gameId ? [effect.gameId] : []}
        onChange={(event, games) => {
          if(games[0]) {
            const newGameId = games[games.length-1].id
            handleEffectChange('gameId', newGameId)
          }
        }}/>
      )
    }

    if(effectForms.text) {
      forms.push(<TextField key={"effect/text"}  multiline value={effect.text} onChange={(e) => {
        handleEffectChange('text', e.target.value)
      }} label={effectForms.text}/>
      )
    }

    // if(effectForms.entityClassId) {
    //   forms.push(<SelectClass 
    //     key={'entityClassId'}
    //     formLabel={effectForms.entityClassId}
    //     value={effect.entityClassId ? [effect.entityClassId] : []}
    //     onChange={(event, entityClasses) => {
    //       const newClassId = entityClasses[entityClasses.length-1]
    //       handleEffectChange('entityClassId', newClassId)
    //     }}/>
    //   )
    // }

    if(effectForms.spawnClassId) {
      forms.push(<SelectClass
        formLabel={effectForms.spawnClassId}
        value={effect.spawnClassId ? [effect.spawnClassId] : []}
        onChange={(event, entityClasses) => {
          const newClassId = entityClasses[entityClasses.length-1]
          handleEffectChange('spawnClassId', newClassId)
      }}/>)
    }

    if(effectForms.zoneClassId) {
      forms.push(<SelectClass 
        key={'zoneClassId'}
        classType={ZONE_CLASS}
        formLabel={effectForms.zoneClassId}
        value={effect.zoneClassId ? [effect.zoneClassId] : []}
        onChange={(event, entityClasses) => {
          const newClassId = entityClasses[entityClasses.length-1]
          handleEffectChange('zoneClassId', newClassId)
        }}/>
      )
    }

    return forms
  }

  return  <div className="CreateEffect">
    <SelectEffectBehavior
      effect={effect}
      eventType={event.eventType}
      formLabel={`What is the effect?`}
      value={effect.effectBehavior ? [effect.effectBehavior] : []}
      onChange={(event, effectBehaviors) => {
        const effectBehavior = effectBehaviors[effectBehaviors.length-1]
        updateCreateEffect({
          ...defaultEffect,
          effectBehavior: effectBehavior,
          effectId: effect.effectId,
        })
    }}/>
    {effect.effectBehavior && renderEffectForms(effect.effectBehavior)}

    </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEffect, closeCreateEffect, editGameModel }),
)(CreateEffect);
