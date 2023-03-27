/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperienceCreatorDashboard.scss';
import ExperienceCreatorMenu from '../ExperienceCreatorMenu/ExperienceCreatorMenu';
import PersistentDrawer from '../../../ui/PersistentDrawer/PersistentDrawer';

const ExperienceCreatorDashboard = ({
  experience: { experience }
}) => {
  return (
    <div className="ExperienceCreatorDashboard">
      <PersistentDrawer startsOpen title={experience.metadata.title} body={<div/>} drawer={<ExperienceCreatorMenu/>}/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  experience: state.experience,
});

export default compose(
  connect(mapStateToProps, { }),
)(ExperienceCreatorDashboard);
