/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperienceCreatorBody.scss';
import { getIdInformation } from '../../../utils';
import ExperienceMetadataForm from '../ExperienceMetadataForm/ExperienceMetadataForm';
import { Icon, Paper } from '@mui/material';
import { activityToInterfaceData } from '../../../constants';

const ExperienceCreatorBody = ({
  experienceModel: { experienceModel },
  idEditing,
}) => {
  if(!idEditing) return null

  const { isActivityId, isLobbyId, isRoleId, isInstructionId } = getIdInformation(idEditing)

  function renderBody() {
    if(isActivityId) {
      const activity = experienceModel.activities[idEditing]
      const activityInterfaceData = activityToInterfaceData[activity.activityCategory]
      return <div>
        <div className="ExperienceCreatorBody__title">
          <Icon icon={activityInterfaceData.icon}/>
          {activity.name}
        </div>
      </div>
    }

    if(isLobbyId) {
      return <div>
        Lobby
      </div>
    }

    if(isRoleId) {
      return <div>
        Role
      </div>
    }

    if(isInstructionId) {
      return <div>
        Instruction
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
