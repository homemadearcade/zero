import React, { useState } from 'react';
import { connect } from 'react-redux';

import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import SelectInstructionCategory from '../../../../ui/SelectInstructionCategory/SelectInstructionCategory';

const InstructionForm = ({ isEdit, register, control }) => {
  return <>
    <Controller
      name={"name"}
      control={control}
      {...register("name", {
        required: true
      })}
      render={({ field: { onChange, value } }) => (
        <TextField onChange={onChange} value={value} label={"Name"} />
      )}
    />
    <br/>
    {!isEdit && <Controller
      {...register("instructionCategory", {
        required: true
      })}
      name={"instructionCategory"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectInstructionCategory onChange={(e) => {
          onChange(e.target.value)
        }} value={value ? [value] : []} label={"Category"} />
      )}
    />}
  </>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(InstructionForm);
