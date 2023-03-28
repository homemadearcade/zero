import React, { useState } from 'react';
import { connect } from 'react-redux';

import { editExperienceModel } from '../../../../store/actions/experienceModelActions';
import { useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import ActivityForm from '../ActivityForm/ActivityForm';

const ActivityEditForm = ({ editExperienceModel, activityId, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const activity = experienceModel.activitys[activityId]
  
  const { handleSubmit, trigger, setValue, control, formState: { isValid }, register } = useForm({
    defaultValues: activity
  });

  const submit = async (data) => {
    editExperienceModel(experienceModel.id, {
      activitys: {
        [activityId]: {
          ...data
        }
      }
    })
    if(onSubmit) onSubmit()
  }

  return (
    <div className="ActivityEditForm">
      <form>
        <ActivityForm trigger={trigger} setValue={setValue} isEdit control={control} register={register} />
        <br/>
        <Button disabled={isSaving || !isValid} type="submit" onClick={handleSubmit(submit)}>Save</Button>
        <Button disabled={activity.isNotRemoveable} onClick={() => {
          editExperienceModel(experienceModel.id, {
            activitys: {
              [activityId]: {
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

export default connect(mapStateToProps, { editExperienceModel })(ActivityEditForm);
