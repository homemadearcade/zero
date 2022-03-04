import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';

const UserStatus = ({ user, key, lobby: { lobbyUserStatus} }) => {
  const userStatus = lobbyUserStatus[user.id];

  return <div key={key} className={classnames("UserStatus", {'UserStatus--left' : !user.joined})}>
    {user.username}
    {user.role === 'ADMIN' && <i className="UserStatus__admin fa-solid fa-crown"/>}
    <div className="UserStatus__focus">{(!userStatus || userStatus?.isFocused) ? 'F' : 'NF'}</div>
    {user.connected && <span className={classnames("UserStatus__connection", {'UserStatus__connection--bad' : userStatus?.pingDelta && userStatus.pingDelta > 60})}/>}
    {userStatus?.pingDelta > -1 && <span className="UserStatus__ping">{userStatus?.pingDelta}</span>}
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default connect(mapStateToProps, { })(UserStatus);
