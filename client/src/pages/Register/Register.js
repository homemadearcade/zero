import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Link from '../../components/ui/Link/Link';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { useFormik } from 'formik';

import { registerUserWithEmail } from '../../store/actions/registerActions';
import { registerSchema } from './validation';
import { GOOGLE_AUTH_LINK } from '../../constants';
import { getUrlParameter } from '../../utils/utils';

import './styles.css';
import Button from '../../components/ui/Button/Button';
import Typography from '../../components/ui/Typography/Typography';

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
      <div className="container">
        <Typography component="h1" variant="h1">Register page</Typography>
        back to{' '}
        <Link to="/">
          Home page
        </Link>
        {false && <Link className="google btn" href={GOOGLE_AUTH_LINK}>
            <i className="fa fa-google fa-fw" />
            Register with Google
        </Link>}
        <form onSubmit={formik.handleSubmit} noValidate>

          <div>
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
          </div>
          {error && <p className="error">{error}</p>}
          <div>
            <Button type="submit" disabled={isLoading || !formik.isValid}>
              Sign up now
            </Button>
          </div>
          <div>
            Have an account?{' '}
            <Link to="/login">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  register: state.register,
});

export default compose(withRouter, connect(mapStateToProps, { registerUserWithEmail }))(Register);
