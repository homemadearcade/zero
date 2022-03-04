import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';

const UserStatus = ({ user, key, lobby: { lobbyUserPings} }) => {
  const ping = lobbyUserPings[user.id];

  return <div key={key} className={classnames("UserStatus", {'UserStatus--left' : !user.joined})}>
    {user.username}
    <i className="UserStatus__admin fa-solid fa-crown"/>
    {user.connected && <span className={classnames("UserStatus__connection", {'UserStatus__connection--bad' : ping && ping > 60})}/>}
    {ping > -1 && <span className="UserStatus__ping">{ping}</span>}
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default connect(mapStateToProps, { })(UserStatus);
