import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Link from '../../components/ui/Link/Link';

import { logOutUser } from '../../store/actions/authActions';
import './Navbar.scss';
import { ADMIN_ROLE } from '../../constants';

const Navbar = ({ auth, logOutUser, history }) => {
  const onLogOut = (event) => {
    event.preventDefault();
    logOutUser(history);
  };

  return (
    <nav className="Navbar">
      <ul className="nav-links flex-1">
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/">Home</Link>
        </li>
        {auth.isAuthenticated ? (
          <>
            {auth.me?.role === ADMIN_ROLE && (
              <li className="nav-item">
                <Link ignoreDefaultStyle to="/users">Users</Link>
              </li>
            )}
            {auth.me?.role === ADMIN_ROLE && (
              <li className="nav-item">
                <Link ignoreDefaultStyle to="/lobbys">Lobbies</Link>
              </li>
            )}
            {null && auth.me?.role === ADMIN_ROLE && (
              <li className="nav-item">
                <Link ignoreDefaultStyle to="/admin">Admin</Link>
              </li>
            )}
            {auth.me?.role === ADMIN_ROLE && (
            <li className="nav-item">
              <Link ignoreDefaultStyle to="/games">Games</Link>
             </li>
            )}
            <li className="flex-1" />
            <li className="nav-item">
              <Link ignoreDefaultStyle to={`/${auth.me.username}`}>My Account</Link>
            </li>
          </>
        ) : (
          <>
            <li className="flex-1" />

            <li className="nav-item">
              <Link ignoreDefaultStyle to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { logOutUser }))(Navbar);
