import React from 'react';
import { connect } from 'react-redux';
import { Controller, useWatch } from 'react-hook-form';
import SelectArcadeGame from '../../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import Switch from '../../../../ui/Switch/Switch';
import Typography from '../../../../ui/Typography/Typography';
import GameCardLoad from '../../../gameModel/GameCardLoad/GameCardLoad';
import SelectInstructions from '../../../../ui/connected/SelectInstructions/SelectInstructions';
import { INSTRUCTION_GAME_ROOM } from '../../../../constants';
import { RoleChip } from '../../role/RoleChip/RoleChip';
import SelectRole from '../../../../ui/connected/SelectRole/SelectRole';

const ActivityGameRoomForm = ({ isEdit, register, control, auth: { me }, experienceModel: { experienceModel }}) => {
  const createNewGame = useWatch({
    control,
    name: "gameRoom.createNewGame",
  });

  const gameId = useWatch({
    control,
    name: "gameRoom.gameId",
  });

  function renderRoleSelect() {
    return <>
      <Controller
        {...register("gameRoom.hostRoleId", {
          required: true,
        })}
        name={`gameRoom.hostRoleId`}
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectRole 
          formLabel="Game Host Role"
          onSelect={(roleIds) => {
            if(!roleIds || roleIds.length === 0) return
            onChange(roleIds[roleIds.length - 1])
          }} value={value ? [value] : []} />
        )}
      />
      <br/>
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

  function renderGameSelect() {
    if(!createNewGame && !isEdit) return <Controller
      {...register("gameRoom.gameId", {
        required: true,
        // shouldUnregister: true,
      })}
      name={"gameRoom.gameId"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectArcadeGame disabled={isEdit} label="My Games" userId={me.id} gamesSelected={value ? [value] : []} onSelect={(games) => {
          if(games[0]) {
            onChange(games[games.length - 1])
          }
        }}/>
      )}
    />
  }

  return <>
    <Controller
      {...register("gameRoom.createNewGame", {
        // shouldUnregister: true,
      })}
      name={"gameRoom.createNewGame"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Switch
          disabled={isEdit}
          labels={['Choose Existing Game', 'Create New Game Each Time']}
          size="small"
          checked={value}
          onChange={(e) => {
            onChange(e.target.checked)
          }}
        />
      )}
    />
    {renderGameSelect()}
    {gameId && !createNewGame && <GameCardLoad gameId={gameId} />}
    <Controller
      {...register("gameRoom.isAutosaveDisabled", {
        // shouldUnregister: true,
      })}
      name={"gameRoom.isAutosaveDisabled"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Switch
          labels={['Do not save', 'Autosave']}
          size="small"
          checked={!value}
          onChange={(e) => {
            onChange(e.target.checked)
          }}
        />
      )}
    />
   {isEdit && renderRoleSelect()}
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(ActivityGameRoomForm);
