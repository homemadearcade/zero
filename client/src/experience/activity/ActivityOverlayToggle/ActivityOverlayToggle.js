/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import './ActivityOverlayToggle.scss'
import Switch from '../../../ui/Switch/Switch';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { updateLobbyMember } from '../../../store/actions/experience/lobbyInstanceActions';
import { toggleActiveCobrowsing } from '../../../store/actions/game/cobrowsingActions';

const ActivityOverlayToggle = ({
  lobbyInstance: { lobbyInstance: { id, members } },
  cobrowsing: { cobrowsingUser },
  gameRoomInstance: { gameRoomInstance: { isPoweredOn } },
  updateLobbyMember,
  toggleActiveCobrowsing
}) => {
  const user = members.filter((member) => {
    if(cobrowsingUser?.id === member.userMongoId) {
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
        updateLobbyMember({
          lobbyInstanceMongoId: id,
          userMongoId: cobrowsingUser.id, 
          member: {
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
  connect(mapStateToProps, { updateLobbyMember, toggleActiveCobrowsing }),
)(ActivityOverlayToggle);
