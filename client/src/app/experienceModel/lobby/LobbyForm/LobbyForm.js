import React from 'react';
import { connect } from 'react-redux';

import './LobbyForm.scss';
import { TextField } from '@mui/material';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { Controller } from 'react-hook-form';

const LobbyForm = ({register, control }) => {

  return <>
    <Controller
      name={"name"}
      {...register(`name`, {
        required: true
      })}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField onChange={onChange} value={value} label={"Name"} />
      )}
    />
  </>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { editExperienceModel })(LobbyForm);
