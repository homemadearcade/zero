/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import './ActivityOverlayToggle.scss'
import Switch from '../../../ui/Switch/Switch';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { updateLobbyUser } from '../../../store/actions/lobbyInstanceActions';
import { toggleActiveCobrowsing } from '../../../store/actions/cobrowsingActions';

const ActivityOverlayToggle = ({
  lobbyInstance: { lobbyInstance: { id, members } },
  cobrowsing: { cobrowsingUser },
  gameRoomInstance: { gameRoomInstance: { isPoweredOn } },
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
          lobbyInstanceInstanceId: id,
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
  lobbyInstance: state.lobbyInstance,
  cobrowsing: state.cobrowsing,
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  connect(mapStateToProps, { updateLobbyUser, toggleActiveCobrowsing }),
)(ActivityOverlayToggle);
