import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';

const UserStatus = ({ onClick, userId, key, lobby: { lobby }, status : { lobbyUserStatus, cobrowsingMouse },  auth: {me} }) => {
  const userStatus = lobbyUserStatus[userId];
  const userCobrowsingStatus = cobrowsingMouse[userId]
  const user = lobby.users.filter(({id}) => {
    if(userId === id) {
      return true
    }
    return false;
  })[0]

  return <div key={key} onClick={() => {
    if(onClick) onClick(user)
  }} className={classnames("UserStatus", {'UserStatus--left' : !user.joined, 'UserStatus--clickable' : onClick})}>
    {user.username}
    {user.role === 'ADMIN' && <i className="UserStatus__admin fa-solid fa-crown"/>}
    
    {user.connected && <span className={classnames("UserStatus__connection", {'UserStatus__connection--bad' : userStatus?.pingDelta && userStatus.pingDelta > 150})}/>}
    {userStatus?.pingDelta > -1 && <span className="UserStatus__ping">{userStatus?.pingDelta}</span>}

    <div className="UserStatus__icons">
      <div className="UserStatus__fullscreen"><div className="UserStatus__icon"><i className="fa-solid fa-window-maximize"/></div>{(userStatus?.isFullscreen) ? 'Fullscreen' : 'Windowed'}</div>
      <div className="UserStatus__focus"><div className="UserStatus__icon"><i className="fa-solid fa-eye"/></div>{(!userStatus || userStatus?.isFocused) ? 'On Tab' : 'Away'}</div>
      <div className="UserStatus__cobrowsing"><div className="UserStatus__icon"><i className="fa-solid fa-arrow-pointer"/></div>{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s ago</span> : 'Never'}</div>
      <div className="UserStatus__upload"><div className="UserStatus__icon"><i className="fa-solid fa-upload"/></div>{(user.internetSpeedTestResults?.uploadSpeed) ? user.internetSpeedTestResults?.uploadSpeed : 'Not Tested'}</div>
      <div className="UserStatus__download"><div className="UserStatus__icon"><i className="fa-solid fa-download"/></div>{(user.internetSpeedTestResults?.downloadSpeed) ? user.internetSpeedTestResults?.downloadSpeed : 'Not Tested'}</div>
    </div>
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  status: state.status,
  auth: state.auth
});

export default connect(mapStateToProps, { })(UserStatus);
