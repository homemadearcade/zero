import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import { ACTIVITY_ID_PREFIX } from '../../../../constants';
import ActivityForm from '../ActivityForm/ActivityForm';

const ActivityAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isActivityAddOpen, setIsActivityAddOpen] = useState(false)

  const { handleSubmit, reset, trigger, control, formState: { isValid }, register, setValue } = useForm({
    defaultValues: {
      name: '',
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsActivityAddOpen(false)
  }
  return (
    <div className="ActivityAddForm">
      <Button onClick={() => {
        setIsActivityAddOpen(true)
        setValue('activityId', ACTIVITY_ID_PREFIX + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New Activity</Button>
      <Dialog onClose={() => {
        setIsActivityAddOpen(false)
      }} open={isActivityAddOpen}>
        <DialogTitle>New Activity</DialogTitle>
        <DialogContent>
          <ActivityForm trigger={trigger} setValue={setValue} control={control} register={register} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add Activity</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { })(ActivityAddForm);
