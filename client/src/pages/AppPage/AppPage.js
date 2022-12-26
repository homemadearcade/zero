/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Loader from '../../ui/Loader/Loader';

import { logInUserWithOauth, loadMe, authenticateSocket } from '../../store/actions/authActions';

import ErrorHandler from '../../ui/connected/ErrorHandler/ErrorHandler';

import { checkIfTabAlreadyOpen } from '../../utils/webPageUtils';
import ContextMenus from '../../game/cobrowsing/ContextMenus/ContextMenus';

import io from 'socket.io-client'
import { ON_GAME_INSTANCE_UPDATE } from '../../store/types';

const AppPage = ({ auth, loadMe, children }) => {
  const [isCheckingBrowser, setIsCheckingBrowser] = useState(true)

  useEffect(() => {
    // window.socket = io(window.location.host, { autoConnect: false })
    window.socket = io({
      closeOnBeforeunload: false // defaults to true
    })

    window.socket.onAny((event, ...args) => {
      if(event.indexOf('STATUS') >= 0 || event.indexOf(ON_GAME_INSTANCE_UPDATE) >= 0) return 
      console.log(event, args);
    });

    if(!window.chrome) {
      alert('Please use a Chromium browser such as Chrome or Brave')
      window.stop()
    } else {
      checkIfTabAlreadyOpen((isTabAlreadyOpen) => {
        if(isTabAlreadyOpen) {
          alert('Homemade Arcade is open in another tab. Please check all tabs you have open. This tab will now shutdown')
          window.stop()
        } else {
          setIsCheckingBrowser(false)
          loadMe();
        }
      })
    }

    return () => {
      window.socket.close()
    }
  }, []);

  return ( <>
      <ErrorHandler/>
      <ContextMenus/>
      {isCheckingBrowser && <Loader text="Checking Browser..."/>}
      {!auth.appLoaded && <Loader text="App Loading..."/>}
      {auth.appLoaded && children}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { authenticateSocket, logInUserWithOauth, loadMe }))(AppPage);
