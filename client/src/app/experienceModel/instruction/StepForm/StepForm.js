import React from 'react';
import { connect } from 'react-redux';

import { Controller } from 'react-hook-form';
import SelectStepBehavior from '../../../../ui/SelectStepBehavior/SelectStepBehavior';

const StepForm = ({ isEdit, register, control, instructionCategory }) => {
  return <>
    {!isEdit && <Controller
      {...register("stepCategory", {
        required: true
      })}
      name={"stepCategory"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectStepBehavior instructionCategory={instructionCategory} onChange={(e) => {
          onChange(e.target.value)
        }} value={value ? [value] : []} label={"Category"} />
      )}
    />}
  </>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(StepForm);
