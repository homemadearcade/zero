/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Loader from '../../ui/Loader/Loader';

import { logInUserWithOauth, loadMe } from '../../store/actions/authActions';

import ErrorHandler from '../../ui/connected/ErrorHandler/ErrorHandler';
import SnackbarHandler from '../../ui/connected/SnackbarHandler/SnackbarHandler';

import Cookies from 'js-cookie';
import ContextMenus from '../../game/cobrowsing/ContextMenus/ContextMenus';

import io from 'socket.io-client'
import { ON_GAME_INSTANCE_UPDATE } from '../../store/types';
import { withRouter } from 'react-router-dom';

const AppPage = ({ auth, loadMe, children, history, logInUserWithOauth }) => {
  useEffect(() => {
    // window.socket = io(window.location.host, { autoConnect: false })
    if(!window.socket) {
      window.socket = io({
        autoConnect: false,
        closeOnBeforeunload: false // defaults to true
      })
    }

    window.socket.onAny((event, ...args) => {
      if(event.indexOf('STATUS') >= 0 || event.indexOf(ON_GAME_INSTANCE_UPDATE) >= 0) return 
      console.log(event, args);
    });

    const cookieJwt = Cookies.get('x-auth-cookie');
    if (cookieJwt) {
      Cookies.remove('x-auth-cookie');
      logInUserWithOauth(cookieJwt, history);
    } else if(!auth.isAuthenticated || !auth.isSocketAuthenticated) {
      loadMe();
    }

    return () => {
      window.socket.close()
    }
  }, []);

  function renderBody() {
    if(auth.appLoaded) {
      return children
    } else {
      return <Loader text="App Loading..."/>
    }
  }

  return ( <>
      <ErrorHandler/>
      <SnackbarHandler/>
      <ContextMenus/>
      {renderBody()}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { logInUserWithOauth, loadMe }))(AppPage);
