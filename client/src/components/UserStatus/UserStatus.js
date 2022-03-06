import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';

const UserStatus = ({ onClick, userId, key, lobby: { lobby, lobbyUserStatus, cobrowsingMouse } }) => {
  const userStatus = lobbyUserStatus[userId];
  const userCobrowsingStatus = cobrowsingMouse[userId]
  const user = lobby.users.filter(({id}) => {
    if(userId === id) {
      return true
    }
    return false;
  })[0]

  return <div key={key} onClick={() => {
    onClick(user)
  }} className={classnames("UserStatus", {'UserStatus--left' : !user.joined, 'UserStatus--clickable' : onClick})}>
    {user.username}
    {user.role === 'ADMIN' && <i className="UserStatus__admin fa-solid fa-crown"/>}

    <div className="UserStatus__fullscreen">{(userStatus?.isFullscreen) ? 'FS' : 'W'}</div>

    {user.connected && <span className={classnames("UserStatus__connection", {'UserStatus__connection--bad' : userStatus?.pingDelta && userStatus.pingDelta > 60})}/>}
    {userStatus?.pingDelta > -1 && <span className="UserStatus__ping">{userStatus?.pingDelta}</span>}

    <div className="UserStatus__focus">{(!userStatus || userStatus?.isFocused) ? 'HERE' : 'AWAY'}</div>
    <div className="UserStatus__cobrowsing">{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s</span> : 'never'}</div>
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default connect(mapStateToProps, { })(UserStatus);
