import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from '../pages/Login/Login';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';
import { setRedirect } from '../store/actions/authActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    // // Our component just got rendered
    componentDidMount() {
      if (!this.props.auth.isAuthenticated || !this.props.auth.isSocketAuthenticated) {
        const { setRedirect } = this.props
        setRedirect(window.location.pathname)
      }
    }

    // // Our component just got updated
    // componentDidUpdate() {
    //   this.shouldNavigateAway();
    // }

    // //token ima auth nema, prepisi ga sa func component i useefect
    // shouldNavigateAway() {
    //     this.props.history.push('/');
    //   }
    // }

    render() {
      if (this.props.auth.isAuthenticated && this.props.auth.isSocketAuthenticated) {
        return <ChildComponent {...this.props} />;
      } else {
        return <Login/>
      }
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth };
  }

  return connect(mapStateToProps, { setRedirect })(ComposedComponent);
};
