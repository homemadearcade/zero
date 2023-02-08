
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch as RouterSwitch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import { assignLobbyRole, editLobby} from '../../store/actions/lobbyActions';
import requireAuth from '../../hoc/requireAuth';
import requireChrome from '../../hoc/requireChrome';

import './LobbyPage.scss';
import withLobby from '../../hoc/withLobby';
import LobbyDashboard from '../../lobby/LobbyDashboard/LobbyDashboard';
import { ADMIN_ROLE } from '../../game/constants';
import withSpeedTest from '../../hoc/withSpeedTest';
import WithCobrowsing from '../../hoc/withCobrowsing';
import AskFullscreen from '../../hoc/askFullscreen';
import LobbyErrorStates from '../../lobby/LobbyErrorStates/LobbyErrorStates';
import LobbyGuideToolbar from '../../lobby/LobbyGuideToolbar/LobbyGuideToolbar';
import ExperienceView from '../../lobby/ExperienceView/ExperienceView';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks,
  assignLobbyRole,
}) => {
  let { path } = useRouteMatch();

  useEffect(() => {
    if(lobby.isGamePoweredOn) return 
    
    if(me.role === ADMIN_ROLE && (!lobby.guideId)) {
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'guide'
      });
    }
  }, [])

  return <RouterSwitch>
      <Route exact path={path}>
        <WithCobrowsing userId={lobby.participantId}>
          <LobbyDashboard userTracks={userTracks} myTracks={myTracks}/>
        </WithCobrowsing>
        <LobbyErrorStates/>
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <LobbyGuideToolbar myTracks={myTracks} userTracks={userTracks}></LobbyGuideToolbar>}
        <WithCobrowsing>
          <AskFullscreen>
            <ExperienceView myTracks={myTracks} userTracks={userTracks}/>
          </AskFullscreen>
        </WithCobrowsing>
        <LobbyErrorStates/>
      </Route>
    </RouterSwitch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
});

export default compose(
  requireChrome,
  requireAuth,
  withLobby,
  withSpeedTest,
  connect(mapStateToProps, { assignLobbyRole, editLobby }),
)(LobbyPage);
