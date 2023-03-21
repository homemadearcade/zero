/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import './LobbyDashboardToggle.scss'
import Switch from '../../../ui/Switch/Switch';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { toggleLobbyDashboard } from '../../../store/actions/lobbyActions';

const LobbyDashboardToggle = ({
  lobby: { isLobbyDashboardOpen },
  toggleLobbyDashboard
}) => {  
  return <div
    className="LobbyDashboardToggle"
  > 
    <Icon icon="faListOl"/>
    <Switch
      size="small"
      checked={isLobbyDashboardOpen}
      onChange={async () => {
        toggleLobbyDashboard(!isLobbyDashboardOpen)
      }}
      />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, {  toggleLobbyDashboard }),
)(LobbyDashboardToggle);
