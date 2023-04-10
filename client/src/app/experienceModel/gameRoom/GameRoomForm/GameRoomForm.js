import React from 'react';
import { connect } from 'react-redux';
import { Controller, useWatch } from 'react-hook-form';
import SelectArcadeGame from '../../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import Switch from '../../../../ui/Switch/Switch';
import GameCardLoad from '../../../gameModel/GameCardLoad/GameCardLoad';
import SelectRole from '../../../../ui/connected/SelectRole/SelectRole';
import GameAddForm from '../../../gameModel/GameAddForm/GameAddForm';

const GameRoomForm = ({ isEdit, setValue, register, control, trigger, auth: { me }, experienceModel: { experienceModel }}) => {
  const copyGame = useWatch({
    control,
    name: "copyGame",
  });

  const arcadeGameMongoId = useWatch({
    control,
    name: "arcadeGameMongoId",
  });

  function renderGameSelect() {
    if(!isEdit) return <Controller
      {...register("arcadeGameMongoId", {
        required: true,
        // shouldUnregister: true,
      })}
      name={"arcadeGameMongoId"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectArcadeGame label="My Games" userMongoId={me.id} gamesSelected={value ? [value] : []} onSelect={(games) => {
          if(games[0]) {
            const game = games[games.length - 1]
            onChange(game.id)
            // setValue("gameMetadata", game.metadata)
            setValue("name", game.metadata.title)
            trigger("arcadeGameMongoId")
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
      setValue("arcadeGameMongoId", game.id)
      // setValue("gameMetadata", game.metadata)
      setValue("name", game.metadata.title)
      trigger("arcadeGameMongoId")
    }} defaultValues={{userMongoId: me.id}}></GameAddForm>}
    {arcadeGameMongoId && <GameCardLoad canEdit canPlay arcadeGameMongoId={arcadeGameMongoId} />}
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
