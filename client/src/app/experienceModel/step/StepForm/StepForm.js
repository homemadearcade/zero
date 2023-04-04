import React from 'react';
import { connect } from 'react-redux';

import { Controller, useWatch } from 'react-hook-form';
import SelectStepBehavior from '../../../../ui/SelectStepBehavior/SelectStepBehavior';
import SelectRole from '../../../../ui/connected/SelectRole/SelectRole';
import { STEP_EFFECT } from '../../../../constants';

const StepForm = ({ isEdit, register, control, instructionCategory }) => {
  const stepBehavior = useWatch({
    control,
    name: "stepBehavior",
  });

  function renderActionRoleSelect() {
    return <Controller
      {...register("actionRoleId", {
        required: true,
      })}
      name={`actionRoleId`}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectRole 
        formLabel="For Which Roles?"
        onSelect={(roleIds) => {
          if(!roleIds || roleIds.length === 0) return
          onChange(roleIds[roleIds.length - 1])
        }} value={value ? [value] : []} />
      )}
    />
  }

  return <>
    {!isEdit && <Controller
      {...register("stepBehavior", {
        required: true
      })}
      name={"stepBehavior"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectStepBehavior instructionCategory={instructionCategory} onChange={(e) => {
          onChange(e.target.value)
        }} value={value ? [value] : []} label={"Behavior"} />
      )}
    />}
    {!isEdit && stepBehavior && stepBehavior !== STEP_EFFECT && renderActionRoleSelect()}
  </>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(StepForm);
