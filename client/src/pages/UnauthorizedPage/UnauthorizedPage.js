import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const UnauthorizedPage = () => {
  return (
      <div className="UnauthorizedPage">
        <Typography component="h1" variant="h1">Not authorized to see this page</Typography>
        <p>
          Go back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
  );
};

export default UnauthorizedPage;
