/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffectDialog.scss';
import CobrowsingDialog from '../../../game/cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeCreateEffect, updateCreateEffect } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { EFFECT_ID_PREFIX } from '../../constants';
import useIsEffectSaveable from '../../../hooks/relations/useIsEffectSaveable';
import CreateEffect from '../CreateEffect/CreateEffect';
import ReadOnlyWarning from '../../ui/ReadOnlyWarning/ReadOnlyWarning';

const CreateEffectDialog = ({ 
  closeCreateEffect, editGameModel, 
  gameFormEditor: { effect, event },
  updateCreateEffect,
}) => {
  function handleClose() {
    closeCreateEffect()
  }

  useEffect(() => {
    if(!effect || !effect.effectId) {
      const effectId = EFFECT_ID_PREFIX+generateUniqueId()
      updateCreateEffect({ effectId, isNew: true })
    }
  }, [])

  const isEffectSaveable = useIsEffectSaveable(effect)

  if(!effect) return

  function renderButtons() {
    if(effect.isReadOnly) return <ReadOnlyWarning text={'This Effect is Read only'} />

    return <div className="CreateEffect__buttons">
      <Button 
        disabled={!effect.effectBehavior || !isEffectSaveable}
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
            [effect.effectId]: {
              isRemoved: true
            }
          }
        })
        handleClose()
      }}>Remove</Button>}
      </div>
  }

  return <CobrowsingDialog open={true} onClose={handleClose}>
        <CreateEffect onUpdateEffect={updateCreateEffect} effect={effect} eventType={event.eventType}/>
        {renderButtons()}
    </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateEffect, closeCreateEffect, editGameModel}),
)(CreateEffectDialog);
