import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import { ROLE_ID_PREFIX } from '../../../../constants';
import RoleForm from '../RoleForm/RoleForm';

const RoleAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isRoleAddOpen, setIsRoleAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register, setValue } = useForm({
    defaultValues: {
      name: '',
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
        setValue('roleId', ROLE_ID_PREFIX + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New Role</Button>
      <Dialog onClose={() => {
        setIsRoleAddOpen(false)
      }} open={isRoleAddOpen}>
        <DialogTitle>New Role</DialogTitle>
        <DialogContent>
          <RoleForm control={control} register={register} />
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
