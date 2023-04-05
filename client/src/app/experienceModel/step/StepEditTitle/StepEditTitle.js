import React from 'react';
import { connect } from 'react-redux';
import Typography from '../../../../ui/Typography/Typography';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import './StepEditTitle.scss';
import IconButton from '../../../../ui/IconButton/IconButton';
import StepTitle from '../StepTitle/StepTitle';

const StepEditTitle = ({  
  editExperienceModel,
  step
}) => {
  return <Typography variant="h5">
    <StepTitle step={step}/>
    <IconButton 
      icon="faEdit"
      color="primary"
      onClick={() => {

      }}
    />
  </Typography>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { editExperienceModel })(StepEditTitle);
