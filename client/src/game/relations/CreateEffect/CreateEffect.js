/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffect.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateEffect, updateCreateEffect } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import SelectClass from '../../ui/SelectClass/SelectClass';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { effectEditInterface, EFFECT_ID_PREFIX, nonRemoteEffects } from '../../constants';
import { TextField } from '@mui/material';
import { EFFECT_SPAWN, ZONE_CLASS } from '../../constants';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import Typography from '../../../ui/Typography/Typography';
import SelectStage from '../../ui/SelectStage/SelectStage';
import SelectGame from '../../../ui/connected/SelectGame/SelectGame';
import { EFFECT_REMOTE_IID, EVENT_ADVANCED_CONTAINER_IID } from '../../../constants/interfaceIds';
import SelectEffectType from '../../ui/SelectEffectType/SelectEffectType';

/*



          <CobrowsingAccordianList
            listId="CreateEffect"
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

const CreateEffect = ({ closeCreateEffect, editGameModel, updateCreateEffect, gameFormEditor: { effects }, effectId, gameModel: { gameModel } }) => {
  function handleClose() {
    closeCreateEffect()
  }

  const effect = effects[effectId]

  useEffect(() => {
    if(!effect.effectId) {
      updateCreateEffect(effectId, { effectId: EFFECT_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  function isAutosaveDisabled() {
    const effectForms = effectEditInterface[effect.type]

    if(effectForms?.classId) {
      if(!effect.classId) return true
    }

    if(effectForms?.zoneClassId) {
      if(!effect.zoneClassId) return true
    }

    if(effectForms?.cutsceneId) {
      if(!effect.cutsceneId) return true
    }

    if(effectForms?.stageId) {
      if(!effect.stageId) return true
    }

    if(effectForms?.text) {
      if(!effect.text) return true
    }

    if(!effect.type) return true
    
    return false 
  }

  // const handleEventChange = (prop, value) => {
  //   effect.event[prop] = value
  //   updateCreateEffect(effectId, effect)
  // }

  const handleEffectChange = (prop, value) => {
    effect[prop] = value
    updateCreateEffect(effectId, effect)
  }

  function renderEffectForms(effect, effectedClass) {
    const effectForms = effectEditInterface[effect]

    const forms = []
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

    return forms
  }

  const advancedOptions = [
    effect.type && !nonRemoteEffects[effect.type] && <Unlockable interfaceId={EFFECT_REMOTE_IID}>
      <SelectClass 
        key="effect/remoteClass"
        includePlayerInstance
        formLabel={"What tag is effected?"}
        value={effect.remoteEffectedTagId ? [effect.remoteEffectedTagId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          handleEffectChange('remoteEffectedTagId', newClassId)
      }}/>
    </Unlockable>,
  ].filter((i) => {
    return !!i
  })

  return  <div className="CreateEffect">
        <SelectEffectType
          effect={effect}
          disabled={effect.type}
          formLabel={`What is the effect?`}
          value={effect.type ? [effect.type] : []}
          onChange={(event, effects) => {
            const effect = effects[effects.length-1]
            updateCreateEffect(effectId, {
              type: effect
            })
        }}/>
        {effect.type === EFFECT_SPAWN &&
          <SelectClass
            formLabel={"What class is spawned?"}
            value={effect.spawnClassId ? [effect.spawnClassId] : []}
            onChange={(event, classes) => {
              const newClassId = classes[classes.length-1]
              handleEffectChange('spawnClassId', newClassId)
          }}/>
        }
        {effect.type && renderEffectForms(effect.type)}
        {advancedOptions.length > 0 && <Unlockable interfaceId={EVENT_ADVANCED_CONTAINER_IID}>
          <Typography variant="h5">Advanced</Typography>
          {advancedOptions}
        </Unlockable>}
        <div className="CreateEffect__buttons">
          <Button 
            disabled={isAutosaveDisabled()}
            onClick={() => {
            editGameModel({
              effects: {
                [effect.effectId] : {
                  ...effect,
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
          {!effect.isNew && <Button onClick={() => {
            editGameModel({
              effects: {
                [effect.effectId]: null
              }
            })
            handleClose()
          }}>Delete</Button>}
      </div>
    </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateEffect, closeCreateEffect, editGameModel }),
)(CreateEffect);
