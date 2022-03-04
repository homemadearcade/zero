import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './UserStatus.scss';

const UserStatus = ({ user, key }) => {
  return <div key={key} className={classnames("UserStatus", {'UserStatus--left' : !user.joined})}>
    {user.username}
    <i className="UserStatus__admin fa-solid fa-crown"/>
    {user.connected && <span className="UserStatus__connection"/>}
  </div>
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { })(UserStatus);
