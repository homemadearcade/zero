import React, { Component } from 'react';
import { connect } from 'react-redux';
import AgoraVideoCall from '../app/agora/AgoraVideoCall/AgoraVideoCall';
import { leaveAgoraVideoCall } from '../store/actions/videoActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithAgoraVideoCall extends Component {
    componentWillUnmount() {
      const { leaveAgoraVideoCall } = this.props;
      leaveAgoraVideoCall()
    }

    render() {
      return <AgoraVideoCall render={(props) => <ChildComponent {...props} />}/>
    }
  }

  const mapStateToProps = (state) => ({});

  return connect(mapStateToProps, { leaveAgoraVideoCall })(WithAgoraVideoCall)
};
