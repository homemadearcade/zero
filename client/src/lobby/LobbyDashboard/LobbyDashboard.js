/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';
import ExperiencePreview from '../ExperiencePreview/ExperiencePreview';

const LobbyDashboard = ({
  lobby: { lobby },
}) => {
  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <ExperiencePreview userId={lobby.participantId}/>
        <LobbySetupFlow/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
