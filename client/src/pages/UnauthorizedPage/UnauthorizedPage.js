import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const UnauthorizedPage = () => {
  return (
      <div className="UnauthorizedPage">
        <h1>Not authorized to see this page</h1>
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
