import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import SelectRole from '../../../../ui/connected/SelectRole/SelectRole';
import TextField from '../../../../ui/TextField/TextField';
import { PROMPT_ID_PREFIX } from '../../../../constants/experience/prompt';
import './PromptAddForm.scss';

const PromptAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isPromptAddOpen, setIsPromptAddOpen] = useState(false)

  const { handleSubmit, reset, register, control, formState: { isValid }, setValue } = useForm({
    defaultValues: {
      name: '',
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsPromptAddOpen(false)
  }

  function renderPromptRoleSelect() {
    return <Controller
      {...register("roleId", {
        required: true,
      })}
      name={`roleId`}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectRole
        formLabel="For Role:"
        onSelect={(roleIds) => {
          if(!roleIds || roleIds.length === 0) return
          onChange(roleIds[roleIds.length - 1])
        }} value={value ? [value] : []} />
      )}
    />
  }

  return (
    <div className="PromptAddForm">
      <Button onClick={() => {
        setIsPromptAddOpen(true)
        setValue('promptId', PROMPT_ID_PREFIX + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} className="btn">New Prompt</Button>
      <Dialog onClose={() => {
        setIsPromptAddOpen(false)
      }} open={isPromptAddOpen}>
        <div className='PromptAddForm__dialog'>
        <DialogTitle>New Prompt</DialogTitle>
        <DialogContent>
          {renderPromptRoleSelect()}
           <Controller
            name={"text"}
            control={control}
            {...register("text", {
              required: true
            })}
            render={({ field: { onChange, value } }) => (
              <TextField multiline fullWidth minRows={4} onChange={onChange} value={value} label={"Prompt"} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add Prompt</Button>
        </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(PromptAddForm);
