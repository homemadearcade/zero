import React from 'react';
import { connect } from 'react-redux';

import { Controller } from 'react-hook-form';
import SelectStepBehavior from '../../../../ui/SelectStepBehavior/SelectStepBehavior';

const StepForm = ({ isEdit, register, control, instructionCategory }) => {
  return <>
    {!isEdit && <Controller
      {...register("stepBehavior", {
        required: true
      })}
      name={"stepBehavior"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectStepBehavior instructionCategory={instructionCategory} onChange={(e) => {
          console.log(e, e.target.value)
          onChange(e.target.value)
        }} value={value ? [value] : []} label={"Behavior"} />
      )}
    />}
  </>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(StepForm);
