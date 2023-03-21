/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import './ActivityOverlayToggle.scss'
import Switch from '../../../ui/Switch/Switch';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { updateLobbyUser } from '../../../store/actions/lobbyActions';
import { toggleActiveCobrowsing } from '../../../store/actions/cobrowsingActions';

const ActivityOverlayToggle = ({
  lobby: { lobby: { id, members } },
  cobrowsing: { cobrowsingUser },
  gameRoom: { gameRoom: { isPoweredOn } },
  updateLobbyUser,
  toggleActiveCobrowsing
}) => {
  const user = members.filter(({id}) => {
    if(cobrowsingUser?.id === id) {
      return true
    }
    return false;
  })[0]

  if(!user) return

  const inOverlayView = user.inOverlayView

  return <div
    className="ActivityOverlayToggle"
  > 
    <Icon icon="faStar"/>
    <Switch
      disabled={!isPoweredOn}
      size="small"
      checked={inOverlayView}
      onChange={async () => {
        if(!inOverlayView) toggleActiveCobrowsing(true)
        updateLobbyUser({
          lobbyId: id,
          userId: cobrowsingUser.id, 
          user: {
            inOverlayView: !inOverlayView
          }
        })
      }}
      />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  gameRoom: state.gameRoom
});

export default compose(
  connect(mapStateToProps, { updateLobbyUser, toggleActiveCobrowsing }),
)(ActivityOverlayToggle);
