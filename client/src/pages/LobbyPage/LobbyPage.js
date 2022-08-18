
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import { assignLobbyRole} from '../../store/actions/lobbyActions';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import withLobby from '../../hoc/withLobby';
import CobrowsingGame from '../../app/cobrowsing/CobrowsingGame/CobrowsingGame';
import LobbyDashboard from '../../app/lobby/LobbyDashboard/LobbyDashboard';
import Onboarding from '../../app/cobrowsing/Onboarding/Onboarding';
import GameView from '../../game/GameView/GameView';
import Drawer from '../../app/ui/Drawer/Drawer';
import LobbyDetail from '../../app/lobby/LobbyDetail/LobbyDetail';
import Link from '../../app/ui/Link/Link';
import Icon from '../../app/ui/Icon/Icon';
import CobrowsingIndicator from '../../app/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import { ADMIN_ROLE } from '../../constants';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks,
  assignLobbyRole,
  toggleCobrowsing
}) => {
  let { path } = useRouteMatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if(lobby.isGamePoweredOn) return 
    
    if(me.role === ADMIN_ROLE && (!lobby.guideId)) {
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'guide'
      });
    }
    
    if(me.role !== ADMIN_ROLE && (!lobby.gameHostId || !lobby.participantId)) {
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'gameHost'
      });
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'participant'
      });
    }
  }, [])

  function LobbyDrawer() {
    return <>
      <div className="LobbyPage__drawer-toggle" onClick={() => {
        setIsDrawerOpen(!isDrawerOpen)
      }}>
        {!isDrawerOpen && <Icon icon="faBars"/>}
        {isDrawerOpen && <Icon icon="faClose"/>}
      </div>
      <div className="LobbyPage__cobrowsing-toggle">
        <CobrowsingIndicator/>
      </div>
      <Drawer anchor="right" isOpen={isDrawerOpen} onClose={() => 
        setIsDrawerOpen(false)
      }>
        <br/>
        <br/>
        <br/>
        <LobbyDetail myTracks={myTracks} userTracks={userTracks} 
        />
        <br/>
        <Link onClick={() => {
          setIsDrawerOpen(false)
        }} to={`/lobby/${lobby.id}`}>Exit game and return to lobby</Link>
      </Drawer>
    </>
  }

  return <Switch>
      <Route exact path={path}>
        <LobbyDashboard myTracks={myTracks} userTracks={userTracks}/>
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <LobbyDrawer/>}
        {<CobrowsingGame gameId={lobby.game?.id} myTracks={myTracks} userTracks={userTracks}>
          {!lobby.isGamePoweredOn && <div className="GameEditor__empty-game"><Onboarding/></div>}
          {lobby.isGamePoweredOn && <GameView
            isHost={lobby.gameHostId === me.id}
            isNetworked
          />}
        </CobrowsingGame>}
      </Route>
    </Switch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
});

export default compose(
  requireAuth,
  withLobby,
  connect(mapStateToProps, { assignLobbyRole }),
)(LobbyPage);
