/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
// import _ from 'lodash';

import { getUserByEmail } from '../../store/actions/userActions';
import { loginUserWithEmail, authenticateSocket } from '../../store/actions/authActions';

// import { GOOGLE_AUTH_LINK } from '../../constants';
import { loginSchema } from './validation';
import './styles.css';
import { getUrlParameter } from '../../utils/utils';
import Loader from '../../components/Loader/Loader';
import SceneFull from '../../components/SceneFull/SceneFull.jsx';

const LoginSession = ({ auth, history, loginUserWithEmail, authenticateSocket }) => {
  let [prefaces, setPrefaces] = useState([
    { text: 'Who is joining us?'},
  ])
  
  let [isLoggingIn, setIsLoggingIn] = useState(false)

  const participantEmail = getUrlParameter('participantEmail')
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
      email: participantEmail,
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoggingIn(true)
      await loginUserWithEmail(values);
      history.push("/lobby/find")
    },
  });

  if(auth.isLoading || isLoggingIn) {
    return <Loader text="Logging in..."/>
  }

  if(prefaces.length) {
    return <SceneFull onClick={() => {
      const newPrefaces = prefaces.slice()
      newPrefaces.shift()
      setPrefaces(newPrefaces)
    }} text={prefaces[0].text}/>
  }

  // if(auth.isAuthenticated && auth.me.email === participantEmail) {
  //   return <Redirect to="/lobby/find"/>
  // }

  return (
    <div className="login">
      <div className="container">
        <form onSubmit={formik.handleSubmit}>
          <h1>Logging in as {formik.values.email}</h1>
          <div>
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
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail, authenticateSocket, getUserByEmail }))(LoginSession);
