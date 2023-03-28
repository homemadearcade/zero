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

const ActivityAddForm = ({ onSubmit, defaultValues = {}, auth: { me }}) => {
  const [isActivityAddOpen, setIsActivityAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register, getValues } = useForm({
    defaultValues: {
      name: '',
      activityId: ACTIVITY_ID_PREFIX + generateUniqueId(),
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
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New Activity</Button>
      <Dialog onClose={() => {
        setIsActivityAddOpen(false)
      }} open={isActivityAddOpen}>
        <DialogTitle>New Activity</DialogTitle>
        <DialogContent>
          <form>
            <ActivityForm control={control} register={register} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add Activity</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { })(ActivityAddForm);
