/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ActivitySwitcher.scss';
import SelectActivity from '../../../ui/SelectActivity/SelectActivity';
import { editLobby, toggleLobbyDashboard } from '../../../store/actions/lobbyActions';
import Button from '../../../ui/Button/Button';

const ActivitySwitcher = ({
  lobby: { lobby },
  editLobby,
  toggleLobbyDashboard
}) => {
  return (
    <div className="ActivitySwitcher">
      <div className="ActivitySwitcher__state">
        <SelectActivity 
          value={[lobby.currentActivity]}
          onChange={(event, currentActivity) => {
            editLobby(lobby.id, {
              currentActivity: currentActivity
            })       
          }}/>
      </div>
      <div className="ActivitySwitcher__user">
          <Button variant="contained" onClick={() => {
            toggleLobbyDashboard(false)
          }}>
            Join Participant
          </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { toggleLobbyDashboard,  editLobby }),
)(ActivitySwitcher);
