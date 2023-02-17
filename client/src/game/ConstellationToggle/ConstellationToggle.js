/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../ui/Icon/Icon';
import './ConstellationToggle.scss'
import Switch from '../../ui/Switch/Switch';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { updateLobbyUser } from '../../store/actions/lobbyActions';
import { GAME_EDITOR_ACTIVITY } from '../../constants';

const ConstellationToggle = ({
  lobby: { lobby: { id, members, currentActivity } },
  cobrowsing: { cobrowsingUser },
  gameRoom: { gameRoom: { isPoweredOn } },
  updateLobbyUser
}) => {
  const user = members.filter(({id}) => {
    if(cobrowsingUser?.id === id) {
      return true
    }
    return false;
  })[0]

  if(!user) return

  const inConstellationView = user.inConstellationView

  return <div
    className="ConstellationToggle"
  > 
    <Icon icon="faStar"/>
    <Switch
      disabled={currentActivity !== GAME_EDITOR_ACTIVITY || !isPoweredOn}
      size="small"
      checked={inConstellationView}
      onChange={async () => {
        updateLobbyUser({
          lobbyId: id,
          userId: cobrowsingUser.id, 
          user: {
            inConstellationView: !inConstellationView
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
  connect(mapStateToProps, { updateLobbyUser }),
)(ConstellationToggle);
