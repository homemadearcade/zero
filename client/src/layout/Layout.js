import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import './Layout.scss';
import AdminNavbar from './AdminNavbar/AdminNavbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="Layout__container">{children}</div>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
