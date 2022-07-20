import React from 'react';
import Link from '../../app/ui/Link/Link';

import requireAdmin from '../../hoc/requireAdmin';
import Layout from '../../layout/Layout';
import './styles.css';
import Typography from '../../app/ui/Typography/Typography';

const Admin = () => {
  return (
    <Layout>
      <div className="admin-page">
        <Typography component="h1" variant="h1">Admin dashboard</Typography>
        This is the Admin page. Only the Admin can access this page. Return back to{' '}
        <Link to="/">
          Home
        </Link>
      </div>
    </Layout>
  );
};

export default requireAdmin(Admin);
