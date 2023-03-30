import React, { useState } from 'react';
import { connect } from 'react-redux';

import './RoleEditForm.scss';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import RoleForm from '../RoleForm/RoleForm';

const RoleEditForm = ({ editExperienceModel, roleId, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const role = experienceModel.roles[roleId]

  const { name, color } = role

  const { handleSubmit, register, control } = useForm({
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
    if(onSubmit) onSubmit()
  }

  return (
    <div className="RoleEditForm">
      <form>
        <RoleForm isEdit control={control} register={register} />
        <br/>
        <Button disabled={isSaving} type="submit" onClick={handleSubmit(submit)}>Save</Button>
        <Button disabled={role.isNotRemoveable} onClick={() => {
          editExperienceModel(experienceModel.id, {
            roles: {
              [roleId]: {
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

export default connect(mapStateToProps, { editExperienceModel })(RoleEditForm);
