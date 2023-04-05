import { connect } from 'react-redux';
import { STEP_EFFECT, STEP_OPEN_INTERFACE, STEP_UNLOCK_INTERFACE } from '../../../../constants';
import { getEffectShorthand, } from '../../../../game/constants';

import { interfaceIdData } from '../../../../constants/interfaceIdData';
import { actionIdData } from '../../../../constants/actionIdData';

const StepTitle = ({  
  step,
  prefix = '',
  gameModel: { gameModel },
}) => {
  function renderText() {
    if(step.title) return step.title

    if(step.stepBehavior === STEP_EFFECT) {
      if(!step.effectIds || step.effectIds.length === 0) return 'Game Effect'
      const effect = gameModel.effects[step.effectIds[0]]
      return getEffectShorthand(effect)
    } else if(step.stepBehavior === STEP_OPEN_INTERFACE) {
      if(!step.actionIds || step.actionIds.length === 0) return 'Open Interface'
      const actionData = actionIdData[step.actionIds[0]]
      return actionData.name
    } else if(step.stepBehavior === STEP_UNLOCK_INTERFACE) {
      if(!step.interfaceIds || step.interfaceIds.length === 0) return 'Unlock Interface'
      const interfaceData = interfaceIdData[step.interfaceIds[0]]
      return 'Unlock ' + (interfaceData.name || interfaceData.previewText)
    }
  }

  return prefix  + renderText()

};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { })(StepTitle);
