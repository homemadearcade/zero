import { connect } from 'react-redux';
import { experienceEffectInterfaceIdData } from '../../../../constants/experience/experienceEffect';

const StepTitle = ({  
  step,
  prefix = '',
  experienceModel: { experienceModel },
}) => {
  function renderText() {
    if(step.title) return step.title
    if(!step.experienceEffectIds || step.experienceEffectIds.length === 0) return 'Step'
    const experienceEffect = experienceModel.experienceEffects[step.experienceEffectIds[0]]
    return experienceEffect.name || experienceEffectInterfaceIdData[experienceEffect.experienceEffectBehavior].displayName
  }

  return prefix  + renderText()

};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(StepTitle);
