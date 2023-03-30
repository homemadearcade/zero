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

    if(effectForms.arcadeGameMongoId) {
      forms.push(<SelectArcadeGame
        key={'effectGameId'}
        formLabel={effectForms.arcadeGameMongoId}
        value={effect.arcadeGameMongoId ? [effect.arcadeGameMongoId] : []}
        onChange={(event, games) => {
          if(games[0]) {
            const newGameId = games[games.length-1].id
            handleEffectChange('arcadeGameMongoId', newGameId)
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

    if(effectForms.spawnEntityClassId) {
      forms.push(<SelectClass
        formLabel={effectForms.spawnEntityClassId}
        value={effect.spawnEntityClassId ? [effect.spawnEntityClassId] : []}
        onChange={(event, entityClasses) => {
          const newClassId = entityClasses[entityClasses.length-1]
          handleEffectChange('spawnEntityClassId', newClassId)
      }}/>)
    }

    if(effectForms.zoneEntityClassId) {
      forms.push(<SelectClass 
        key={'zoneEntityClassId'}
        classType={ZONE_CLASS}
        formLabel={effectForms.zoneEntityClassId}
        value={effect.zoneEntityClassId ? [effect.zoneEntityClassId] : []}
        onChange={(event, entityClasses) => {
          const newClassId = entityClasses[entityClasses.length-1]
          handleEffectChange('zoneEntityClassId', newClassId)
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
