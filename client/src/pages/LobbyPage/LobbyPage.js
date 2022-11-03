
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
import CobrowsingGame from '../../game/CobrowsingGame/CobrowsingGame';
import LobbyDashboard from '../../components/lobby/LobbyDashboard/LobbyDashboard';
import Onboarding from '../../components/lobby/Onboarding/Onboarding';
import GameView from '../../game/GameView/GameView';
import Drawer from '../../components/ui/Drawer/Drawer';
import LobbyDetail from '../../components/lobby/LobbyDetail/LobbyDetail';
import Link from '../../components/ui/Link/Link';
import Icon from '../../components/ui/Icon/Icon';
import CobrowsingIndicator from '../../game/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import { ADMIN_ROLE } from '../../constants';
import LobbyPowerIndicator from '../../components/lobby/LobbyPowerIndicator/LobbyPowerIndicator';
import ConstellationToggle from '../../components/ConstellationToggle/ConstellationToggle';
import UnlockableInterfaceLocksToggle from '../../game/cobrowsing/UnlockableInterfaceLocksToggle /UnlockableInterfaceLocksToggle';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks,
  assignLobbyRole,
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

      <div className="LobbyPage__admin-tools">
        <div className="LobbyPage__drawer-toggle" onClick={() => {
          setIsDrawerOpen(true)
        }}>
          <Icon icon="faBars"/>
        </div>
        <LobbyPowerIndicator/>
        <CobrowsingIndicator/>
        <UnlockableInterfaceLocksToggle/>
        <ConstellationToggle/>
      </div>
      <Drawer anchor="right" isOpen={isDrawerOpen} onClose={() => 
        setIsDrawerOpen(false)
      }>
        <div className="LobbyPage__drawer-close" 
          onClick={() => {
            setIsDrawerOpen(false)
          }}>
          <Icon 
            icon="faClose"
          />
        </div>
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
