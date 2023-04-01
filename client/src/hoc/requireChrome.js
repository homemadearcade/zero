import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from '../ui/Link/Link';
import Typography from '../ui/Typography/Typography';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    // // Our component just got rendered
    constructor(props) {
      super(props)
      this.state = {
        isChrome: true// window.chrome
      }
    }

    render() {
      if(!this.state.isChrome) {
        return <div>
          <Typography component="h1" variant="h1">You must use Google Chrome or a chromium browser to play</Typography>
          Go back to{' '}
          <Link to="/">
            Home
          </Link>
      </div>
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
