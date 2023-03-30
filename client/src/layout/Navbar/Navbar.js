import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Link from '../../ui/Link/Link';

import { logOutUser } from '../../store/actions/user/authActions';
import './Navbar.scss';
import Button from '../../ui/Button/Button';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import { ADMIN_ROLE } from '../../constants';

const Navbar = ({ auth, logOutUser, history }) => {
  const onLogOut = (event) => {
    event.preventDefault();
    logOutUser(history);
  };

  const [viewAdmin, setViewAdmin] = useState()

  if(viewAdmin) return <AdminNavbar/>

  return (
    <nav className="Navbar">
      <ul className="nav-links flex-1">
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link ignoreDefaultStyle to="/buy-tickets">Buy Tickets</Link>
        </li>
        {auth.isAuthenticated && auth.isSocketAuthenticated ? (
          <>
            <li className="flex-1" />
            <li className="nav-item">
              <Link ignoreDefaultStyle to={`/user/${auth.me.username}`}>My Account</Link>
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
        {auth.me?.role === ADMIN_ROLE && <Button onClick={() => {
          setViewAdmin(true)
        }}>
          Admin
        </Button>}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { logOutUser }))(Navbar);
