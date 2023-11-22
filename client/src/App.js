/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import Cookies from 'js-cookie';

import GamesPage from './pages/GamesPage/GamesPage';
import PlayGamePage from './pages/PlayGamePage/PlayGamePage';
import EditGamePage from './pages/EditGamePage/EditGamePage';

import HomemadeArcadePage from './pages/HomemadeArcadePage/HomemadeArcadePage';
import UserPage from './pages/UserPage/UserPage';
import UserListPage from './pages/UserListPage/UserListPage';
import Lobbys from './pages/LobbyListPage/LobbyListPage';
import LobbyPage from './pages/LobbyPage/LobbyPage';
import NotFound from './pages/NotFound/NotFound';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import WishLabsPage from './pages/WishLabsPage/WishLabsPage';
import AppPage from './pages/AppPage/AppPage';

import './App.scss'
import HATicketsPage from './pages/HATicketsPage/HATicketsPage';
import TicketedEventCalendarPage from './pages/TicketedEventCalendarPage/TicketedEventCalendarPage';
import store from './store';
import InterfaceListPage from './pages/InterfaceListPage/InterfaceListPage';
import ArcadePage from './pages/ArcadePage/ArcadePage';
import ExperienceCreatorPage from './pages/ExperienceCreatorPage/ExperienceCreatorPage';
import ExperiencesPage from './pages/ExperiencesPage/ExperiencesPage';
import AppSettingsPage from './pages/AppSettingsPage/AppSettingsPage';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import QRPage from './pages/QRPage/QRPage';
import InternetSpeedTestPage from './pages/InternetSpeedTestPage/InternetSpeedTestPage';
import UserCreationsPage from './pages/UserCreationsPage/UserCreationsPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Forgot from './auth/Forgot/Forgot';
import Reset from './auth/Reset/Reset';

window.awsUrl = window.location.origin + '/api/aws/' //'https://homemadearcade.s3-us-west-1.amazonaws.com/'

export const RecoveryContext = createContext();

const themeDefaults = {
  palette: {
    mode: 'dark',
  },
  shape: {
    borderRadius: 0
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          paddingRight: '4px'
        }
      }
    },
    MuiLink: {
      //   styleOverrides: {
      //     root: {
      //       margin: 'unset',
      //     }
      //   }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.5em'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: '1.5em'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '6em'
        },
        h2: {
          fontSize: '3.37em'
        },
        h3: {
          fontSize: '3em'
        },
        h4: {
          fontSize: '2.125em'
        },
        h5: {
          fontSize: '1.5em'
        },
        h6: {
          fontSize: '1.25em'
        },
        subtitle1: {
          fontSize: '1em'
        },
        subtitle2: {
          fontSize: '0.875em'
        },
        body1: {
          fontSize: '1em'
        },
        body2: {
          fontSize: '0.875em'
        },
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
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '1em'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1em',
        },
        root: {
          marginTop: '0.25em',
          marginBottom: '0.25em'
        },
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '.6em 0'
        },
        thumb: {
          borderRadius: 0,
          width: '1em',
          height: '1em',
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
    MuiList: {
      styleOverrides: {
        root: {
          padding: '0'
        },
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '0 .5em',
        },
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          position: 'absolute'
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '2.5em',
          height: '1.5em',
          padding: '0.3em',
        },
        thumb: {
          borderRadius: 0,
          width: '1em !important',
          height: '1em !important',
        },
        track: {
          // height: '.4em',
          borderRadius: 0,
        },
        switchBase: {
          borderRadius: 0
        },
        // root: {
        //   paddingTop: '1em',
        //   paddingBottom: '1em'
        // }
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '3.5em',
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '.875em',
          paddingLeft: '.75em',
          paddingRight: '.75em',
          paddingTop: '.75em',
          paddingBottom: '.6em',
          minHeight: '3.5em'
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: '0em',
          paddingLeft: '.75em',
          paddingRight: '.75em'
        },
        content: {
          marginTop: '.25em',
          marginBottom: '.25em',
          textAlign: 'left'
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontSize: '1em'
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        text: {
          fontSize: '.875em'
        },
        // startIcon: {
        //   fontSize: '.0875em !important'
        // },
        // endIcon: {
        //   fontSize: '.0875em !important'
        // },
        
        outlined: {
          fontSize: '.875em'
        },
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === 'wide' && {
            width: '100%',
          }),
          
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
            padding: '.5em',
            lineHeight: 'normal',
            margin: '.2em',
            minWidth: 'auto',
            display: 'flex',
            alignSelf: 'middle',
            height: 'auto'
         }),

          ...(ownerState.size === 'tiny' && {
            lineHeight: 'normal',
            padding: '0em',
            margin: '.2em',
            minWidth: 'auto',
            display: 'flex',
            alignSelf: 'middle',
            height: '1em',
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

  // useEffect(() => {
  //   let gamepadIndex;
  //   window.addEventListener('gamepadconnected', (event) => {
  //     gamepadIndex = event.gamepad.index;
  //   });

  //   setInterval(() => {
  //     if(gamepadIndex !== undefined) {
  //       // a gamepad is connected and has an index
  //       const myGamepad = navigator.getGamepads()[gamepadIndex];
  //       document.body.innerHTML = ""; // reset page
  //       myGamepad.buttons.map(e => e.pressed).forEach((isPressed, buttonIndex) => {
  //         if(isPressed) {
  //           console.log(`Button ${buttonIndex} is pressed`)
  //           // button is pressed; indicate this on the page
  //         }
  //       })
  //     }
  //   }, 100) // print buttons that are pressed 10 times per second
  // }, [])

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/qr" children={<QRPage/>}/>
          <Route path="/forgot" children={<Forgot/>}/>
          <Route path="/reset/:code" children={<Reset/>}/>
          <Route path="/wishlabs" children={wrapComponentInAppIfAuthenticated(WishLabsPage)}/>
          <Route path="/buy-tickets" children={wrapComponentInAppIfAuthenticated(HATicketsPage)}/>
          <Route path="/speed-test" children={wrapComponentInApp(InternetSpeedTestPage)} />
          <Route path="/calendar" children={wrapComponentInApp(TicketedEventCalendarPage)} />
          <Route path="/games" children={wrapComponentInApp(GamesPage)} />
          <Route path="/arcade" children={wrapComponentInApp(ArcadePage)} />
          <Route path="/edit/:arcadeGameMongoId" children={wrapComponentInApp(EditGamePage)} />
          <Route path="/play/:arcadeGameMongoId" children={wrapComponentInApp(PlayGamePage)} />
          <Route path="/login" children={wrapComponentInApp(LoginPage)} />
          <Route path="/register" children={wrapComponentInApp(RegisterPage)} />
          <Route path="/users" children={wrapComponentInApp(UserListPage)} />
          <Route path="/interface" children={wrapComponentInApp(InterfaceListPage)} />
          <Route path="/notfound" children={wrapComponentInAppIfAuthenticated(NotFound)} />
          <Route path="/lobbys" children={wrapComponentInApp(Lobbys)} />
          <Route path="/experiences" children={wrapComponentInApp(ExperiencesPage)} />
          <Route path="/app-settings" children={wrapComponentInApp(AppSettingsPage)} />
          <Route path="/experience/:experienceModelMongoId" children={wrapComponentInApp(ExperienceCreatorPage)} />
          <Route path="/lobby/:lobbyInstanceMongoId" children={wrapComponentInApp(LobbyPage)} />
          <Route exact path="/user/:username" children={wrapComponentInApp(UserPage)} />
          <Route exact path="/user/:username/creations" children={wrapComponentInApp(UserCreationsPage)} />
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
