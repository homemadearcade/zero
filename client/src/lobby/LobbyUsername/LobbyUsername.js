import React, { useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './LobbyUsername.scss';
import Link from '../../ui/Link/Link';
import Dialog from '../../ui/Dialog/Dialog';
import UnlockableInterfaceTree from '../../ui/connected/UnlockableInterfaceTree/UnlockableInterfaceTree';
import AgoraVolumeMeter from '../agora/AgoraVolumeMeter/AgoraVolumeMeter';
import { Divider, Paper } from '@mui/material';
import Icon from '../../ui/Icon/Icon';
import { ADMIN_ROLE, ARCADE_EXPERIENCE_ID } from '../../game/constants';
import Button from '../../ui/Button/Button';
import { closeInterfaceTree, openInterfaceTree } from '../../store/actions/userActions';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

const LobbyUsername = ({  match: { params }, myTracks, userTracks, userId, key, lobby: { lobby }, status : { lobbyUserStatuses, cobrowsingMouses }, auth: {me},  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUnlockedUI, setShowUnlockedUI] = useState(false)

  const userStatus = lobbyUserStatuses[userId];
  const userCobrowsingStatus = cobrowsingMouses[userId]
  const user = lobby.users.filter(({id}) => {
    if(userId === id) {
      return true
    }
    return false;
  })[0]

  if(!user) {
    return null
  }

  let userTracksById = {}
  
  if(myTracks && userTracks) {
    userTracksById = [{ uid: me.id, videoTrack: myTracks[1], audioTrack: myTracks[0] }, ...userTracks].reduce((prev, next) => {
      prev[next.uid] = next
      return prev
    }, {})
  }
  
  const isMe = me?.id === userId

  function renderConnectionInfo() {
    return <div className="LobbyUsername__connection">
      <div className="LobbyUsername__title">
        <div className="LobbyUsername__username">{user.username}{isMe && ' (me)'}</div>
        <div className={classnames("LobbyUsername__connection-dot", {'LobbyUsername__connection-dot--bad' : userStatus?.pingDelta && userStatus.pingDelta > 150, 'LobbyUsername__connection-dot--none': !user.connected})}/>
        <div className="LobbyUsername__ping">{userStatus?.pingDelta > -1 ? userStatus?.pingDelta : 0}</div>
        {user.role === ADMIN_ROLE && <div className="LobbyUsername__admin"><Icon icon="faCrown"/></div>}
      </div>
      {userTracksById && userTracksById[user.id] && <AgoraVolumeMeter audioTrack={userTracksById[user.id].audioTrack}/>}
      <Link to={`/lobby/${lobby.id}/join/${user.id}`}>
        {isMe ? 'Play' : 'Join'}
      </Link>
      <div className="LobbyUsername__icons">
        <div className="LobbyUsername__fullscreen"><div className="LobbyUsername__icon"><Icon icon="faWindowMaximize"/></div>{(userStatus?.isFullscreen) ? 'Fullscreen' : 'Windowed'}</div>
        <div className="LobbyUsername__focus"><div className="LobbyUsername__icon"><Icon icon="faEye"/></div>{(!userStatus || userStatus?.isFocused) ? 'On Tab' : 'Away'}</div>
        <div className="LobbyUsername__cobrowsing"><div className="LobbyUsername__icon"><Icon icon="faArrowPointer"/></div>{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s ago</span> : 'Never'}</div>
        <div className="LobbyUsername__upload"><div className="LobbyUsername__icon"><Icon icon="faUpload"/></div>{(user.internetSpeedTestResults?.uploadSpeed) ? user.internetSpeedTestResults?.uploadSpeed : 'Not Tested'}</div>
        <div className="LobbyUsername__download"><div className="LobbyUsername__icon"><Icon icon="faDownload"/></div>{(user.internetSpeedTestResults?.downloadSpeed) ? user.internetSpeedTestResults?.downloadSpeed : 'Not Tested'}</div>
        <div className="LobbyUsername__video-call"><div className="LobbyUsername__icon"><Icon icon="faVideo"/></div>{userTracksById && userTracksById[user.id] ? 'Connected' : 'Not Connected'}</div>
      </div>

    </div>
  }

  const isNavigatedToCobrowse = params.cobrowsingUserId === userId

  return <>
  <Button onClick={() => {
    setIsModalOpen(true)
  }} size="small" key={key} className={classnames("LobbyUsername", {'LobbyUsername--left' : !user.joined, 'LobbyUsername--cobrowser': isNavigatedToCobrowse})}>
    {user.username}
  </Button>
  {isModalOpen && <Dialog open onClose={() => {
    setIsModalOpen(false)
  }}>
    <div className="LobbyUsername__modal">
      {renderConnectionInfo()}
      <Divider></Divider>
      {!showUnlockedUI && <Button onClick={() => {
        setShowUnlockedUI(true)
      }}>Show Unlocked UI Tree</Button>}
      {showUnlockedUI && <UnlockableInterfaceTree experienceId={ARCADE_EXPERIENCE_ID} userId={userId}></UnlockableInterfaceTree>}
    </div>
  </Dialog>}
  </>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  status: state.status,
  auth: state.auth,
  user: state.user,
  cobrowsing: state.cobrowsing,
});

export default compose(
  withRouter, 
  connect(mapStateToProps, { openInterfaceTree, closeInterfaceTree })
)(LobbyUsername);
