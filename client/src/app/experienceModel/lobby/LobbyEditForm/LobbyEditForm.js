import React, { useState } from 'react';
import { connect } from 'react-redux';

import './LobbyEditForm.scss';
import { TextField } from '@mui/material';
import { editExperienceModel } from '../../../../store/actions/experienceModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import { RoleChip } from '../../role/RoleChip/RoleChip';
import SelectInstructions from '../../../../ui/connected/SelectInstructions/SelectInstructions';
import { INSTRUCTION_LOBBY } from '../../../../constants';
import Typography from '../../../../ui/Typography/Typography';
import LobbyForm from '../LobbyForm/LobbyForm';

const LobbyEditForm = ({ editExperienceModel, lobbyId, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const lobby = experienceModel.lobbys[lobbyId]

  const { name, instructionsByRoleId } = lobby

  const { handleSubmit, reset, register, control } = useForm({
    defaultValues: {
      name,
      instructionsByRoleId
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
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(LobbyEditForm);
