import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Onboarding.scss';
import { endLobbyCobrowsing, unsubscribeLobbyCobrowsing } from '../../../store/actions/lobbyActions';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';

const Onboarding = ({ endLobbyCobrowsing, unsubscribeLobbyCobrowsing, auth: { me }, lobby: { lobby, cobrowsingState, cobrowsingUser}}) => {
  const isSubscribed = cobrowsingUser.id !== me.id;
  
  function onClose() {
    if(isSubscribed) {
      unsubscribeLobbyCobrowsing({lobbyId: lobby.id, userId: cobrowsingUser.id})
    } else {
      endLobbyCobrowsing({lobbyId: lobby.id})
    }
  }

  useEffect(() => {
    return () => {
      onClose()
    }
  }, [])

  return (
    <div className="Onboarding">
      {isSubscribed && <RemoteMouse userId={cobrowsingUser.id}/>}
      {me.role === 'ADMIN' && <CobrowsingStatus onClose={onClose}/>}
      <h3>Step 1</h3>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { endLobbyCobrowsing, unsubscribeLobbyCobrowsing }),
)(Onboarding);

