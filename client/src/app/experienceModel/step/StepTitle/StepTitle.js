import { connect } from 'react-redux';
import { effectInterfaceDatas, getEffectShorthand } from '../../../../game/constants';

const StepTitle = ({  
  step,
  prefix = '',
  gameModel: { gameModel },
}) => {
  function renderText() {
    if(step.title) return step.title
    if(!step.effectIds || step.effectIds.length === 0) return 'Step'
    if(gameModel) {
      const effect = gameModel?.effects[step.effectIds[0]]
      return getEffectShorthand(effect)
    }
  }

  return prefix  + renderText()
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { })(StepTitle);
