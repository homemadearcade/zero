/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperienceCreatorBody.scss';
import { getIdInformation } from '../../../../utils';
import ExperienceMetadataForm from '../ExperienceMetadataForm/ExperienceMetadataForm';
import { activityToInterfaceData, instructionToInterfaceData } from '../../../../constants';
import Icon from '../../../../ui/Icon/Icon';
import LobbyEditForm from '../../lobby/LobbyEditForm/LobbyEditForm';
import { RoleChip } from '../../role/RoleChip/RoleChip';
import RoleEditForm from '../../role/RoleEditForm/RoleEditForm';
import InstructionEditForm from '../../instruction/InstructionEditForm/InstructionEditForm';
import ActivityEditForm from '../../activity/ActivityEditForm/ActivityEditForm';

const ExperienceCreatorBody = ({
  experienceModel: { experienceModel },
  idEditing,
}) => {
  if(!idEditing) return null

  const { isActivityId, isLobbyId, isRoleId, isInstructionId } = getIdInformation(idEditing)

  function renderBody() {
    if(isActivityId) {
      const activity = experienceModel.activitys[idEditing]
      const activityInterfaceData = activityToInterfaceData[activity.activityCategory]
      return <div>
        <div className="ExperienceCreatorBody__title">
          <div className="ExperienceCreatorBody__title-icon"><Icon icon={activityInterfaceData.icon}/></div>
          {activity.name}
        </div>
       <ActivityEditForm activityId={idEditing}/>
      </div>
    }

    if(isLobbyId) {
      const lobby = experienceModel.lobbys[idEditing]
       return <div>
        <div className="ExperienceCreatorBody__title">
          <div className="ExperienceCreatorBody__title-icon"><Icon icon="faDoorOpen"/></div>
          {lobby.name}
        </div>
        <LobbyEditForm lobbyId={idEditing} />
      </div>
    }

    if(isRoleId) {
      const role = experienceModel.roles[idEditing]
       return <div>
        <div className="ExperienceCreatorBody__title">
          <RoleChip role={role}/>
        </div>
        <RoleEditForm roleId={role.roleId}/>
      </div>
    }

    if(isInstructionId) {
      const instruction = experienceModel.instructions[idEditing]
      const instructionInterfaceData = instructionToInterfaceData[instruction.instructionCategory]
      return <div>
        <div className="ExperienceCreatorBody__title">
          <div className="ExperienceCreatorBody__title-icon"><Icon icon={instructionInterfaceData.icon}/></div>
          {instruction.name}
        </div>
        <InstructionEditForm instructionId={idEditing}/>
      </div>
    }

    return <div>
      <ExperienceMetadataForm/>
    </div>
  }


  return (
    <div className="ExperienceCreatorBody">
     {renderBody()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default compose(
  connect(mapStateToProps, { }),
)(ExperienceCreatorBody);
