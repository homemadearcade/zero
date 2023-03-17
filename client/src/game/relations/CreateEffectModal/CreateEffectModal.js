/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffectModal.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateEffect, updateCreateEffect, updateEditingEffectId } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { EFFECT_ID_PREFIX } from '../../constants';
import useIsEffectSaveable from '../../../hooks/useIsEffectSaveable';
import CreateEffect from '../CreateEffect/CreateEffect';

const CreateEffectModal = ({ 
  closeCreateEffect, editGameModel, 
  gameFormEditor: { effects, editingEffectId },
  updateEditingEffectId,
  updateCreateEffect,
  onComplete
}) => {
  function handleClose() {
    closeCreateEffect()
  }

  const effect = effects[editingEffectId]

  useEffect(() => {
    if(!effect || !effect.effectId) {
      const effectId = EFFECT_ID_PREFIX+generateUniqueId()
      updateCreateEffect(effectId, { effectId, isNew: true })
      updateEditingEffectId(effectId)
    }
  }, [])

  const isEffectSaveable = useIsEffectSaveable(effect)

  if(!effect) return

  return <CobrowsingModal open={true} onClose={handleClose}>
        <CreateEffect effectId={editingEffectId}/>
        <div className="CreateEffect__buttons">
          <Button 
            disabled={!isEffectSaveable}
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
            if(onComplete) onComplete(effect.effectId)
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
    </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateEffect, closeCreateEffect, editGameModel, updateEditingEffectId }),
)(CreateEffectModal);
