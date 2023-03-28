import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import { INSTRUCTION_ID_PREFIX } from '../../../../constants';
import InstructionForm from '../InstructionForm/InstructionForm';

const InstructionAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isInstructionAddOpen, setIsInstructionAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register, setValue } = useForm({
    defaultValues: {
      name: '',
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsInstructionAddOpen(false)
  }

  return (
    <div className="InstructionAddForm">
      <Button onClick={() => {
        setIsInstructionAddOpen(true)
        setValue('instructionId', INSTRUCTION_ID_PREFIX + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New Instruction</Button>
      <Dialog onClose={() => {
        setIsInstructionAddOpen(false)
      }} open={isInstructionAddOpen}>
        <DialogTitle>New Instruction</DialogTitle>
        <DialogContent>
          <InstructionForm control={control} register={register} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add Instruction</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(InstructionAddForm);
