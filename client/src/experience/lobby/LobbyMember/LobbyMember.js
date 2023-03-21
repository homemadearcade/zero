import React, { useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './LobbyMember.scss';
import Link from '../../../ui/Link/Link';
import Dialog from '../../../ui/Dialog/Dialog';
import UnlockableInterfaceTree from '../../../ui/connected/UnlockableInterfaceTree/UnlockableInterfaceTree';
import { Divider } from '@mui/material';
import Icon from '../../../ui/Icon/Icon';
import Button from '../../../ui/Button/Button';
import { closeInterfaceTree, openInterfaceTree } from '../../../store/actions/userActions';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { setCutAudio, setCutVideo } from '../../../store/actions/videoActions';
import { GAME_EDITOR_ACTIVITY } from '../../../constants';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { ADMIN_ROLE, ARCADE_EXPERIENCE_ID } from '../../../constants';
import { LOBBY_MEMBER_VIDEO_IID } from '../../../constants/interfaceIds';

const LobbyMember = ({ 
  match: { params }, 
  myTracks, 
  userTracks, 
  userId, 
  key, 
  lobby: { lobby }, 
  status : { lobbyUserStatuses, cobrowsingMouses }, 
  auth: {me}, 
  setCutAudio, 
  setCutVideo
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUnlockedUI, setShowUnlockedUI] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const userStatus = lobbyUserStatuses[userId];
  const userCobrowsingStatus = cobrowsingMouses[userId]
  const user = lobby.members.filter(({id}) => {
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
    return <div className="LobbyMember__connection">
      <div className="LobbyMember__title">
        <div className="LobbyMember__username">{user.username}{isMe && ' (me)'}</div>
        <div className={classnames("LobbyMember__connection-dot", {'LobbyMember__connection-dot--bad' : userStatus?.pingDelta && userStatus.pingDelta > 60, 'LobbyMember__connection-dot--none': !user.connected})}/>
        <div className="LobbyMember__ping">{userStatus?.pingDelta > -1 ? userStatus?.pingDelta : 0}</div>
        {user.role === ADMIN_ROLE && <div className="LobbyMember__admin"><Icon icon="faCrown"/></div>}
      </div>
      <Divider></Divider>
      {userId === lobby.participantId && <Link to ={`/lobby/${lobby.id}/join/${user.id}`}>
        <Button variant="contained">{isMe ? 'Play' : 'Join'}</Button>
      </Link>}
      <Divider></Divider>
      <div className="LobbyMember__icons">
        <div className="LobbyMember__fullscreen">Email: <a href={'mailto::' + user.email}>{user.email}</a></div>
        <div className="LobbyMember__fullscreen"><div className="LobbyMember__icon"><Icon icon="faWindowMaximize"/></div>{(userStatus?.isFullscreen) ? 'Fullscreen' : 'Windowed'}</div>
        <div className="LobbyMember__focus"><div className="LobbyMember__icon"><Icon icon="faEye"/></div>{(!userStatus || userStatus?.isFocused) ? 'On Tab' : 'Away'}</div>
        <div className="LobbyMember__cobrowsing"><div className="LobbyMember__icon"><Icon icon="faArrowPointer"/></div>{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s ago</span> : 'Never'}</div>
        <div className="LobbyMember__upload"><div className="LobbyMember__icon"><Icon icon="faUpload"/></div>{(user.internetSpeedTestResults?.uploadSpeed) ? user.internetSpeedTestResults?.uploadSpeed : 'Not Tested'}</div>
        <div className="LobbyMember__download"><div className="LobbyMember__icon"><Icon icon="faDownload"/></div>{(user.internetSpeedTestResults?.downloadSpeed) ? user.internetSpeedTestResults?.downloadSpeed : 'Not Tested'}</div>
        <div className="LobbyMember__video-call"><div className="LobbyMember__icon"><Icon icon="faVideo"/></div>{userTracksById && userTracksById[user.id] ? 'Connected' : 'Not Connected'}</div>
      </div>
      <Divider></Divider>
      <Link newTab href={`/user/${user.username}`}>
        More Info
      </Link>
      <Divider></Divider>
       {!isVideoOpen && <Button onClick={() => {
        setIsVideoOpen(true)
      }}>Show Users Video</Button>}
      {isVideoOpen && <AgoraUserVideo interfaceId={LOBBY_MEMBER_VIDEO_IID} userId={userId} myTracks={myTracks} userTracks={userTracks} width="200px" height="200px"></AgoraUserVideo>}
    </div>
  }

  const isNavigatedToCobrowse = params.cobrowsingUserId === userId

  return <>
  <Button onClick={() => {
    setIsModalOpen(true)
  }} size="small" key={key} className={classnames("LobbyMember", {'LobbyMember--left' : !user.joined, 'LobbyMember--cobrowser': isNavigatedToCobrowse})}>
    {user.username}
  </Button>
  {isModalOpen && <Dialog open onClose={() => {
    setIsModalOpen(false)
  }}>
    <div className="LobbyMember__modal">
      {renderConnectionInfo()}
      {false && lobby.currentActivity === GAME_EDITOR_ACTIVITY && <>
        <Button onClick={() => { setCutVideo(true, true)}}>Cut Video</Button>
        <Button onClick={() => { setCutAudio(true, true)}}>Cut Audio</Button>
      </>}
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
  connect(mapStateToProps, { openInterfaceTree, closeInterfaceTree, setCutAudio, setCutVideo })
)(LobbyMember);
