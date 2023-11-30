import React from 'react';
import { connect } from 'react-redux';

import './LobbyEditForm.scss';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import { RoleChip } from '../../role/RoleChip/RoleChip';
import SelectInstructions from '../../../../ui/connected/SelectInstructions/SelectInstructions';
import { INSTRUCTION_LOBBY } from '../../../../constants';
import Typography from '../../../../ui/Typography/Typography';
import LobbyForm from '../LobbyForm/LobbyForm';
import SelectArcadeGame from '../../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import Divider from '../../../../ui/Divider/Divider';
import Switch from '../../../../ui/Switch/Switch';
import NestedList, { NestedListContainer } from '../../../../ui/NestedList/NestedList';

const LobbyEditForm = ({ editExperienceModel, lobbyId, experienceModel: { experienceModel, isSaving }, onSubmit, auth: { me }}) => {
  const lobby = experienceModel.lobbys[lobbyId]

  const { name, instructionsByRoleId, usersMustWaitInLine, introArcadeGameMongoId } = lobby

  const { handleSubmit, register, control, trigger } = useForm({
    defaultValues: {
      name,
      instructionsByRoleId,
      usersMustWaitInLine,
      introArcadeGameMongoId
    },
  });

  const submit = async (data) => {
    editExperienceModel(experienceModel.id, {
      lobbys: {
        [lobbyId]: {
          ...data
        }
      }
    })
    // reset();
    if(onSubmit) onSubmit()
  }

  function introGameSelect() {
    return <Controller
      {...register("introArcadeGameMongoId", {
        // required: true,
        // shouldUnregister: true,
      })}
      name={"introArcadeGameMongoId"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectArcadeGame label="Intro Arcade Game" userMongoId={me.id} gamesSelected={value ? [value] : []} onSelect={(games) => {
          if(games[0]) {
            const game = games[games.length - 1]
            onChange(game.id)
            // // setValue("gameMetadata", game.metadata)
            // setValue("name", game.metadata.title)
            // trigger("arcadeGameMongoId")
          } else {
            onChange(null)
          }
        }}/>
      )}
    />
  }

  return (
    <div className="LobbyEditForm">
      <form>
        <div>
          <LobbyForm control={control} register={register} />
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
                  <SelectInstructions instructionCategory={INSTRUCTION_LOBBY}  onSelect={(instructionIds) => {
                    if(!instructionIds || instructionIds.length === 0) return onChange(null)
                    onChange(instructionIds[instructionIds.length - 1])
                  }} value={value ? [value] : []} />
                )}
              />
            </>
          })}
        <Divider/>
        <NestedListContainer>
          <NestedList title="Advanced" interfaceId="AdvancedLobby">
          {introGameSelect()}
          <Divider/>
          <Controller
            {...register("usersMustWaitInLine", {
              // shouldUnregister: true,
            })}
            name={"usersMustWaitInLine"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch
                labels={['', `This Lobby has a line to get in`]}
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
        </div>
        <br/>
        <Button disabled={isSaving} type="submit" onClick={handleSubmit(submit)}>Save</Button>
        <Button disabled={lobby.isNotRemoveable} onClick={() => {
          editExperienceModel(experienceModel.id, {
            lobbys: {
              [lobbyId]: {
                isRemoved: true
              }
            }
          })
        }}>Remove</Button>
      </form>

    </div>
  )
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(LobbyEditForm);
