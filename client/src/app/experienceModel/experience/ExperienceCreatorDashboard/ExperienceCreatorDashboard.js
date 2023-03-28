/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperienceCreatorDashboard.scss';
import ExperienceCreatorMenu from '../ExperienceCreatorMenu/ExperienceCreatorMenu';
import PersistentDrawer from '../../../../ui/PersistentDrawer/PersistentDrawer';
import ExperienceCreatorBody from '../ExperienceCreatorBody/ExperienceCreatorBody';
import { getIdInformation } from '../../../../utils';

const ExperienceCreatorDashboard = ({
  experienceModel: { experienceModel }
}) => {
  const [idEditing, setIdEditing] = useState(experienceModel.id);

  return (
    <div className="ExperienceCreatorDashboard">
      <PersistentDrawer 
        startsOpen
        title={
          <div style={{cursor: 'pointer'}} onClick={() => {
            setIdEditing(experienceModel.id)
          }}>
            {experienceModel.metadata.title}
          </div>}
        body={<ExperienceCreatorBody idEditing={idEditing}/>}
        drawer={<ExperienceCreatorMenu onNodeSelect={(e, nodeId) => {
          const { isNotValid } = getIdInformation(nodeId)
          if(!isNotValid) {
            setIdEditing(null)
            setTimeout(() => {
              setIdEditing(nodeId)
            }, 2)
          }
        }}/>}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default compose(
  connect(mapStateToProps, { }),
)(ExperienceCreatorDashboard);
