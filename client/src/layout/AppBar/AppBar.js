import * as React from 'react';
import { AppBar as MuiAppBar } from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { logOutUser } from '../../store/actions/user/authActions';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {  APP_ADMIN_ROLE } from '../../constants';


function AppBar({ auth }) {

  const pages = [
    {
      name: 'Buy Tickets',
      url: 'buy-tickets',
      variant: 'contained',
    }
  ]

  const settings = []

  if (auth.isAuthenticated && auth.isSocketAuthenticated) {
    settings.push({
      name: 'My Account',
      url: 'user/'+auth.me.username,
    })

    pages.push({
      name: 'Arcade',
      url: 'arcade',
    })

    // pages.push({
    //   name: 'My Tickets',
    //   url: 'my-tickets',
    //   })

    if (auth.me.roles[APP_ADMIN_ROLE]) {
      pages.push({
        name: 'Games',
        url: 'games',
      })

      pages.push({
        name: 'Experiences',
        url: 'experiences',
      })

      pages.push({
        name: 'Lobbies',
        url: 'lobbys',
      })

      pages.push({
        name: 'Users',
        url: 'users',
      })

      pages.push({
        name: 'Calendar',
        url: 'calendar',
      })

      pages.push({
        name: 'App',
        url: 'app-settings',
      })
    }
  }

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function renderUserMenu() {
    const me = auth.me

    if(!me) {
      return <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Login">
          <Button component={Link} to="/login" variant="contained" color="primary">
            Login
          </Button>
        </Tooltip>
      </Box>
    }

     return <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={me.username} src={null} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map(({name, url}) => (
          <MenuItem key={name} onClick={handleCloseUserMenu}>
            <Button
              component={Link}
              key={name}
              to={`/${url}`}
              onClick={handleCloseNavMenu}
              sx={{ color: 'white', display: 'block' }}
            >
              {name}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  }

  return (
    <MuiAppBar sx={{backgroundColor: 'rgba(0,0,0,0)', backgroundImage: 'url()', boxShadow: 'none'}} position="absolute">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="subtitle2"
            noWrap
            component="a"
            href="/"
            font="2P"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HA
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({name, url}) => (
                <MenuItem key={name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="subtitle2"
            noWrap
            component="a"
            href=""
            font="2P"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HA
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(({name, url, variant}) => (
              <Button
                variant={variant}
                component={Link}
                key={name}
                to={`/${url}`}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: variant !== 'contained' && 'white', display: 'block' }}
              >
                {name}
              </Button>
            ))}
          </Box>

         {renderUserMenu()}
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { logOutUser }))(AppBar);
