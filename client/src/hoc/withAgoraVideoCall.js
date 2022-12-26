import React, { Component } from 'react';
import { connect } from 'react-redux';
import AgoraVideoCall from '../lobby/agora/AgoraVideoCall/AgoraVideoCall';
import { leaveAgoraVideoCall, setAudioTrackId, setVideoTrackId } from '../store/actions/videoActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithAgoraVideoCall extends Component {
    constructor(props) {
      const preferences = props.auth.me.preferences

      if(preferences?.agoraVideoTrackId) {
        props.setVideoTrackId(preferences.agoraVideoTrackId)
      }
      if(preferences?.agoraAudioTrackId) {
        props.setAudioTrackId(preferences.agoraAudioTrackId)
      }
    }

    componentWillUnmount() {
      const { leaveAgoraVideoCall } = this.props;
      leaveAgoraVideoCall()
    }

    render() {
      return <AgoraVideoCall render={(props) => <ChildComponent {...props} />}/>
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.auth
  });

  return connect(mapStateToProps, { leaveAgoraVideoCall, setVideoTrackId, setAudioTrackId })(WithAgoraVideoCall)
};
