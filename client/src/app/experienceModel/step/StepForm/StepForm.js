import React from 'react';
import { connect } from 'react-redux';

import { Controller } from 'react-hook-form';
import SelectExperienceEffect from '../../../../ui/connected/SelectExperienceEffect/SelectExperienceEffect';

const StepForm = ({ isEdit, register, control, instruction, step }) => {
  return <>
    {!isEdit && <Controller
      {...register("experienceEffectIds", {
        required: true
      })}
      name={"experienceEffectIds"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectExperienceEffect 
          instructionCategory={instruction.instructionCategory}
          arcadeGameMongoId={instruction.arcadeGameMongoId}
          formLabel="What changes occur when this step is loaded?" onChange={(experienceEffectIds) => {
          onChange(experienceEffectIds)
        }} value={value ? value : []} />
      )}
    />}
  </>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(StepForm);
