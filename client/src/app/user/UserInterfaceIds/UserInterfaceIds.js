/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { editUser, getUserByUsername } from '../../../store/actions/user/userActions';

import requireAuth from '../../../hoc/requireAuth';

import UnlockableInterfaceTree from '../../../ui/connected/UnlockableInterfaceTree/UnlockableInterfaceTree';
import { Divider } from '@mui/material';
import SelectExperienceModel from '../../../ui/connected/SelectExperienceModel/SelectExperienceModel';
import { getExperienceModelByMongoId } from '../../../store/actions/experience/experienceModelActions';
import Typography from '../../../ui/Typography/Typography';
import './UserInterfaceIds.scss'

const UserInterfaceIds = ({
  user: { user },
  appSettings: { appSettings },
  experienceModel: { experienceModel },
  getExperienceModelByMongoId,
}) => {

  const editorExperienceModelMongoId = user.editorExperienceModelMongoId || appSettings.editorExperienceModelMongoId

  return (
    <div className='UserInterfaceIds'>
      <SelectExperienceModel label="Select the Experience you want to view this user's Interface for" value={experienceModel?.id ? [experienceModel.id] : []} onSelect={(experienceModels) => {
        if(experienceModels[0]) {
          const id = experienceModels[experienceModels.length -1].id
          getExperienceModelByMongoId(id)
        }
      }}/>
      {user.id && experienceModel?.id && <UnlockableInterfaceTree experienceModelMongoId={experienceModel.id} userMongoId={user.id}></UnlockableInterfaceTree>}

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Default Interface</Typography>
      <SelectExperienceModel label="Select the experience that will be used for the default interface (when not in an experience)" value={editorExperienceModelMongoId ? [editorExperienceModelMongoId] : []} onSelect={(experienceModels) => {
        if(experienceModels[0]) {
          const id = experienceModels[experienceModels.length -1].id
          editUser(user.id, { editorExperienceModelMongoId: id })
        }
      }}/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  experienceModel: state.experienceModel,
  appSettings: state.appSettings,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getUserByUsername, getExperienceModelByMongoId }),
)(UserInterfaceIds);
