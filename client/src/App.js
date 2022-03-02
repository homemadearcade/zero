/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Play from './pages/Play/Play';
import Home from './pages/Home/Home';
import Account from './pages/User/User';
import Users from './pages/Users/Users';
import Admin from './pages/Admin/Admin';
import Lobbys from './pages/Lobbys/Lobbys';
import Lobby from './pages/Lobby/Lobby';
import NotFound from './pages/NotFound/NotFound';
import SessionLogin from './pages/LoginSession/LoginSession';
import LobbyFind from './pages/LobbyFind/LobbyFind';


import Loader from './components/Loader/Loader';

import { logInUserWithOauth, loadMe, loginSocket } from './store/actions/authActions';

import io from 'socket.io-client'
// window.socket = io(window.location.host, { autoConnect: false })
window.socket = io()

const App = ({ logInUserWithOauth, loginSocket, auth, loadMe }) => {
  useEffect(() => {
    loadMe();
    loginSocket();
  }, [loadMe]);

  useEffect(() => {
    if (window.location.hash === '#_=_') window.location.hash = '';

    const cookieJwt = Cookies.get('x-auth-cookie');
    if (cookieJwt) {
      Cookies.remove('x-auth-cookie');
      logInUserWithOauth(cookieJwt);
    }
  }, []);

  useEffect(() => {
    if (!auth.appLoaded && !auth.isLoading && auth.token && !auth.isAuthenticated) {
      loadMe();
      loginSocket();
    }
  }, [auth.isAuthenticated, auth.token, loadMe, auth.isLoading, auth.appLoaded]);

  return (
    <>
        {!auth.appLoaded && <Loader/>}
        <Switch>
          <Route exact path="/play" component={Play} />
          <Route path="/login" component={Login} />
          <Route path="/loginsession" component={SessionLogin} />
          <Route path="/register" component={Register} />
          <Route path="/users" component={Users} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/admin" component={Admin} />
          <Route path="/lobbys" component={Lobbys} />
          <Route path="/lobby/find" component={LobbyFind} />
          <Route path="/lobby/:id" component={Lobby} />
          <Route exact path="/:username" component={Account} />
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { loginSocket, logInUserWithOauth, loadMe }))(App);
