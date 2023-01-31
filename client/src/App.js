/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import './utils/webPageUtils'

// import Cookies from 'js-cookie';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import GamesPage from './pages/GamesPage/GamesPage';
import PlayGamePage from './pages/PlayGamePage/PlayGamePage';
import EditGamePage from './pages/EditGamePage/EditGamePage';

import HomemadeArcadePage from './pages/HomemadeArcadePage/HomemadeArcadePage';
import Account from './pages/User/User';
import UserListPage from './pages/UserListPage/UserListPage';
import Admin from './pages/Admin/Admin';
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

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

window.awsUrl = window.location.origin + "/api/aws/" //'https://homemadearcade.s3-us-west-1.amazonaws.com/'

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
    MuiLink: {
      //   styleOverrides: {
      //     root: {
      //       margin: 'unset',
      //     }
      //   }
      defaultProps: {
        component: LinkBehavior,
      },
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
          minHeight: '0rem'
        },
        content: {
          marginTop: '.75rem',
          marginBottom: '.75rem',
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
      defaultProps: {
        LinkComponent: LinkBehavior,
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

const App = ({ }) => {
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
          <Route path="/edit/:gameId" children={wrapComponentInApp(EditGamePage)} />
          <Route path="/play/:gameId" children={wrapComponentInApp(PlayGamePage)} />
          <Route path="/login" children={wrapComponentInApp(Login)} />
          <Route path="/register" children={wrapComponentInApp(Register)} />
          <Route path="/users" children={wrapComponentInApp(UserListPage)} />
          <Route path="/interface" children={wrapComponentInApp(InterfaceListPage)} />
          <Route path="/notfound" children={wrapComponentInAppIfAuthenticated(NotFound)} />
          <Route path="/admin" children={wrapComponentInApp(Admin)} />
          <Route path="/lobbys" children={wrapComponentInApp(Lobbys)} />
          <Route path="/lobby/:id" children={wrapComponentInApp(LobbyPage)} />
          <Route exact path="/:username" children={wrapComponentInApp(Account)} />
          <Route path="/OAuthSuccess" children={wrapComponentInApp(HomemadeArcadePage)} />
          <Route exact path="/" children={wrapComponentInAppIfAuthenticated(HomemadeArcadePage)} />
          <Route children={wrapComponentInAppIfAuthenticated(NotFound)} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = () => ({});

export default compose(connect(mapStateToProps, {}))(App);
