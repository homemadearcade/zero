import React, { useState } from 'react';
import { connect } from 'react-redux';

import { addExperienceModel } from '../../../../store/actions/experience/experienceModelActions';

import './ExperienceAddForm.scss';
import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import SelectUsers from '../../../../ui/connected/SelectUsers/SelectUsers';

const ExperienceAddForm = ({ addExperienceModel, onSubmit, auth: { me }, defaultValues = {} }) => {
  const [isExperienceAddOpen, setIsExperienceAddOpen] = useState(false)

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      lobbys: {},
      activitys: {},
      instructions: {},
      roles: {},
      gameRooms: {},
      canvasRooms: {},
      metadata: {},
      userMongoId: me.id,
      ...defaultValues
    },
  });

  const submit = async (data) => {
    const experienceModelResponse = await addExperienceModel(data);
    const experienceModel = experienceModelResponse.data.experienceModel
    reset();
    if(onSubmit) onSubmit(experienceModel)
    setIsExperienceAddOpen(false)
  }

  return (
    <div className="ExperienceAddForm">
      <Button onClick={() => {
        setIsExperienceAddOpen(true)
      }} startIcon={<Icon icon="faPlus"/>} className="btn">New Experience</Button>
      <Dialog onClose={() => {
        setIsExperienceAddOpen(false)
      }} open={isExperienceAddOpen}>
        <DialogTitle>New Experience</DialogTitle>
        <DialogContent>
          <Controller
            name={"metadata.title"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Title"} />
            )}
          />
          <br/>
          <Controller
            name={"userMongoId"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectUsers onSelect={(users) => {
                onChange(users[users.length-1])
              }} usersSelected={value ? [value] : []} label={"User ( experience owner )"} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit(submit)}>Add Experience</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addExperienceModel })(ExperienceAddForm);
