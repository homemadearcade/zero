import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';
import Link from '../ui/Link/Link';
import AccordianList from '../ui/AccordianList/AccordianList';
import AgoraVolumeMeter from '../agora/AgoraVolumeMeter/AgoraVolumeMeter';
import { Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCrown, faArrowPointer, faDownload, faUpload, faVideo, faWindowMaximize } from '@fortawesome/free-solid-svg-icons'

const UserStatus = ({ myTracks, userTracks, titleOnly, hasJoinLink, titleChildren, userId, key, lobby: { lobby }, status : { lobbyUserStatus, cobrowsingMouse }, cobrowsing: { cobrowsingUser }, auth: {me} }) => {
  const userStatus = lobbyUserStatus[userId];
  const userCobrowsingStatus = cobrowsingMouse[userId]
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

  function renderTitle() {
    return <div className="UserStatus__title">
      <div className="UserStatus__username">{user.username}{isMe && ' (me)'}</div>
      <div className={classnames("UserStatus__connection", {'UserStatus__connection--bad' : userStatus?.pingDelta && userStatus.pingDelta > 150, 'UserStatus__connection--none': !user.connected})}/>
      <div className="UserStatus__ping">{userStatus?.pingDelta > -1 ? userStatus?.pingDelta : 0}</div>
      {user.role === 'ADMIN' && <div className="UserStatus__admin"><FontAwesomeIcon icon={faCrown}/></div>}
      {(hasJoinLink) && <Link to={`/lobby/${lobby.id}/join/${user.id}`}>
        {isMe ? 'Play' : 'Join'}
      </Link>}
      {titleChildren}
    </div>
  }

  if(titleOnly) return <Paper variant="outlined"><div className="UserStatus UserStatus--title-only">{renderTitle()}</div></Paper>

  return <div key={key} className={classnames("UserStatus", {'UserStatus--left' : !user.joined, 'UserStatus--cobrowser': cobrowsingUser.id === userId})}>
    {userTracksById && userTracksById[user.id] && <AgoraVolumeMeter audioTrack={userTracksById[user.id].audioTrack}/>}
    <AccordianList accordians={[{
      id: user.id,
      title: renderTitle(),
      body: <div className="UserStatus__icons">
        <div className="UserStatus__fullscreen"><div className="UserStatus__icon"><FontAwesomeIcon icon={faWindowMaximize}/></div>{(userStatus?.isFullscreen) ? 'Fullscreen' : 'Windowed'}</div>
        <div className="UserStatus__focus"><div className="UserStatus__icon"><FontAwesomeIcon icon={faEye}/></div>{(!userStatus || userStatus?.isFocused) ? 'On Tab' : 'Away'}</div>
        <div className="UserStatus__cobrowsing"><div className="UserStatus__icon"><FontAwesomeIcon icon={faArrowPointer}/></div>{userCobrowsingStatus ? <div>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s ago</div> : 'Never'}</div>
        <div className="UserStatus__upload"><div className="UserStatus__icon"><FontAwesomeIcon icon={faUpload}/></div>{(user.internetSpeedTestResults?.uploadSpeed) ? user.internetSpeedTestResults?.uploadSpeed : 'Not Tested'}</div>
        <div className="UserStatus__download"><div className="UserStatus__icon"><FontAwesomeIcon icon={faDownload}/></div>{(user.internetSpeedTestResults?.downloadSpeed) ? user.internetSpeedTestResults?.downloadSpeed : 'Not Tested'}</div>
        <div className="UserStatus__video-call"><div className="UserStatus__icon"><FontAwesomeIcon icon={faVideo}/></div>{userTracksById && userTracksById[user.id] ? 'Connected' : 'Not Connected'}</div></div>
    }]}/>
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  status: state.status,
  auth: state.auth,
  cobrowsing: state.cobrowsing
});

export default connect(mapStateToProps, { })(UserStatus);
