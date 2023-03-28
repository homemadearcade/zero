import React, { useState } from 'react';
import { connect } from 'react-redux';

import './RoleForm.scss';
import { TextField } from '@mui/material';
import { editExperienceModel } from '../../../store/actions/experienceModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../ui/Button/Button';
import FormLabel from '../../../ui/FormLabel/FormLabel';

const RoleForm = ({ editExperienceModel, roleId, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const role = experienceModel.roles[roleId]

  const { name, color } = role

  const { handleSubmit, reset, register, control } = useForm({
    defaultValues: {
      name,
      color
    },
  });

  const submit = async (data) => {
    editExperienceModel(experienceModel.id, {
      roles: {
        [roleId]: {
          ...data
        }
      }
    })
    // reset();
    if(onSubmit) onSubmit()
  }

  return (
    <div className="RoleForm">
      <form>
        <div>
          <Controller
            name={"name"}
            {...register(`name`, {
                  required: true
            })}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Name"} />
            )}
          />          
          <Controller
            name={"color"}
            control={control}
            {...register("color", {
              required: true
            })}
            render={({ field: { onChange, value } }) => {
            return <>
              <FormLabel htmlFor="color">Color</FormLabel>
              <input type="color" onChange={onChange} value={value} />
            </>}}
          />
        </div>
        <Button disabled={isSaving} type="submit" onClick={handleSubmit(submit)}>Save</Button>
      </form>

    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(RoleForm);
