import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import AgoraVideoCall from '../lobby/agora/AgoraVideoCall/AgoraVideoCall';
import { bypassAgoraVideoCall, leaveAgoraVideoCall } from '../store/actions/videoActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithAgoraVideoCall extends Component {
    componentWillUnmount() {
     const { leaveAgoraVideoCall } = this.props

      leaveAgoraVideoCall()
    }

    render() {
      const { lobby: { lobby }, video: { bypass, isConnectingToVideoCall } } = this.props;

      return <AgoraVideoCall
        videoCallId={lobby.id}
        render={(props) => {
          if(isConnectingToVideoCall && !bypass) {
            return <>
              <Loader text="Connecting your video to other users..."/>
            </>
          }
        
          return <ChildComponent {...props } {...this.props} />
        }}
      />
    }
  }

  const mapStateToProps = (state) => ({
    lobby: state.lobby,
    video: state.video,
    // cobrowsing: state.cobrowsing
  });

  return compose(
    connect(mapStateToProps, { leaveAgoraVideoCall, bypassAgoraVideoCall })
  )(WithAgoraVideoCall)
};
