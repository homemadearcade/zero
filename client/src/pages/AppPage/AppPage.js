/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import Dialog from '../../ui/Dialog/Dialog';
import UserSpeedTestRequest from '../../app/user/UserSpeedTestRequest/UserSpeedTestRequest';
import { inIframe } from '../../utils/webPageUtils';

const AppPage = ({ auth, loadMe, children, history, logInUserWithOauth }) => {
  const [needsSpeedTest, setNeedsSpeedTest] = useState()

  useEffect(() => {
    if(auth.me && !window.location.pathname.indexOf('lobby/') >= 0) {
      if(auth.me?.speedTests?.length < 10) {
        setNeedsSpeedTest(true)
      }
    }
  }, [auth.me])

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
      console.log(event, args, inIframe());
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
      {needsSpeedTest && 
        <Dialog open>
          <UserSpeedTestRequest isOptional onContinue={() => {
            setNeedsSpeedTest(false)
          }}/>
        </Dialog>
      }
      {renderBody()}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { logInUserWithOauth, loadMe }))(AppPage);
