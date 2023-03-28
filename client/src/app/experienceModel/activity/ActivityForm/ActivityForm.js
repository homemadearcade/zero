import React from 'react';
import { connect } from 'react-redux';
import { TextField } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import SelectActivityCategory from '../../../../ui/SelectActivityCategory/SelectActivityCategory';
import { GAME_ROOM_ACTIVITY } from '../../../../constants';
import Typography from '../../../../ui/Typography/Typography';
import ActivityGameRoomForm from '../ActivityGameRoomForm/ActivityGameRoomForm';

const ActivityForm = ({ control, register, setValue, trigger, isEdit }) => {
  const activityCategory = useWatch({
    control,
    name: "activityCategory",
  });

  return <>
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
    <br/>
    {!isEdit && <Controller
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
    />}
    <br/>
    {activityCategory === GAME_ROOM_ACTIVITY && <>
      <Typography variant="h6">Game Room</Typography>
      <ActivityGameRoomForm trigger={trigger} setValue={setValue} isEdit={isEdit} control={control} register={register}/>
    </>}
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { })(ActivityForm);
