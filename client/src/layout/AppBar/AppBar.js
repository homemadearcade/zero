import * as React from 'react';
import { AppBar as MuiAppBar } from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '../../ui/IconButton/IconButton';
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
import { useState } from 'react';
import {  APP_ADMIN_ROLE } from '../../constants';
import Link from '../../ui/Link/Link';
import { useLocation } from 'react-router-dom';
import { useWishTheme } from '../../hooks/useWishTheme';

function AppBar({ auth }) {

  const pagesLeft = [
    // {
    //   name: 'Buy Tickets',
    //   href: 'https://towalkthenight.com/homemade-arcade-games',
    //   variant: 'contained',
    // }
  ]

  const userPages = []
  const adminPages = []

  const location = useLocation();

  const theme = useWishTheme()

  pagesLeft.push({
    name: 'Arcade',
    url: '/arcade',
  })

  if (auth.isAuthenticated && auth.isSocketAuthenticated) {
    userPages.push({
      name: 'My Account',
      url: '/user/'+auth.me.username,
    })
    userPages.push({
      name: 'My Creations',
      url: '/user/'+auth.me.username+'/creations',
    })



    // pagesLeft.push({
    //   name: 'My Tickets',
    //   url: '/my-tickets',
    //   })

    if (auth.me?.roles[APP_ADMIN_ROLE]) {
      adminPages.push({
        name: 'App Settings',
        url: '/app-settings',
      })

      adminPages.push({
        name: 'Games',
        url: '/games',
      })

      adminPages.push({
        name: 'Experiences',
        url: '/experiences',
      })

      adminPages.push({
        name: 'Lobbies',
        url: '/lobbys',
      })

      adminPages.push({
        name: 'Users',
        url: '/users',
      })

      // pagesLeft.push({
      //   name: 'Calendar',
      //   url: '/calendar',
      // })


    }
  }

  const [anchorElAdmin, setAnchorElAdmin] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    handleCloseAdminMenu()
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenAdminMenu = (event) => {
    setAnchorElAdmin(event.currentTarget);
    handleCloseUserMenu()
  };

  const handleCloseAdminMenu = () => {
    setAnchorElAdmin(null);
  };

  function renderAdminMenu() {
    const me = auth.me

    if(!me || !me.roles[APP_ADMIN_ROLE]) {
      return null
    }

     return <Box sx={{ flexGrow: 0, marginRight: '1em' }}>
      <Tooltip title="Open Admin">
        <IconButton icon="faCrown" onClick={handleOpenAdminMenu} sx={{ p: 0 }}>

        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElAdmin}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElAdmin)}
        onClose={handleCloseAdminMenu}
      >
        {adminPages.map(({name, url,href }) => (
          <Link to={url} sx={{ textDecoration: 'none' }}>
          <MenuItem key={name} onClick={handleCloseAdminMenu}>
              {name}
          </MenuItem>
          </Link>
        ))}
      </Menu>
    </Box>
  }

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
      <Tooltip title="Open User">
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
        {userPages.map(({name, url,href }) => (
          <Link to={url} sx={{ textDecoration: 'none' }}>
          <MenuItem key={name} onClick={handleCloseUserMenu}>
              {name}
          </MenuItem>
          </Link>
        ))}
      </Menu>
    </Box>
  }

  return (
    <MuiAppBar sx={{backgroundColor: 'rgba(0,0,0,0)', backgroundImage: 'url()', boxShadow: 'none'}} position="absolute">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" sx={{ textDecoration: 'none' }}>
            <Typography
              variant="subtitle2"
              noWrap
              component="a"
              font="2P"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                color: 'white',
                textDecoration: 'none',
              }}
            >
              HA
            </Typography>
          </Link>

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
              {pagesLeft.map(({name, url}) => {
                const sx ={}
                if(location.pathname === '/'+url) {
                  sx.fontWeight = '700'
                  sx.color = 'white'
                  // sx.fontSize = '1em'
                }
                return <Link to={url} sx={{ textDecoration: 'none' }}>
                  <MenuItem key={name} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center" sx={{
                      color: '#EEE',
                      ...sx
                    }}>{name}</Typography>
                  </MenuItem>
                </Link>
              })}
            </Menu>
          </Box>
          <Link to="/" sx={{ textDecoration: 'none' }}>
            <Typography
              variant="subtitle2"
              noWrap
              component="a"
              font="2P"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                color: 'white',
                textDecoration: 'none',
              }}
            >
              HA
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {pagesLeft.map(({name, url, variant, href}) => {
              const sx ={}
              if(location.pathname === '/'+url) {
                sx.fontWeight = '700'
                sx.color = 'white'
                // sx.fontSize = '1em'
              }

              return <Button
                variant={variant}
                href={href && href}
                to={url}
                component={Link}
                key={name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, fontWeight: '400', color: variant !== 'contained' && '#EEE', display: 'block', ...sx }}
              >
                {name}
              </Button>
            })}
          </Box>
          {renderAdminMenu()}
         {renderUserMenu()}
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(
  connect(
    mapStateToProps, { logOutUser }
  )
)(AppBar);
