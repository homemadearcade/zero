import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../ui/Button/Button';
import Icon from '../../../ui/Icon/Icon';
import Dialog from '../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import SelectActivityCategory from '../../../ui/SelectActivityCategory/SelectActivityCategory';
import { generateUniqueId } from '../../../utils';
import { ACTIVITY_ID_PREFIX } from '../../../constants';

const ActivityAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isActivityAddOpen, setIsActivityAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register } = useForm({
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
          <br></br><br/>
          <Controller
            {...register("activityCategory", {
              required: true
            })}
            name={"activityCategory"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectActivityCategory onChange={(e) => {
                onChange(e.target.value)
              }} value={value ? [value] : []} label={"Category"} />
            )}
          />
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

});

export default connect(mapStateToProps, { })(ActivityAddForm);
