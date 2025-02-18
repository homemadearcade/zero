/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffect.scss';
import { closeCreateEffect } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import SelectEntityModel from '../../ui/SelectEntityModel/SelectEntityModel';
import { defaultEffect, effectInterfaceData } from '../../constants';
import { TextField } from '@mui/material';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import SelectStage from '../../ui/SelectStage/SelectStage';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import SelectEffectBehavior from '../../ui/SelectEffectBehavior/SelectEffectBehavior';
import { ZONE_ENTITY_IID , RELATION_ENTITY_MODEL_IID, RELATION_SPAWN_ENTITY_MODEL_IID, RELATION_SPAWN_ZONE_ENTITY_IID } from '../../../constants/interfaceIds';

const CreateEffect = ({ onUpdateEffect, eventType, effect}) => {
  const handleEffectChange = (prop, value) => {
    effect[prop] = value
    onUpdateEffect(effect)
  }
  
  function renderEffectForms() {
    const effectTypeInterfaceData = effectInterfaceData[effect.effectBehavior]

    const forms = []

    if(effectTypeInterfaceData.cutsceneId) {
      forms.push(<SelectCutscene
        key={'effectCutsceneId'}
        formLabel={effectTypeInterfaceData.cutsceneId}
        value={effect.cutsceneId ? [effect.cutsceneId] : []}
        onChange={(event, cutscenes) => {
          const newCutsceneId = cutscenes[cutscenes.length-1]
          handleEffectChange('cutsceneId', newCutsceneId)
        }}/>
      )
    }

    if(effectTypeInterfaceData.stageId) {
      forms.push(<SelectStage
        key={'effectStageId'}
        formLabel={effectTypeInterfaceData.stageId}
        value={effect.stageId ? [effect.stageId] : []}
        onChange={(event, stages) => {
          const newStageId = stages[stages.length-1]
          handleEffectChange('stageId', newStageId)
        }}/>
      )
    }

    if(effectTypeInterfaceData.arcadeGameMongoId) {
      forms.push(<SelectArcadeGame
        key={'effectGameId'}
        formLabel={effectTypeInterfaceData.arcadeGameMongoId}
        value={effect.arcadeGameMongoId ? [effect.arcadeGameMongoId] : []}
        onChange={(event, games) => {
          if(games[0]) {
            const newGameId = games[games.length-1].id
            handleEffectChange('arcadeGameMongoId', newGameId)
          }
        }}/>
      )
    }

    if(effectTypeInterfaceData.text) {
      forms.push(<TextField key={"effect/text"}  multiline value={effect.text} onChange={(e) => {
        handleEffectChange('text', e.target.value)
      }} label={effectTypeInterfaceData.text}/>
      )
    }

    if(effectTypeInterfaceData.entityModelId) {
      forms.push(<SelectEntityModel
        key={'entityModelId'}
        interfaceId={RELATION_ENTITY_MODEL_IID}
        formLabel={effectTypeInterfaceData.entityModelId}
        value={effect.entityModelId ? [effect.entityModelId] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          handleEffectChange('entityModelId', newEntityId)
        }}/>
      )
    }

    if(effectTypeInterfaceData.spawnEntityModelId) {
      forms.push(<SelectEntityModel
        key={'spawnEntityModelId'}
        interfaceId={RELATION_SPAWN_ENTITY_MODEL_IID}
        formLabel={effectTypeInterfaceData.spawnEntityModelId}
        value={effect.spawnEntityModelId ? [effect.spawnEntityModelId] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          handleEffectChange('spawnEntityModelId', newEntityId)
      }}/>)
    }

    if(effectTypeInterfaceData.zoneEntityModelId) {
      forms.push(<SelectEntityModel
        key={'zoneEntityModelId'}
        entityModelClass={ZONE_ENTITY_IID}
        interfaceId={RELATION_SPAWN_ZONE_ENTITY_IID}
        formLabel={effectTypeInterfaceData.zoneEntityModelId}
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
      eventType={eventType}
      formLabel={`What is the effect?`}
      value={effect.effectBehavior ? [effect.effectBehavior] : []}
      onChange={(event, effectBehaviors) => {
        const effectBehavior = effectBehaviors[effectBehaviors.length-1]
        onUpdateEffect({
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
  connect(mapStateToProps, { closeCreateEffect, editGameModel }),
)(CreateEffect);
