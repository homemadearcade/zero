import React, { useEffect, useState } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Link from '../../ui/Link/Link';

import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { loginUserWithEmail } from '../../store/actions/user/authActions';
import { loginSchema } from './validation';
import './styles.css';
import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import Icon from '../../ui/Icon/Icon';
import { GOOGLE_AUTH_LINK } from '../../constants';

const Login = ({ auth, loginUserWithEmail, onLogin, children }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await loginUserWithEmail(values);
      onLogin()
    },
  });

  return (
    <div className="Login">
      <Typography component="h4" variant="h4">Log in</Typography>
      <div>
        back to{' '}
        <Link to="/">
          Home page
        </Link>
      </div>
      <div className="container">
        <form onSubmit={formik.handleSubmit}>
          <div>
            <input
              placeholder="Email address"
              name="email"
              className="text"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="error">{formik.errors.email}</p>
            ) : null}
             <input
              placeholder="Password"
              name="password"
              type="password"
              className="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : null}
          </div>
          {auth.error && <p className="error">{auth.error}</p>}
           <div>
            <Button
              className="btn submit"
              disabled={auth.isLoading || !formik.isValid}
              type="submit"
            >
              Log in now
            </Button>
          </div>
          </form>
        </div>
        <Link
          to="/forgot"
          className="btn submit"
        >
          Forgot Password?
        </Link>
        {children && children}
        {/* <a className="GoogleOAuth" href={GOOGLE_AUTH_LINK}>
          <Icon icon="faGoogle"></Icon>
          Login with Google
        </a> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(connect(mapStateToProps, { loginUserWithEmail }))(Login);
