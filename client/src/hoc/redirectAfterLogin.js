import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from '../auth/Login/Login';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';
import { setRedirect } from '../store/actions/user/authActions';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    state = {
      isRegistering: false,
      redirectUrl: null
    }

    // // Our component just got rendered
    componentDidMount() {
      if (!this.props.auth.isAuthenticated || !this.props.auth.isSocketAuthenticated) {
        this.setState({redirectUrl: window.location.pathname})
      }
    }
    
    render() {
      const { history } = this.props 
      // if(this.isRegistering) {
      //   return <Register
      //     onLogin={() => {
      //       console.log('redirecting to: ', this.state.redirectUrl)
      //       history.push(this.state.redirectUrl)
      //     }}
      //     onLoginClick={() => {
      //       this.setState({isRegistering: false})
      //     }}/>
      // } else {
        if(this.redirectUrl) {
          return <Login 
            onLogin={() => {
              console.log('redirecting to: ', this.state.redirectUrl)
              history.push(this.state.redirectUrl)
            }}
            // onRegisterClick={() => {
            //   this.setState({isRegistering: true})
            // }}
          />
        } else {
          return <ChildComponent {...this.props} />;
        }

      // }
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth };
  }

  return compose(
    withRouter, 
    connect(mapStateToProps, { setRedirect }))(ComposedComponent);
};
