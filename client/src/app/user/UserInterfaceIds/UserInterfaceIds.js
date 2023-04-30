/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getUserByUsername } from '../../../store/actions/user/userActions';

import requireAuth from '../../../hoc/requireAuth';

import UnlockableInterfaceTree from '../../../ui/connected/UnlockableInterfaceTree/UnlockableInterfaceTree';
import { Divider } from '@mui/material';
import SelectExperienceModel from '../../../ui/connected/SelectExperienceModel/SelectExperienceModel';
import { getExperienceModelByMongoId } from '../../../store/actions/experience/experienceModelActions';
import Typography from '../../../ui/Typography/Typography';

const UserInterfaceIds = ({
  user: { user },
  experienceModel: { experienceModel },
  getExperienceModelByMongoId,
}) => {

  return (
      <>
        <SelectExperienceModel formLabel="Select the Experience you want to view Interface Ids for" value={experienceModel?.id ? [experienceModel.id] : []} onSelect={(experienceModels) => {
          if(experienceModels[0]) {
            const id = experienceModels[experienceModels.length -1].id
            getExperienceModelByMongoId(id)
          }
        }}/>
        {user.id && experienceModel?.id && <UnlockableInterfaceTree experienceModelMongoId={experienceModel.id} userMongoId={user.id}></UnlockableInterfaceTree>}
      </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  experienceModel: state.experienceModel,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getUserByUsername, getExperienceModelByMongoId }),
)(UserInterfaceIds);
