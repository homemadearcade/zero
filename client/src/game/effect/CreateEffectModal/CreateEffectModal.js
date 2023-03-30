/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEffectModal.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateEffect, updateCreateEffect } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { EFFECT_ID_PREFIX } from '../../constants';
import useIsEffectSaveable from '../../../hooks/useIsEffectSaveable';
import CreateEffect from '../CreateEffect/CreateEffect';

const CreateEffectModal = ({ 
  closeCreateEffect, editGameModel, 
  gameFormEditor: { effect },
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

  return <CobrowsingModal open={true} onClose={handleClose}>
        <CreateEffect/>
        <div className="CreateEffect__buttons">
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
    </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateEffect, closeCreateEffect, editGameModel}),
)(CreateEffectModal);
