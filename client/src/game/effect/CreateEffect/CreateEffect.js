/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffect.scss';
import { closeCreateEffect, updateCreateEffect} from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import SelectEntity from '../../ui/SelectEntityModel/SelectEntityModel';
import { defaultEffect, effectBehaviorInterfaces } from '../../constants';
import { TextField } from '@mui/material';
import { ZONE_ENTITY_IID } from '../../constants';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import SelectStage from '../../ui/SelectStage/SelectStage';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import SelectEffectBehavior from '../../ui/SelectEffectBehavior/SelectEffectBehavior';
import { RELATION_SPAWN_ENTITY_MODEL_IID, RELATION_SPAWN_ZONE_ENTITY_IID } from '../../../constants/interfaceIds';

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

    if(effectForms.entityModelId) {
      forms.push(<SelectEntity 
        key={'entityModelId'}
        formLabel={effectForms.entityModelId}
        value={effect.entityModelId ? [effect.entityModelId] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          handleEffectChange('entityModelId', newEntityId)
        }}/>
      )
    }

    if(effectForms.spawnEntityModelId) {
      forms.push(<SelectEntity
        interfaceId={RELATION_SPAWN_ENTITY_MODEL_IID}
        formLabel={effectForms.spawnEntityModelId}
        value={effect.spawnEntityModelId ? [effect.spawnEntityModelId] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          handleEffectChange('spawnEntityModelId', newEntityId)
      }}/>)
    }

    if(effectForms.zoneEntityModelId) {
      forms.push(<SelectEntity 
        key={'zoneEntityModelId'}
        entityModelType={ZONE_ENTITY_IID}
        interfaceId={RELATION_SPAWN_ZONE_ENTITY_IID}
        formLabel={effectForms.zoneEntityModelId}
        value={effect.zoneEntityModelId ? [effect.zoneEntityModelId] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          handleEffectChange('zoneEntityModelId', newEntityId)
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
