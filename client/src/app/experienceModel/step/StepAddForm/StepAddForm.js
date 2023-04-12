import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import { STEP_DID } from '../../../../constants';
import StepForm from '../StepForm/StepForm';
import './StepAddForm.scss'

const StepAddForm = ({ onSubmit, instruction, defaultValues = {}}) => {
  const [isStepAddOpen, setIsStepAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
      effectIds: [],
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
        setValue('stepId', STEP_DID + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} className="btn">New Step</Button>
      <Dialog onClose={() => {
        setIsStepAddOpen(false)
      }} open={isStepAddOpen}>
        <DialogTitle>New Step</DialogTitle>
          <DialogContent>
             <div className="StepAddForm__dialog">
              <StepForm instruction={instruction} control={control} register={register} />
            </div>
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
