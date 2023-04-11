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
    if(!experienceEffect) return 'Missing Effect'
    if(experienceEffect.name) return experienceEffect.name
    const interfaceData = experienceEffectInterfaceIdData[experienceEffect.experienceEffectBehavior]
    if(!interfaceData) return 'Missing Interface Data'
    return experienceEffectInterfaceIdData[experienceEffect.experienceEffectBehavior].displayName
  }

  return prefix  + renderText()

};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(StepTitle);
