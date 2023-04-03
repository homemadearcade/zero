import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import { STEP_ID_PREFIX } from '../../../../constants';
import StepForm from '../StepForm/StepForm';

const StepAddForm = ({ onSubmit, instructionCategory, defaultValues = {}}) => {
  const [isStepAddOpen, setIsStepAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register, setValue } = useForm({
    defaultValues: {
      name: '',
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsStepAddOpen(false)
  }

  return (
    <div className="StepAddForm">
      <Button onClick={() => {
        setIsStepAddOpen(true)
        setValue('stepId', STEP_ID_PREFIX + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} size="wide" className="btn">New Step</Button>
      <Dialog onClose={() => {
        setIsStepAddOpen(false)
      }} open={isStepAddOpen}>
        <DialogTitle>New Step</DialogTitle>
        <DialogContent>
          <StepForm instructionCategory={instructionCategory} control={control} register={register} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add Step</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(StepAddForm);
