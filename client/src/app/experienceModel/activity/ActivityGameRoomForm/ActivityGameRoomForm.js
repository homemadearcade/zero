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
import GameAddForm from '../../../gameModel/GameAddForm/GameAddForm';

const ActivityGameRoomForm = ({ isEdit, setValue, register, control, trigger, auth: { me }, experienceModel: { experienceModel }}) => {
  const copyGame = useWatch({
    control,
    name: "gameRoom.copyGame",
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
    if(!isEdit) return <Controller
      {...register("gameRoom.gameId", {
        required: true,
        // shouldUnregister: true,
      })}
      name={"gameRoom.gameId"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectArcadeGame disabled={isEdit} label="My Games" userId={me.id} gamesSelected={value ? [value] : []} onSelect={(games) => {
          if(games[0]) {
            const game = games[games.length - 1]
            onChange(game.id)
            setValue("gameRoom.gameMetadata", game.metadata)
            trigger("gameRoom.gameId")
          }
        }}/>
      )}
    />
  }

  function renderCopyGame() {
    if(isEdit) {
      if(copyGame) return <div>Makes a new copy of the game for each experience session</div>
      return
    }
    return <Controller
      {...register("gameRoom.copyGame", {
        // shouldUnregister: true,
      })}
      name={"gameRoom.copyGame"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Switch
          disabled={isEdit}
          labels={['', 'Make a new copy of the game for each experience session']}
          size="small"
          checked={value}
          onChange={(e) => {
            if(e.target.checked) {
              setValue("gameRoom.isAutosaveDisabled", false)
            } else {
              setValue("gameRoom.isAutosaveDisabled", true)
            }
            onChange(e.target.checked)
          }}
        />
      )}
    />
  }

  return <>
    {renderGameSelect()}
    {!isEdit && <GameAddForm onSubmit={(game) => {
      setValue("gameRoom.gameId", game.id)
      setValue("gameRoom.gameMetadata", game.metadata)
      trigger("gameRoom.gameId")
    }} defaultValues={{userId: me.id}}></GameAddForm>}
    {gameId && <GameCardLoad gameId={gameId} />}
    {renderCopyGame()}
    {isEdit && <Controller
      {...register("gameRoom.isAutosaveDisabled", {
        // shouldUnregister: true,
      })}
      name={"gameRoom.isAutosaveDisabled"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Switch
          labels={['', `Permanently save changes to the ${copyGame ?  'Game Copy' : 'Game'} from the experience session`]}
          size="small"
          checked={!value}
          onChange={(e) => {
            onChange(!e.target.checked)
          }}
        />
      )}
    />}
   {isEdit && renderRoleSelect()}
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(ActivityGameRoomForm);
