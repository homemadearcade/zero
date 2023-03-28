import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import { ROLE_ID_PREFIX } from '../../../../constants';
import FormLabel from '../../../../ui/FormLabel/FormLabel';

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
          <Controller
            name={"color"}
            control={control}
            {...register("color", {
              required: true
            })}
            render={({ field: { onChange, value } }) => {
            return <>
              <FormLabel htmlFor="color">Color</FormLabel>
              <input type="color" onChange={onChange} value={value} />
            </>}}
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
