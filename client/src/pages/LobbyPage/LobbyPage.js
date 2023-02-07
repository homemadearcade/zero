
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import CobrowsingGame from '../../game/CobrowsingGame/CobrowsingGame';
import LobbyDashboard from '../../lobby/LobbyDashboard/LobbyDashboard';
import Drawer from '../../ui/Drawer/Drawer';
import LobbyDetail from '../../lobby/LobbyDetail/LobbyDetail';
import Link from '../../ui/Link/Link';
import Icon from '../../ui/Icon/Icon';
import CobrowsingIndicator from '../../game/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import { ADMIN_ROLE } from '../../game/constants';
import LobbyPowerIndicator from '../../lobby/LobbyPowerIndicator/LobbyPowerIndicator';
import ConstellationToggle from '../../game/ConstellationToggle/ConstellationToggle';
import AgoraUserVideo from '../../lobby/agora/AgoraUserVideo/AgoraUserVideo';
import ObscuredGameView from '../../game/ObscuredGameView/ObscuredGameView';
import Typography from '../../ui/Typography/Typography';
import withSpeedTest from '../../hoc/withSpeedTest';
import { COBROWSING_CONNECTION_LOST, GAME_CONNECTION_LOST } from '../../lobby/constants';
import Dialog from '../../ui/Dialog/Dialog';
import { DialogContent, DialogTitle } from '@mui/material';
import { CHATROOM_UI, GAME_EDITOR_UI, MONOLOGUE_UI, WAITING_UI } from '../../constants';
import LobbyChatroom from '../../lobby/LobbyChatroom/LobbyChatroom';
import { Container } from '@mui/system';
import { inIframe } from '../../utils/webPageUtils';
import WithCobrowsing from '../../hoc/withCobrowsing';
import AskFullscreen from '../../hoc/askFullscreen';
import { clearErrorState } from '../../store/actions/errorsActions';
import Switch from '../../ui/Switch/Switch';

const LobbyPage = ({
  lobby: { lobby, lobby: { experienceState, isGamePoweredOn, skipStageSave } },
  errors: { errorStates },
  auth: { me },
  myTracks,
  userTracks,
  editLobby,
  assignLobbyRole,
  video: { isInsideVideoCall },
  clearErrorState
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
  }, [])

  function LobbyDrawer({ children }) {
    return <>
      <div className="LobbyPage__admin-tools">
        {!inIframe() && <div className="LobbyPage__drawer-toggle" onClick={() => {
          setIsDrawerOpen(true)
        }}>
          <Icon icon="faBars"/>
        </div>}
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
    if(lobby.experienceState === WAITING_UI) {
      return <div className="LobbyWaiting">
        <Typography variant="h4">Your experience will start shortly...</Typography>
      </div>
    }

    if(lobby.experienceState === GAME_EDITOR_UI) {
      return <CobrowsingGame gameId={lobby.currentGameId} myTracks={myTracks} userTracks={userTracks}>
        <ObscuredGameView/>
      </CobrowsingGame>
    }

    if(lobby.experienceState === CHATROOM_UI) {
      return <LobbyChatroom hideAutomated></LobbyChatroom>
    }

    if(lobby.experienceState === MONOLOGUE_UI) {
      return <div className="MonologueView">
        {isInsideVideoCall && <AgoraUserVideo
          hideOverlay
          className="MonologueView__speaker"
          myTracks={myTracks}
          userTracks={userTracks}
          userId={lobby.guideId}
        ></AgoraUserVideo>}
      </div>
    }
  }

  function renderLobbyAdminExperience() {
    if(lobby.experienceState === GAME_EDITOR_UI) {
      return null
    }

    if(lobby.experienceState === MONOLOGUE_UI) {
      // return <div className="LobbyMonologueView">
      //   <div className="LobbyMonologueView__body">
      //     <div className="LobbyMonologueView__dialogue-text">
      //       {lobby.monologueText}
      //     </div>
      //     {isInsideVideoCall && <AgoraUserVideo
      //       className="LobbyMonologueView__speaker"
      //       myTracks={myTracks}
      //       userTracks={userTracks}
      //       userId={lobby.guideId}
      //     ></AgoraUserVideo>}
      //   </div>
      //   <Divider></Divider>
      //   <Typography variant="h5">Leave Monologue</Typography>
      //   <SelectExperienceState
      //     value={[lobby.experienceState]}
      //     onChange={(event, experienceState) => {
      //       editLobby(lobby.id, {
      //         experienceState: experienceState
      //       })       
      //     }}/>
      // </div>
    }
  }

  function renderErrors() {
    if(errorStates[GAME_CONNECTION_LOST].on) return <Dialog open onClose={() => {
      clearErrorState(GAME_CONNECTION_LOST)
    }}>
      <DialogTitle>Game Connection Lost</DialogTitle>
      <DialogContent>{errorStates[GAME_CONNECTION_LOST].message}</DialogContent>
    </Dialog>

   if(errorStates[COBROWSING_CONNECTION_LOST].on) {
      return <Dialog open>
        <DialogTitle>Cobrowsing Connection Lost</DialogTitle>
        <DialogContent>{errorStates[COBROWSING_CONNECTION_LOST].message ? errorStates[COBROWSING_CONNECTION_LOST].message : 'Attempting to reconnect...'}</DialogContent>
      </Dialog>
   }
  }
  
  return <RouterSwitch>
      <Route exact path={path}>
        <WithCobrowsing userId={lobby.participantId}>
          <LobbyDashboard userTracks={userTracks} myTracks={myTracks}/>
        </WithCobrowsing>
        {renderLobbyAdminExperience()}
        {renderErrors()}
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <LobbyDrawer>
          {experienceState === GAME_EDITOR_UI && <CobrowsingIndicator/>}
          {experienceState === GAME_EDITOR_UI && <LobbyPowerIndicator/>}
          {experienceState === GAME_EDITOR_UI && isGamePoweredOn && <ConstellationToggle/>}
          {experienceState === GAME_EDITOR_UI && skipStageSave && <div className="LobbyPage__not-saving-stage">
            <Icon icon="faFloppyDisk"></Icon>
            <Typography variant="subtitle2">Not Saving<br/>Map Objects</Typography>
            <Switch
              size="small"
              onChange={() => {
                editLobby(lobby.id, {
                  skipStageSave: false,
                })
              }}
              checked={skipStageSave}
            />
          </div>}
        </LobbyDrawer>}
        <WithCobrowsing>
          <AskFullscreen>
            <Container>{renderGameExperience()}</Container>
          </AskFullscreen>
        </WithCobrowsing>
        {renderErrors()}
      </Route>
    </RouterSwitch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  video: state.video,
  errors: state.errors
});

export default compose(
  requireChrome,
  requireAuth,
  withLobby,
  withSpeedTest,
  connect(mapStateToProps, { assignLobbyRole, editLobby, clearErrorState }),
)(LobbyPage);
