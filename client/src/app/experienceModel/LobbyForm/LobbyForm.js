import React, { useState } from 'react';
import { connect } from 'react-redux';

import './LobbyForm.scss';
import { TextField } from '@mui/material';
import { editExperienceModel } from '../../../store/actions/experienceModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../ui/Button/Button';
import { RoleChip } from '../RoleChip/RoleChip';
import SelectInstructions from '../../../ui/connected/SelectInstructions/SelectInstructions';
import { INSTRUCTION_LOBBY } from '../../../constants';
import Typography from '../../../ui/Typography/Typography';

const LobbyForm = ({ editExperienceModel, lobbyId, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const lobby = experienceModel.lobbys[lobbyId]

  const { name, roleInstructionByRoleId } = lobby

  const { handleSubmit, reset, register, control } = useForm({
    defaultValues: {
      name,
      roleInstructionByRoleId
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
    <div className="LobbyForm">
      <form>
        <div>
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
          <Typography variant="h6">Role Instructions</Typography>
          {Object.keys(experienceModel.roles).map((roleId) => {
            const role = experienceModel.roles[roleId]
            return <>
              <RoleChip role={role} />
              <Controller
                name={`roleInstructionByRoleId.${role.roleId}`}
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
        <Button disabled={isSaving} type="submit" onClick={handleSubmit(submit)}>Save</Button>
      </form>

    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(LobbyForm);
