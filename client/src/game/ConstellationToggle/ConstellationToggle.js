/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../ui/Icon/Icon';
import './ConstellationToggle.scss'
import Switch from '../../ui/Switch/Switch';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { updateLobbyUser } from '../../store/actions/lobbyActions';

const ConstellationToggle = ({
  lobby: { lobby: { id, users } },
  cobrowsing: { cobrowsingUser },
  updateLobbyUser
}) => {
  const user = users.filter(({id}) => {
    if(cobrowsingUser?.id === id) {
      return true
    }
    return false;
  })[0]

  const inConstellationView = user.inConstellationView

  return <div
    className="ConstellationToggle"
    onClick={async () => {
      updateLobbyUser({
        lobbyId: id,
        userId: cobrowsingUser.id, 
        user: {
          inConstellationView: !inConstellationView
        }
      })
    }}
  > 
    <Icon icon="faStar"/>
    <Switch
      size="small"
      checked={inConstellationView}
      />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { updateLobbyUser }),
)(ConstellationToggle);
