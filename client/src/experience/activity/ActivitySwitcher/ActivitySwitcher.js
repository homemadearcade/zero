/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ActivitySwitcher.scss';
import ActivityPreview from '../ActivityPreview/ActivityPreview';
import SelectActivity from '../../../ui/SelectActivity/SelectActivity';
import { editLobby } from '../../../store/actions/lobbyActions';
import Link from '../../../ui/Link/Link';
import Button from '../../../ui/Button/Button';

const ActivitySwitcher = ({
  lobby: { lobby },
  editLobby
}) => {

  // const membersById = lobby.members.reduce((prev, next) => {
  //   prev[next.id] = next
  //   return prev
  // }, {})

  function renderActivitySwitcher() {   
    return <ActivityPreview userId={lobby.participantId}></ActivityPreview>
  }
  
  return (
    <div className="ActivitySwitcher">

      <div className="ActivitySwitcher__window">
        {renderActivitySwitcher()}

      </div>
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
        <Link to ={`/lobby/${lobby.id}/join/${lobby.participantId}`}>
          <Button variant="contained">
            Join Participant
          </Button>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, {  editLobby }),
)(ActivitySwitcher);
