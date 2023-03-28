import React from 'react';
import { connect } from 'react-redux';

import { TextField } from '@mui/material';
import { editExperienceModel } from '../../../../store/actions/experienceModelActions';
import { Controller } from 'react-hook-form';
import FormLabel from '../../../../ui/FormLabel/FormLabel';
import SelectRoleCategory from '../../../../ui/SelectRoleCategory/SelectRoleCategory';

const RoleForm = ({ register, control, isEdit }) => {
  return <>
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
        // required: true
      })}
      render={({ field: { onChange, value } }) => {
      return <>
        <FormLabel htmlFor="color">Color</FormLabel>
        <input type="color" onChange={onChange} value={value} />
      </>}}
    />
    <br/>
    {!isEdit && <Controller
      {...register("roleCategory", {
        required: true
      })}
      name={"roleCategory"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectRoleCategory onChange={(e) => {
          onChange(e.target.value)
        }} value={value ? [value] : []} label={"Category"} />
      )}
    />}
  </>
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(RoleForm);
