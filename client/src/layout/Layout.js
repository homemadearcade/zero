import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer/Footer';
import './Layout.scss';
import { Container } from '@mui/material';
import AppBar from './AppBar/AppBar';

const Layout = ({ children }) => {
  return (
    <>
      <AppBar />
        <Container><div className="Layout__container">{children}</div></Container>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
