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

import { ThemeProvider, createTheme } from '@mui/material/styles';
import WishLabsPage from './pages/WishLabsPage/WishLabsPage';
import AppPage from './pages/AppPage/AppPage';

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
    // MuiLink: {
    //   styleOverrides: {
    //     root: {
    //       margin: 'unset',
    //     }
    //   }
    // },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0px',
        }
      }
    }
  },
});


const App = ({ }) => {
  const wrapComponentInApp = (Component) => (props) => {
    return <AppPage>
      <Component {...props} />
    </AppPage>
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/wishlabs" component={WishLabsPage}/>
          <Route path="/games" children={wrapComponentInApp(GamesPage)} />
          <Route path="/edit/:gameId" children={wrapComponentInApp(EditGamePage)} />
          <Route path="/play/:gameId" children={wrapComponentInApp(PlayGamePage)} />
          <Route path="/login" children={wrapComponentInApp(Login)} />
          <Route path="/register" children={wrapComponentInApp(Register)} />
          <Route path="/users" children={wrapComponentInApp(Users)} />
          <Route path="/notfound" children={<NotFound/>} />
          <Route path="/admin" children={wrapComponentInApp(Admin)} />
          <Route path="/lobbys" children={wrapComponentInApp(Lobbys)} />
          <Route path="/lobby/:id" children={wrapComponentInApp(LobbyPage)} />
          <Route exact path="/:username" children={wrapComponentInApp(Account)} />
          <Route exact path="/" component={HomemadeArcadePage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = () => ({});

export default compose(connect(mapStateToProps, {}))(App);
