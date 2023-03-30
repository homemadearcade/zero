import React from 'react';
import { connect } from 'react-redux';

import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import InstructionForm from '../InstructionForm/InstructionForm';

const InstructionEditForm = ({ editExperienceModel, instructionId, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const instruction = experienceModel.instructions[instructionId]
  
  const { handleSubmit, control, formState: { isValid }, register } = useForm({
    defaultValues: instruction
  });
  const submit = async (data) => {
    editExperienceModel(experienceModel.id, {
      instructions: {
        [instructionId]: {
          ...data
        }
      }
    })
    if(onSubmit) onSubmit()
  }

  return (
    <div className="InstructionEditForm">
      <form>
        <InstructionForm isEdit control={control} register={register} />
        <br/>
        <Button disabled={isSaving || !isValid} type="submit" onClick={handleSubmit(submit)}>Save</Button>
        <Button disabled={instruction.isNotRemoveable} onClick={() => {
          editExperienceModel(experienceModel.id, {
            instructions: {
              [instructionId]: {
                isRemoved: true
              }
            }
          })
        }}>Remove</Button>
      </form>
    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(InstructionEditForm);
