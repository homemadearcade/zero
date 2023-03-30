import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import AgoraVideoCall from '../experience/agora/AgoraVideoCall/AgoraVideoCall';
import { bypassAgoraVideoCall, leaveAgoraVideoCall } from '../store/actions/experience/videoActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithAgoraVideoCall extends Component {
    componentWillUnmount() {
     const { leaveAgoraVideoCall } = this.props

      leaveAgoraVideoCall()
    }

    render() {
      const { lobbyInstance: { lobbyInstance }, video: { bypass, isConnectingToVideoCall } } = this.props;

      return <AgoraVideoCall
        videoCallId={lobbyInstance.id}
        render={(props) => {
          if(isConnectingToVideoCall && !bypass) {
            return <>
              <Loader text="Connecting your video to other members..."/>
            </>
          }
        
          return <ChildComponent {...props } {...this.props} />
        }}
      />
    }
  }

  const mapStateToProps = (state) => ({
    lobbyInstance: state.lobbyInstance,
    video: state.video,
    // cobrowsing: state.cobrowsing
  });

  return compose(
    connect(mapStateToProps, { leaveAgoraVideoCall, bypassAgoraVideoCall })
  )(WithAgoraVideoCall)
};
