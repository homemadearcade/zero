import React from 'react';
import { connect } from 'react-redux';
import { TextField } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import SelectActivityCategory from '../../../../ui/SelectActivityCategory/SelectActivityCategory';
import { GAME_ROOM_ACTIVITY, INSTRUCTION_GAME_ROOM } from '../../../../constants';
import Typography from '../../../../ui/Typography/Typography';
import { RoleChip } from '../../role/RoleChip/RoleChip';
import SelectInstructions from '../../../../ui/connected/SelectInstructions/SelectInstructions';
import GameCardLoad from '../../../gameModel/GameCardLoad/GameCardLoad';
import SelectGameRoom from '../../../../ui/connected/SelectGameRoom/SelectGameRoom';

const ActivityForm = ({ control, register, setValue, trigger, isEdit, experienceModel: { experienceModel } }) => {
  const activityCategory = useWatch({
    control,
    name: "activityCategory",
  });

  const gameId = useWatch({
    control,
    name: "gameRoom.gameId",
  });

  function renderGameRoomRoleInstructionSelect() {
    return <>
      <Typography variant="h6">Role Instructions</Typography>
      {Object.keys(experienceModel.roles).map((roleId) => {
        const role = experienceModel.roles[roleId]
        if(role.isRemoved && !role.isNotRemoveable) return null
        return <>
          <RoleChip role={role} />
          <Controller
            name={`instructionsByRoleId.${role.roleId}`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectInstructions instructionCategory={INSTRUCTION_GAME_ROOM} gameId={gameId} onSelect={(instructionIds) => {
                if(!instructionIds || instructionIds.length === 0) return onChange(null)
                onChange(instructionIds[instructionIds.length - 1])
              }} value={value ? [value] : []} />
            )}
          />
        </>}
      )}
    </>
  }

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
      {!isEdit && <Controller
        {...register("gameRoom.gameRoomId", {
          required: true
        })}
        name={"gameRoom.gameRoomId"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectGameRoom onSelect={(gameRoomIds) => {
            if(!gameRoomIds || gameRoomIds.length === 0) return onChange(null)
            const newGameRoomId = gameRoomIds[gameRoomIds.length - 1]
            onChange(newGameRoomId)
            setValue("gameRoom.gameId", experienceModel.gameRooms[newGameRoomId].gameId)
            trigger("gameRoom.gameRoomId")
            // setValue("gameRoom.gameMetadata", experienceModel.gameRooms[newGameRoomId].gameMetadata)
          }} value={value ? [value] : []} />
        )}
      />}
      {gameId && <GameCardLoad gameId={gameId} />}
      {isEdit && renderGameRoomRoleInstructionSelect()}
    </>}
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(ActivityForm);
