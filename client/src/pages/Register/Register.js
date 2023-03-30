import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Link from '../../ui/Link/Link';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { useFormik } from 'formik';

import { registerUserWithEmail } from '../../store/actions/user/registerActions';
import { registerSchema } from './validation';
import { getUrlParameter } from '../../utils/utils';

import './styles.css';
import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import Icon from '../../ui/Icon/Icon';
import { GOOGLE_AUTH_LINK } from '../../constants';

const Register = ({ auth, register: { isLoading, error }, history, registerUserWithEmail}) => {
  const participantEmail = getUrlParameter('participantEmail')

  const formik = useFormik({
    initialValues: {
      username: '',
      email: participantEmail,
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      registerUserWithEmail(values, history);
    },
  });

  return (
    <div className="RegisterPage">
      <Typography component="h4" variant="h4">Register</Typography>
      <div>
        back to{' '}
        <Link to="/">
          Home page
        </Link>
      </div> 
      <div className="container">
        <form onSubmit={formik.handleSubmit} noValidate>
            <input
              placeholder="Email address"
              name="email"
              className=""
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="error">{formik.errors.email}</p>
            ) : null}
            <input
              placeholder="Username"
              name="username"
              className=""
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="error">{formik.errors.username}</p>
            ) : null}
            <input
              placeholder="Password"
              name="password"
              className=""
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : null}
          {error && <p className="error">{error}</p>}
          <div>
            <Button type="submit" disabled={isLoading || !formik.isValid}>
              Sign up now
            </Button>
          </div>
        </form>
      </div>
      <a className="GoogleOAuth" href={GOOGLE_AUTH_LINK}>
        <Icon icon="faGoogle"></Icon>
        Register with Google
      </a>

      <div>
        Have an account?{' '}
        <Link to="/login">
          Log In
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  register: state.register,
});

export default compose(withRouter, connect(mapStateToProps, { registerUserWithEmail }))(Register);
