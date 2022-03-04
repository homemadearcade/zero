import React, { Component } from 'react';
import { connect } from 'react-redux';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    // // Our component just got rendered
    // componentDidMount() {
    //   this.shouldNavigateAway();
    // }

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
        return <UnauthorizedPage/>
      }
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth };
  }

  return connect(mapStateToProps)(ComposedComponent);
};
