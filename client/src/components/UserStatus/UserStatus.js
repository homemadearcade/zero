import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';

const UserStatus = ({ user }) => {
  return <div className={classnames("UserStatus", {'UserStatus--left' : !user.joined})}>
    {user.username}
    {user.connected && <span className="UserStatus__connection"/>}
  </div>
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { })(UserStatus);
