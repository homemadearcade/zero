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
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { setCutAudio, setCutVideo } from '../../../store/actions/experience/videoActions';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { ADMIN_ROLE } from '../../../constants';
import { LOBBY_MEMBER_VIDEO_IID } from '../../../constants/interfaceIds';

const LobbyMember = ({ 
  match: { params }, 
  myTracks, 
  userTracks, 
  userMongoId, 
  key, 
  lobbyInstance: { lobbyInstance }, 
  status : { lobbyInstanceUserStatuses, cobrowsingMouses }, 
  auth: {me}, 
  setCutAudio, 
  setCutVideo
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showUnlockedUI, setShowUnlockedUI] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const userStatus = lobbyInstanceUserStatuses[userMongoId];
  const userCobrowsingStatus = cobrowsingMouses[userMongoId]
  const user = lobbyInstance.members.filter((member) => {
    if(userMongoId === member.userMongoId) {
      return true
    }
    return false;
  })[0]

  if(!user) {
    return <Button disabled>(Not Present)</Button>
  }

  let userTracksById = {}
  
  if(myTracks && userTracks) {
    userTracksById = [{ uid: me.id, videoTrack: myTracks[1], audioTrack: myTracks[0] }, ...userTracks].reduce((prev, next) => {
      prev[next.uid] = next
      return prev
    }, {})
  }
  
  const isMe = me?.id === userMongoId
  function renderConnectionInfo() {
    return <div className="LobbyMember__connection">
      <div className="LobbyMember__title">
        <div className="LobbyMember__username">{user.username}{isMe && ' (me)'}</div>
        <div className={classnames("LobbyMember__connection-dot", {'LobbyMember__connection-dot--bad' : userStatus?.pingDelta && userStatus.pingDelta > 60, 'LobbyMember__connection-dot--none': !user.connected})}/>
        <div className="LobbyMember__ping">{userStatus?.pingDelta > -1 ? userStatus?.pingDelta : 0}</div>
        {user.role === ADMIN_ROLE && <div className="LobbyMember__admin"><Icon icon="faCrown"/></div>}
      </div>
      <Divider></Divider>

      <Divider></Divider>
      <div className="LobbyMember__icons">
        <div className="LobbyMember__fullscreen">Email: <a href={'mailto::' + user.email}>{user.email}</a></div>
        <div className="LobbyMember__fullscreen"><div className="LobbyMember__icon"><Icon icon="faWindowMaximize"/></div>{(userStatus?.isFullscreen) ? 'Fullscreen' : 'Windowed'}</div>
        <div className="LobbyMember__focus"><div className="LobbyMember__icon"><Icon icon="faEye"/></div>{(!userStatus || userStatus?.isFocused) ? 'On Tab' : 'Away'}</div>
        <div className="LobbyMember__cobrowsing"><div className="LobbyMember__icon"><Icon icon="faArrowPointer"/></div>{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s ago</span> : 'Never'}</div>
        <div className="LobbyMember__upload"><div className="LobbyMember__icon"><Icon icon="faUpload"/></div>{(user.internetSpeedTestResults?.uploadSpeed) ? user.internetSpeedTestResults?.uploadSpeed : 'Not Tested'}</div>
        <div className="LobbyMember__download"><div className="LobbyMember__icon"><Icon icon="faDownload"/></div>{(user.internetSpeedTestResults?.downloadSpeed) ? user.internetSpeedTestResults?.downloadSpeed : 'Not Tested'}</div>
        <div className="LobbyMember__video-call"><div className="LobbyMember__icon"><Icon icon="faVideo"/></div>{userTracksById && userTracksById[user.userMongoId] ? 'Connected' : 'Not Connected'}</div>
      </div>
      <Divider></Divider>
      <Link newTab href={`/user/${user.username}`}>
        More Info
      </Link>
      <Divider></Divider>
       {!isVideoOpen && <Button onClick={() => {
        setIsVideoOpen(true)
      }}>Show Users Video</Button>}
      {isVideoOpen && <AgoraUserVideo interfaceId={LOBBY_MEMBER_VIDEO_IID} userMongoId={userMongoId} myTracks={myTracks} userTracks={userTracks} width="200px" height="200px"></AgoraUserVideo>}
    </div>
  }

  const isNavigatedToCobrowse = lobbyInstance.cobrowsingUserMongoId === userMongoId

  return <span key={userMongoId}>
  <Button onClick={() => {
    setIsDialogOpen(true)
  }} size="small" key={key} className={classnames("LobbyMember", {'LobbyMember--left' : !user.joined, 'LobbyMember--cobrowser': isNavigatedToCobrowse})}>
    {user.username}
  </Button>
  {isDialogOpen && <Dialog open onClose={() => {
    setIsDialogOpen(false)
  }}>
    <div className="LobbyMember__dialog">
      {renderConnectionInfo()}
      <Divider></Divider>
      {!showUnlockedUI && <Button onClick={() => {
        setShowUnlockedUI(true)
      }}>Show Unlocked UI Tree</Button>}
      {showUnlockedUI && <UnlockableInterfaceTree experienceModelMongoId={lobbyInstance.experienceModelMongoId} userMongoId={userMongoId}></UnlockableInterfaceTree>}
    </div>
  </Dialog>}
  </span>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
  status: state.status,
  auth: state.auth,
  user: state.user,
  cobrowsing: state.cobrowsing,
});

export default compose(
  withRouter, 
  connect(mapStateToProps, { setCutAudio, setCutVideo })
)(LobbyMember);
