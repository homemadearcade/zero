/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getUserByEmail } from '../../store/actions/userActions';
import { loginUserWithEmail } from '../../store/actions/authActions';
import { GOOGLE_AUTH_LINK } from '../../constants';
import { loginSchema } from './validation';
import './styles.css';
// import { getUrlParameter } from '../../utils/utils';
// import Loader from '../../components/Loader/Loader';
import SceneFull from '../../components/SceneFull/SceneFull.jsx';

const Login = ({ auth, history, loginUserWithEmail, getUserByEmail, user: { user, isLoading, error } }) => {

  let [prefaces, setPrefaces] = useState([
    { text: 'Who is joining us?'},
  ])

  // const participantEmail = getUrlParameter('participantEmail')
  // useEffect(() => {
  //   async function getUser() {
  //     const newPrefaces = prefaces.slice()
  //     newPrefaces.push(
  //       { text: 'Welcome, ' + user.username }
  //     )
  //     setPrefaces(newPrefaces)
  //   }
  //   if(participantEmail) {
  //     getUser()
  //   }
  // }, [participantEmail])

  // if (isLoading) {
  //   return <Loader/>;
  // }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      loginUserWithEmail(values, history);
    },
  });

  if (auth.isAuthenticated) {
    // return <Redirect to="/lobby/find" />;
    return <Redirect to="/lobby/1000" />;
  }

  if(prefaces.length) {
    return <SceneFull onClick={() => {
      const newPrefaces = prefaces.slice()
      newPrefaces.shift()
      setPrefaces(newPrefaces)
    }} text={prefaces[0].text}/>
  }

  return (
    <div className="login">
      <div className="container">
        {false && <h1>Log in with Google</h1>}
        <form onSubmit={formik.handleSubmit}>
          {false && <a className="google btn" href={GOOGLE_AUTH_LINK}>
            <i className="fa fa-google fa-fw" />
            Login with Google
          </a>}
          <h1>Log in with Email</h1>
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
            <button
              className="btn submit"
              disabled={auth.isLoading || !formik.isValid}
              type="submit"
            >
              Log in now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail, getUserByEmail }))(Login);
