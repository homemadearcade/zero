/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole} from '../../store/actions/lobbyActions';
import { subscribeCobrowsing, startCobrowsing } from '../../store/actions/cobrowsingActions';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import CobrowsingRoot from '../../app/cobrowsing/CobrowsingRoot/CobrowsingRoot';
import withLobby from '../../hoc/withLobby';

const LobbyPage = ({
  cobrowsing: { cobrowsingUser },
  myTracks,
  userTracks
}) => {

  if(cobrowsingUser) {
    return <CobrowsingRoot myTracks={myTracks} userTracks={userTracks} />
  }
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
});

export default compose(
  requireAuth,
  withLobby,  
  connect(mapStateToProps, { assignLobbyRole, startCobrowsing, subscribeCobrowsing })
)(LobbyPage);
