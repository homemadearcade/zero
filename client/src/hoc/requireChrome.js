import React, { Component } from 'react';
import { connect } from 'react-redux';
import GetChromePage from '../pages/GetChromePage/GetChromePage';
import { setRedirect } from '../store/actions/authActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    // // Our component just got rendered
    constructor(props) {
      super(props)
      this.state = {
        isChrome: window.chrome
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
      if(!this.state.isChrome) {
        return <GetChromePage/>
      } else {
        return <ChildComponent {...this.props} />;
      }

      
    }
  }

  function mapStateToProps(state) {
    return {}
  }

  return connect(mapStateToProps, { })(ComposedComponent);
};
