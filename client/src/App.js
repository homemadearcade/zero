/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
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
import UserPage from './pages/UserPage/UserPage';
import UserListPage from './pages/UserListPage/UserListPage';
import Lobbys from './pages/LobbyListPage/LobbyListPage';
import LobbyPage from './pages/LobbyPage/LobbyPage';
import NotFound from './pages/NotFound/NotFound';
import './events.js'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import WishLabsPage from './pages/WishLabsPage/WishLabsPage';
import AppPage from './pages/AppPage/AppPage';

import './App.scss'
import HATicketsPage from './pages/HATicketsPage/HATicketsPage';
import TicketedEventCalendarPage from './pages/TicketedEventCalendarPage/TicketedEventCalendarPage';
import store from './store';
import InterfaceListPage from './pages/InterfaceListPage/InterfaceListPage';
import ArcadePage from './pages/ArcadePage/ArcadePage';

window.awsUrl = window.location.origin + '/api/aws/' //'https://homemadearcade.s3-us-west-1.amazonaws.com/'

const themeDefaults = {
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
    MuiLink: {
      //   styleOverrides: {
      //     root: {
      //       margin: 'unset',
      //     }
      //   }
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({

          ...(ownerState.font === '2P' && {
            fontFamily: "'Press Start 2P', sans-serif;"
          }),

          ...(ownerState.font === 'Wish' && {
            fontFamily: "'Wish', serif;"
          })

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
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: '0rem',
          paddingLeft: '.75rem',
          paddingRight: '.75rem'
        },
        content: {
          marginTop: '.25rem',
          marginBottom: '.25rem',
          textAlign: 'left'
        }
      }
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
            height: '100%',
          }),

          ...(ownerState.size === 'xs' && {
            padding: '.5rem',
            lineHeight: 'normal',
            margin: '.2rem',
            minWidth: 'auto',
            display: 'flex',
            alignSelf: 'middle',
            height: 'auto'
         }),

          ...(ownerState.size === 'tiny' && {
            lineHeight: 'normal',
            padding: '0rem',
            margin: '.2rem',
            minWidth: 'auto',
            display: 'flex',
            alignSelf: 'middle',
            height: '1rem',
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
    },
  },
};

const App = ({ theme: { primaryColor } }) => {
  const theme = React.useMemo(
    () =>
      createTheme({
        ...themeDefaults,
        palette: {
          ...themeDefaults.palette,
          primary: { 
            main: primaryColor,
          },
        },
      }),
    [primaryColor],
  );

  const wrapComponentInApp = (Component) => (props) => {
    return <AppPage>
      <Component {...props} />
    </AppPage>
  }

  const wrapComponentInAppIfAuthenticated = (Component) => (props) => {
    const auth = store.getState().auth

    if(auth.isAuthenticated && auth.isSocketAuthenticated) {
      return <AppPage>
        <Component {...props} />
      </AppPage>
    } return <Component {...props}/>
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/wishlabs" children={wrapComponentInAppIfAuthenticated(WishLabsPage)}/>
          <Route path="/buy-tickets" children={wrapComponentInAppIfAuthenticated(HATicketsPage)}/>
          <Route path="/calendar" children={wrapComponentInApp(TicketedEventCalendarPage)} />
          <Route path="/games" children={wrapComponentInApp(GamesPage)} />
          <Route path="/arcade" children={wrapComponentInApp(ArcadePage)} />
          <Route path="/edit/:gameId" children={wrapComponentInApp(EditGamePage)} />
          <Route path="/play/:gameId" children={wrapComponentInApp(PlayGamePage)} />
          <Route path="/login" children={wrapComponentInApp(Login)} />
          <Route path="/register" children={wrapComponentInApp(Register)} />
          <Route path="/users" children={wrapComponentInApp(UserListPage)} />
          <Route path="/interface" children={wrapComponentInApp(InterfaceListPage)} />
          <Route path="/notfound" children={wrapComponentInAppIfAuthenticated(NotFound)} />
          <Route path="/lobbys" children={wrapComponentInApp(Lobbys)} />
          <Route path="/lobby/:id" children={wrapComponentInApp(LobbyPage)} />
          <Route exact path="/user/:username" children={wrapComponentInApp(UserPage)} />
          <Route path="/OAuthSuccess" children={wrapComponentInApp(HomemadeArcadePage)} />
          <Route exact path="/" children={wrapComponentInAppIfAuthenticated(HomemadeArcadePage)} />
          <Route children={wrapComponentInAppIfAuthenticated(NotFound)} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme
});

export default compose(connect(mapStateToProps, {}))(App);
