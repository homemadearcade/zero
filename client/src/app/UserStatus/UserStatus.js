import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';
import Link from '../ui/Link/Link';
import AccordianList from '../ui/AccordianList/AccordianList';
import AgoraVolumeMeter from '../agora/AgoraVolumeMeter/AgoraVolumeMeter';

const UserStatus = ({ myTracks, userTracks, hasJoinLink, userId, key, lobby: { lobby }, status : { lobbyUserStatus, cobrowsingMouse }, cobrowsing: { cobrowsingUser }, auth: {me} }) => {
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

  return <div key={key} className={classnames("UserStatus", {'UserStatus--left' : !user.joined, 'UserStatus--cobrowser': cobrowsingUser.id === userId})}>
    {userTracksById && userTracksById[user.id] && <AgoraVolumeMeter audioTrack={userTracksById[user.id].audioTrack}/>}
    <AccordianList accordians={[{
      id: user.id,
      title: <span className="UserStatus__title">
        <span className="UserStatus__username">{user.username}{isMe && ' (me)'}</span>
        <span className={classnames("UserStatus__connection", {'UserStatus__connection--bad' : userStatus?.pingDelta && userStatus.pingDelta > 150, 'UserStatus__connection--none': !user.connected})}/>
        <span className="UserStatus__ping">{userStatus?.pingDelta > -1 ? userStatus?.pingDelta : 0}</span>
        {user.role === 'ADMIN' && <i className="UserStatus__admin fa-solid fa-crown"/>}
        {(hasJoinLink || true) && <Link to={`/lobby/${lobby.id}/join/${user.id}`}>
          {isMe ? 'Play' : 'Join'}
        </Link>}
      </span>,
      body: <span className="UserStatus__icons">
        <span className="UserStatus__fullscreen"><span className="UserStatus__icon"><i className="fa-solid fa-window-maximize"/></span>{(userStatus?.isFullscreen) ? 'Fullscreen' : 'Windowed'}</span>
        <span className="UserStatus__focus"><span className="UserStatus__icon"><i className="fa-solid fa-eye"/></span>{(!userStatus || userStatus?.isFocused) ? 'On Tab' : 'Away'}</span>
        <span className="UserStatus__cobrowsing"><span className="UserStatus__icon"><i className="fa-solid fa-arrow-pointer"/></span>{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s ago</span> : 'Never'}</span>
        <span className="UserStatus__upload"><span className="UserStatus__icon"><i className="fa-solid fa-upload"/></span>{(user.internetSpeedTestResults?.uploadSpeed) ? user.internetSpeedTestResults?.uploadSpeed : 'Not Tested'}</span>
        <span className="UserStatus__download"><span className="UserStatus__icon"><i className="fa-solid fa-download"/></span>{(user.internetSpeedTestResults?.downloadSpeed) ? user.internetSpeedTestResults?.downloadSpeed : 'Not Tested'}</span>
        <span className="UserStatus__video-call"><span className="UserStatus__icon"><i className="fa-solid fa-video"/></span>{userTracksById && userTracksById[user.id] ? 'Connected' : 'Not Connected'}</span></span>
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
