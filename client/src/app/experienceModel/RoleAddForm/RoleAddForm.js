import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../ui/Button/Button';
import Icon from '../../../ui/Icon/Icon';
import Dialog from '../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../utils';
import { ROLE_ID_PREFIX } from '../../../constants';

const RoleAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isRoleAddOpen, setIsRoleAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register } = useForm({
    defaultValues: {
      name: '',
      roleId: ROLE_ID_PREFIX + generateUniqueId(),
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsRoleAddOpen(false)
  }

  return (
    <div className="RoleAddForm">
      <Button onClick={() => {
        setIsRoleAddOpen(true)
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New Role</Button>
      <Dialog onClose={() => {
        setIsRoleAddOpen(false)
      }} open={isRoleAddOpen}>
        <DialogTitle>New Role</DialogTitle>
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add Role</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(RoleAddForm);
