import React from 'react';
import Link from '../../app/ui/Link/Link';
import Typography from '../../app/ui/Typography/Typography';

import './styles.css';

const UnauthorizedPage = () => {
  return (
      <div className="UnauthorizedPage">
        <Typography component="h1" variant="h1">Not authorized to see this page</Typography>
        <p>
          Go back to{' '}
          <Link to="/">
            Home
          </Link>
        </p>
      </div>
  );
};

export default UnauthorizedPage;
