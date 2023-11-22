import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import Register from '../../auth/Register/Register';

const RegisterPage = ({ history }) => {
  return (
    <Register onLogin={() => {
      history.push('/')
    }}/>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, { })
)(RegisterPage);
