/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import Cookies from 'js-cookie';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import GamesPage from './pages/GamesPage/GamesPage';
import PlayGamePage from './pages/PlayGamePage/PlayGamePage';
import EditGamePage from './pages/EditGamePage/EditGamePage';

import HomemadeArcadePage from './pages/HomemadeArcadePage/HomemadeArcadePage';
import Account from './pages/User/User';
import Users from './pages/Users/Users';
import Admin from './pages/Admin/Admin';
import Lobbys from './pages/LobbyListPage/LobbyListPage';
import LobbyPage from './pages/LobbyPage/LobbyPage';
import NotFound from './pages/NotFound/NotFound';
import './events.js'

import Loader from './app/ui/Loader/Loader';

import { logInUserWithOauth, loadMe, authenticateSocket } from './store/actions/authActions';

import io from 'socket.io-client'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorHandler from './app/ui/ErrorHandler/ErrorHandler';
import { ON_GAME_INSTANCE_UPDATE } from './store/types';

import { checkIfTabAlreadyOpen } from './utils/webPageUtils';
import ContextMenus from './app/cobrowsing/ContextMenus/ContextMenus';

window.awsUrl = 'https://homemadearcade.s3-us-west-1.amazonaws.com/'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  shape: {
    borderRadius: 0
  },
  components: {
    // MuiRadio: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: 0
    //     }
    //   }
    // },
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.font === '2P' && {
            fontFamily: "'Press Start 2P', sans-serif;"
          }),
        }),
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '.6rem 0'
        },
        thumb: {
          borderRadius: 0,
          width: '1rem',
          height: '1rem',
        },
        valueLabel: {
          borderRadius: 0
        },
        track: {
          border: 'none'
        },
        mark: {
          height: '4px',
          borderRadius: 0
        },
        markActive: {
          height: '6px',
        }
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          borderRadius: 0,
          // width: '1rem',
          // height: '1rem',
        },
        track: {
          // height: '.4rem',
          borderRadius: 0,
        },
        switchBase: {
          borderRadius: 0
        },
        // root: {
        //   paddingTop: '1rem',
        //   paddingBottom: '1rem'
        // }
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: 0
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === 'fit' && {
            width: '100%',
            lineHeight: 'normal',
            padding: '0',
            minWidth: 'auto',
            display: 'flex',
            alignSelf: 'middle',
            height: '100%'
          }),
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0px',
        }
      }
    }
  },
});

// window.socket = io(window.location.host, { autoConnect: false })
window.socket = io({
  closeOnBeforeunload: false // defaults to true
})

window.socket.onAny((event, ...args) => {
  if(event.indexOf('STATUS') >= 0 || event.indexOf(ON_GAME_INSTANCE_UPDATE) >= 0) return 
  console.log(event, args);
});

const App = ({ logInUserWithOauth, authenticateSocket, auth, loadMe }) => {
  const [isCheckingBrowser, setIsCheckingBrowser] = useState(true)

  useEffect(() => {
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
  }, []);

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
    <ThemeProvider theme={theme}>
      <>
        <ErrorHandler/>
        <ContextMenus/>
        {isCheckingBrowser && <Loader text="Checking Browser..."/>}
        {!auth.appLoaded && <Loader text="App Loading..."/>}
        {auth.appLoaded && <Router>
          <Switch>
            <Route path="/games" component={GamesPage} />
            <Route path="/edit/:gameId" component={EditGamePage} />
            <Route path="/play/:gameId" component={PlayGamePage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/users" component={Users} />
            <Route path="/notfound" component={NotFound} />
            <Route path="/admin" component={Admin} />
            <Route path="/lobbys" component={Lobbys} />
            <Route path="/lobby/:id" component={LobbyPage} />
            <Route exact path="/:username" component={Account} />
            <Route exact path="/" component={HomemadeArcadePage} />
            <Route component={NotFound} />
          </Switch>
        </Router>}
      </>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { authenticateSocket, logInUserWithOauth, loadMe }))(App);
