/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import LobbyDetail from '../LobbyDetail/LobbyDetail';
import Link from '../../ui/Link/Link';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';
import LobbyPowerIndicator from '../LobbyPowerIndicator/LobbyPowerIndicator';

const LobbyDashboard = ({
  myTracks, 
  userTracks,
}) => {
  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <LobbySetupFlow/>
        <div>
          <LobbyPowerIndicator/>
          <LobbyDetail userTracks={userTracks} myTracks={myTracks}/>
        </div>
      </div>

      <div className="LobbyDashboard__leave"><Link to="/lobbys">leave lobby</Link></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
