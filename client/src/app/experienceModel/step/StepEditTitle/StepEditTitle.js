import React, { useState } from 'react';
import { connect } from 'react-redux';
import Typography from '../../../../ui/Typography/Typography';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import './StepEditTitle.scss';
import IconButton from '../../../../ui/IconButton/IconButton';
import StepTitle from '../StepTitle/StepTitle';
import TextField from '../../../../ui/TextField/TextField';

const StepEditTitle = ({  
  instructionId,
  experienceModel: { experienceModel },
  editExperienceModel,
  step
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(step.title)

  if(isEditing) {
    return <div className='StepEditTitle'>
    <TextField onChange={(e) => {
      console.log(e.target.value)
      setTitle(e.target.value)
    }} label="Step Title" value={title} />
    {<IconButton color="primary" icon="faCheck" onClick={() => {
      setIsEditing(false)
      editExperienceModel(experienceModel.id, {
        instructions: {
          [instructionId]: {
            steps: {
              [step.stepId]: {
                title
              }
            }
          }
        }
      })
     }}></IconButton>}
      {<IconButton color="primary" icon="faClose" onClick={() => {
      setIsEditing(false)
      editExperienceModel(experienceModel.id, {
        instructions: {
          [instructionId]: {
            steps: {
              [step.stepId]: {
                title: ''
              }
            }
          }
        }
      })
     }}></IconButton>}
    </div>
  }

  return <div onMouseEnter={() => {
    setIsHovering(true)
  }} onMouseLeave={() => {
    setIsHovering(false)
  }} className='StepEditTitle'><Typography variant="h5">
    <StepTitle step={step}/>
    </Typography>
      {isHovering && <IconButton 
      icon="faPen"
      color="primary"
      onClick={() => {
        setIsEditing(true)
      }}
    />}
  </div>
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(StepEditTitle);
