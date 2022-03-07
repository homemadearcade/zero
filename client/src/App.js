/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import Cookies from 'js-cookie';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Play from './pages/Play/Play';
import Home from './pages/Home/Home';
import Account from './pages/User/User';
import Users from './pages/Users/Users';
import Admin from './pages/Admin/Admin';
import Lobbys from './pages/Lobbys/Lobbys';
import Lobby from './pages/LobbyPage/LobbyPage';
import NotFound from './pages/NotFound/NotFound';
import SessionLogin from './pages/LoginSession/LoginSession';
import LobbyFind from './pages/LobbyFind/LobbyFind';
import './events.js'

import Loader from './components/Loader/Loader';

import AgoraVideoCall from './components/AgoraVideoCall/AgoraVideoCall';
import VideoLayoutHA from './components/VideoLayoutHA/VideoLayoutHA';

import { logInUserWithOauth, loadMe, authenticateSocket } from './store/actions/authActions';

import '@fortawesome/fontawesome-free/js/all.js';


import io from 'socket.io-client'
// window.socket = io(window.location.host, { autoConnect: false })
window.socket = io()

window.socket.onAny((event, ...args) => {
  if(event.indexOf('STATUS')) return 
  console.log(event, args);
});

const App = ({ logInUserWithOauth, authenticateSocket, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, auth, video, loadMe }) => {
  useEffect(() => {
    loadMe();
  }, [loadMe]);

  // useEffect(() => {
  //   if (window.location.hash === '#_=_') window.location.hash = '';

  //   const cookieJwt = Cookies.get('x-auth-cookie');
  //   if (cookieJwt) {
  //     Cookies.remove('x-auth-cookie');
  //     logInUserWithOauth(cookieJwt);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!auth.appLoaded && !auth.isLoading && auth.token && !auth.isAuthenticated && !auth.isSocketAuthenticated) {
  //     loadMe();
  //     authenticateSocket();
  //   }
  // }, [auth.isAuthenticated, auth.token, loadMe, auth.isLoading, auth.appLoaded, auth.isSocketAuthenticated]);

  return (
    <>
        {!auth.appLoaded && <Loader/>}
        {auth.appLoaded && <>
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
        {(video.isStarting || video.isConnected) && <AgoraVideoCall
            render={(props) => <VideoLayoutHA {...props}/>}
          />}
      </>}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video
});

export default compose(connect(mapStateToProps, { authenticateSocket, logInUserWithOauth, loadMe }))(App);
