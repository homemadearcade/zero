
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
import LobbyDashboard from '../../lobby/LobbyDashboard/LobbyDashboard';
import Onboarding from '../../lobby/Onboarding/Onboarding';
import GameView from '../../game/GameView/GameView';
import Drawer from '../../ui/Drawer/Drawer';
import LobbyDetail from '../../lobby/LobbyDetail/LobbyDetail';
import Link from '../../ui/Link/Link';
import Icon from '../../ui/Icon/Icon';
import CobrowsingIndicator from '../../game/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import { ADMIN_ROLE } from '../../game/constants';
import LobbyPowerIndicator from '../../lobby/LobbyPowerIndicator/LobbyPowerIndicator';
import ConstellationToggle from '../../game/ConstellationToggle/ConstellationToggle';
import UnlockableInterfaceLocksToggle from '../../game/cobrowsing/UnlockableInterfaceLocksToggle /UnlockableInterfaceLocksToggle';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks,
  assignLobbyRole,
  cobrowsing: { showUnlockableInterfaceLocks }
}) => {
  let { path } = useRouteMatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  console.log(lobby)

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

  function LobbyDrawer({ children }) {
    return <>

      <div className="LobbyPage__admin-tools">
        <div className="LobbyPage__drawer-toggle" onClick={() => {
          setIsDrawerOpen(true)
        }}>
          <Icon icon="faBars"/>
        </div>
        {children}
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
        <Link onClick={() => {
          setIsDrawerOpen(false)
        }} to={`/lobby/${lobby.id}`}>Go to Lobby</Link>
        <Link to="/lobbys">Exit Lobby</Link>
      </Drawer>
    </>
  }

  const { isObscured, isUnlocked } = getInterfaceIdData('gameView')
  
  return <Switch>
      <Route exact path={path}>
        <LobbyDashboard myTracks={myTracks} userTracks={userTracks}/>
        {<LobbyDrawer/>}
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <LobbyDrawer>
          <LobbyPowerIndicator/>
          <CobrowsingIndicator/>
          <UnlockableInterfaceLocksToggle/>
          <ConstellationToggle/>
        </LobbyDrawer>}
        {<CobrowsingGame gameId={lobby.game?.id} myTracks={myTracks} userTracks={userTracks}>
          {!lobby.isGamePoweredOn && <div className="GameEditor__empty-game">
          </div>}
          {lobby.isGamePoweredOn && 
            <>{(isObscured || (!isUnlocked && showUnlockableInterfaceLocks)) && 
              <div className="GameEditor__empty-game GameEditor__empty-game--overlay">
                <Unlockable isTiny interfaceId="gameView"><div></div></Unlockable>
              </div>
            }
            <GameView
              isHost={lobby.gameHostId === me.id}
              isNetworked
            /></>
          }
        </CobrowsingGame>}
      </Route>
    </Switch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  unlockableInterfaceIds: state.unlockableInterfaceIds
});

export default compose(
  requireAuth,
  withLobby,
  connect(mapStateToProps, { assignLobbyRole }),
)(LobbyPage);
