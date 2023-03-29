/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ActivitySwitcher.scss';
import SelectActivityCategory from '../../../ui/SelectActivityCategory/SelectActivityCategory';
import { editLobby, toggleLobbyDashboard } from '../../../store/actions/lobbyInstanceActions';
import Button from '../../../ui/Button/Button';

const ActivitySwitcher = ({
  lobbyInstance: { lobbyInstance },
  editLobby,
  toggleLobbyDashboard
}) => {
  return (
    <div className="ActivitySwitcher">
      <div className="ActivitySwitcher__state">
        <SelectActivityCategory 
          value={[lobbyInstance.currentActivity]}
          onChange={(event, currentActivity) => {
            editLobby(lobbyInstance.id, {
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
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { toggleLobbyDashboard,  editLobby }),
)(ActivitySwitcher);
