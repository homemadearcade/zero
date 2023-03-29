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

const GameRoomForm = ({ isEdit, setValue, register, control, trigger, auth: { me }, experienceModel: { experienceModel }}) => {
  const copyGame = useWatch({
    control,
    name: "copyGame",
  });

  const gameId = useWatch({
    control,
    name: "gameId",
  });

  function renderGameSelect() {
    if(!isEdit) return <Controller
      {...register("gameId", {
        required: true,
        // shouldUnregister: true,
      })}
      name={"gameId"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectArcadeGame disabled={isEdit} label="My Games" userId={me.id} gamesSelected={value ? [value] : []} onSelect={(games) => {
          if(games[0]) {
            const game = games[games.length - 1]
            onChange(game.id)
            setValue("gameMetadata", game.metadata)
            setValue("name", game.metadata.title)
            trigger("gameId")
          }
        }}/>
      )}
    />
  }

  function renderHostRoleSelect() {
    return <Controller
      {...register("hostRoleId", {
        required: true,
      })}
      name={`hostRoleId`}
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
  }

  function renderCopyGame() {
    if(isEdit) {
      if(copyGame) return <div>Makes a new copy of the game for each experience session</div>
      return
    }
    return <Controller
      {...register("copyGame", {
        // shouldUnregister: true,
      })}
      name={"copyGame"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Switch
          disabled={isEdit}
          labels={['', 'Make a new copy of the game for each experience session']}
          size="small"
          checked={value}
          onChange={(e) => {
            if(e.target.checked) {
              setValue("isAutosaveDisabled", false)
            } else {
              setValue("isAutosaveDisabled", true)
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
      setValue("gameId", game.id)
      setValue("gameMetadata", game.metadata)
      trigger("gameId")
    }} defaultValues={{userId: me.id}}></GameAddForm>}
    {gameId && <GameCardLoad gameId={gameId} />}
    {renderCopyGame()}
    {isEdit && <Controller
      {...register("isAutosaveDisabled", {
        // shouldUnregister: true,
      })}
      name={"isAutosaveDisabled"}
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
    {isEdit && renderHostRoleSelect()}
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(GameRoomForm);
