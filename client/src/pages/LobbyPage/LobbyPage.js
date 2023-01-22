
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import { assignLobbyRole, changeLobbyConnectionState, editLobby} from '../../store/actions/lobbyActions';
import requireAuth from '../../hoc/requireAuth';
import requireChrome from '../../hoc/requireChrome';

import './LobbyPage.scss';
import withLobby from '../../hoc/withLobby';
import CobrowsingGame from '../../game/CobrowsingGame/CobrowsingGame';
import LobbyDashboard from '../../lobby/LobbyDashboard/LobbyDashboard';
import Drawer from '../../ui/Drawer/Drawer';
import LobbyDetail from '../../lobby/LobbyDetail/LobbyDetail';
import Link from '../../ui/Link/Link';
import Icon from '../../ui/Icon/Icon';
import CobrowsingIndicator from '../../game/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import { ADMIN_ROLE, GAME_EDITOR_UI, MONOLOGUE_UI, WAITING_UI } from '../../game/constants';
import LobbyPowerIndicator from '../../lobby/LobbyPowerIndicator/LobbyPowerIndicator';
import ConstellationToggle from '../../game/ConstellationToggle/ConstellationToggle';
import UnlockableInterfaceLocksToggle from '../../game/cobrowsing/UnlockableInterfaceLocksToggle/UnlockableInterfaceLocksToggle';
import AgoraUserVideo from '../../lobby/agora/AgoraUserVideo/AgoraUserVideo';
import ObscuredGameView from '../../game/ObscuredGameView/ObscuredGameView';
import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import withSpeedTest from '../../hoc/withSpeedTest';
import { GAME_CONNECTION_LOST } from '../../lobby/constants';
import Dialog from '../../ui/Dialog/Dialog';
import { DialogContent, DialogTitle } from '@mui/material';

const LobbyPage = ({
  lobby: { lobby, connectionMessage, connectionState },
  auth: { me },
  myTracks,
  userTracks,
  editLobby,
  assignLobbyRole,
  video: { isInsideVideoCall },
  changeLobbyConnectionState
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

  function renderGameExperience() {   
    if(lobby.experienceUI === WAITING_UI) {
      return <div className="LobbyWaiting">
        <Typography variant="h4">Your experience will start shortly...</Typography>
      </div>
    }

    if(lobby.experienceUI === GAME_EDITOR_UI) {
      return <CobrowsingGame gameId={lobby.currentGameId} myTracks={myTracks} userTracks={userTracks}>
        <ObscuredGameView/>
      </CobrowsingGame>
    }

    if(lobby.experienceUI === MONOLOGUE_UI) {
      return <div className="MonologueView">
        {isInsideVideoCall && <AgoraUserVideo
          className="MonologueView__speaker"
          myTracks={myTracks}
          userTracks={userTracks}
          userId={lobby.guideId}
        ></AgoraUserVideo>}
      </div>
    }
  }

  function renderLobbyExperience() {
    if(lobby.experienceUI === GAME_EDITOR_UI) {
      return null
    }

    if(lobby.experienceUI === MONOLOGUE_UI) {
      return <div className="LobbyMonologueView">
        <div className="LobbyMonologueView__body">
        <div className="LobbyMonologueView__dialogue-text">
          {lobby.monologueText}
        </div>

          {isInsideVideoCall && <AgoraUserVideo
            className="LobbyMonologueView__listener"
            myTracks={myTracks}
            userTracks={userTracks}
            userId={lobby.participantId}
          ></AgoraUserVideo>}
          {isInsideVideoCall && <AgoraUserVideo
            className="LobbyMonologueView__speaker"
            myTracks={myTracks}
            userTracks={userTracks}
            userId={lobby.guideId}
          ></AgoraUserVideo>}
        </div>

        <Button variant="contained" onClick={() => {
          editLobby(lobby.id, {
            experienceUI: GAME_EDITOR_UI
          })
        }}>
          Complete Monologue
        </Button>
      </div>
    }
  }

  function renderLobbyConnection() {
    if(connectionState === GAME_CONNECTION_LOST) return <Dialog open onClose={() => {
      changeLobbyConnectionState(null)
    }}>
      <DialogTitle>Game Connection Lost</DialogTitle>
      <DialogContent>{connectionMessage}</DialogContent>
    </Dialog>
  }
  
  return <Switch>
      <Route exact path={path}>
        <LobbyDashboard/>  
        <LobbyDrawer/>
        {renderLobbyExperience()}
        {renderLobbyConnection()}
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <LobbyDrawer>
          <LobbyPowerIndicator/>
          <CobrowsingIndicator/>
          <UnlockableInterfaceLocksToggle/>
          <ConstellationToggle/>
        </LobbyDrawer>}
        {renderGameExperience()}
        {renderLobbyConnection()}
      </Route>
    </Switch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  video: state.video
});

export default compose(
  requireChrome,
  requireAuth,
  withLobby,
  withSpeedTest,
  connect(mapStateToProps, { assignLobbyRole, editLobby, changeLobbyConnectionState }),
)(LobbyPage);
