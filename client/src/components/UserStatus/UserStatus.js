import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';

const UserStatus = ({ onClick, user, key, lobby: { lobbyUserStatus, cobrowsingMouse } }) => {
  const userStatus = lobbyUserStatus[user.id];
  const userCobrowsingStatus = cobrowsingMouse[user.id]

  return <div key={key} onClick={() => {
    onClick(user)
  }} className={classnames("UserStatus", {'UserStatus--left' : !user.joined, 'UserStatus--clickable' : onClick})}>
    {user.username}
    {user.role === 'ADMIN' && <i className="UserStatus__admin fa-solid fa-crown"/>}

    {user.connected && <span className={classnames("UserStatus__connection", {'UserStatus__connection--bad' : userStatus?.pingDelta && userStatus.pingDelta > 60})}/>}
    {userStatus?.pingDelta > -1 && <span className="UserStatus__ping">{userStatus?.pingDelta}</span>}

    <div className="UserStatus__focus">{(!userStatus || userStatus?.isFocused) ? 'F' : 'NF'}</div>
    <div className="UserStatus__cobrowsing">{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s</span> : 'never'}</div>
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default connect(mapStateToProps, { })(UserStatus);
