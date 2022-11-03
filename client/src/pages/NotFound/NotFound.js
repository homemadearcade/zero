import React from 'react';
import Link from '../../ui/Link/Link';
import Layout from '../../layout/Layout';
import Typography from '../../ui/Typography/Typography';
import './styles.css';

const NotFound = () => {
  return (
    <Layout>
      <div className="not-found-page">
        <Typography component="h1" variant="h1">Not Found 404</Typography>
        Go back to{' '}
        <Link to="/">
          Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
