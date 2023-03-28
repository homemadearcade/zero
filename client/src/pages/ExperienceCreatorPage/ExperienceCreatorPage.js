
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';

import './ExperienceCreatorPage.scss';
import ExperienceCreatorDashboard from '../../app/experienceModel/experience/ExperienceCreatorDashboard/ExperienceCreatorDashboard';
import WithExperience from '../../hoc/WithExperience';

const ExperienceCreatorPage = ({

}) => {
  return <WithExperience>
    <ExperienceCreatorDashboard></ExperienceCreatorDashboard>
  </WithExperience> 
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireAuth,
  connect(mapStateToProps, {}),
)(ExperienceCreatorPage);
