import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Link from '../../ui/Link/Link';

import './AdminNavbar.scss';
import { ADMIN_ROLE } from '../../game/constants';

const AdminNavbar = ({ auth, history }) => {
  if(auth.me?.role !== ADMIN_ROLE) return null

  return (
    <nav className="Navbar">
      <ul className="nav-links flex-1">
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/users">Users</Link>
        </li>
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/lobbys">Lobbies</Link>
        </li>
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/games">Games</Link>
          </li>
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/calendar">Calendar</Link>
          </li>
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/interface">Interface</Link>
        </li>
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { }))(AdminNavbar);
