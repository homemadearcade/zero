import React from 'react';
import Link from '../../ui/Link/Link';
import Typography from '../../ui/Typography/Typography';

import './styles.css';

const UnauthorizedPage = () => {
  return (
      <div className="UnauthorizedPage">
        <Typography component="h1" variant="h1">Not authorized to see this page</Typography>
        Go back to{' '}
        <Link to="/">
          Home
        </Link>
      </div>
  );
};

export default UnauthorizedPage;
