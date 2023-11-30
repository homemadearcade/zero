import React from 'react';
import { connect } from 'react-redux';
import { Controller, useWatch } from 'react-hook-form';
import SelectArcadeGame from '../../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import Switch from '../../../../ui/Switch/Switch';
import GameCardLoad from '../../../gameModel/GameCardLoad/GameCardLoad';
import SelectRole from '../../../../ui/connected/SelectRole/SelectRole';
import GameAddForm from '../../../gameModel/GameAddForm/GameAddForm';
import NestedList, { NestedListContainer } from '../../../../ui/NestedList/NestedList';

const GameRoomForm = ({ isEdit, setValue, register, control, trigger, auth: { me }, experienceModel: { experienceModel }}) => {
  const doNotCopy = useWatch({
    control,
    name: "doNotCopy",
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

  function renderDoNotCopy() {
    return <>
      <Controller
        {...register("doNotCopy", {
          // shouldUnregister: true,
        })}
        name={"doNotCopy"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Switch
            labels={['', 'Do not make a copy of this game each time the experience runs']}
            size="small"
            checked={value}
            onChange={(e) => {      
              onChange(e.target.checked)
            }}
          />
        )}
      />
    </>
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
    {isEdit && renderHostRoleSelect()}
    <NestedListContainer>
      <NestedList title="Advanced" interfaceId="AdvancedGameRoom">
        {renderDoNotCopy()}
        <Controller
          {...register("isAutosaveDisabled", {
            // shouldUnregister: true,
          })}
          name={"isAutosaveDisabled"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              labels={['', `Disable autosave`]}
              size="small"
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked)
              }}
            />
          )}
        />
      </NestedList>
    </NestedListContainer>
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(GameRoomForm);
