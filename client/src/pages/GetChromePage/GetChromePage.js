import React from 'react';
import Link from '../../ui/Link/Link';
import Typography from '../../ui/Typography/Typography';

import './styles.css';

const GetChromePage = () => {
  return (
      <div className="GetChromePage">
        <Typography component="h1" variant="h1">You must use Google Chrome or a chromium browser to play</Typography>
        Go back to{' '}
        <Link to="/">
          Home
        </Link>
      </div>
  );
};

export default GetChromePage;
