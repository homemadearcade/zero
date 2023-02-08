import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { joinLobby, leaveLobby } from '../store/actions/lobbyActions';
import Loader from '../ui/Loader/Loader';
import AgoraVideoCall from '../lobby/agora/AgoraVideoCall/AgoraVideoCall';
import { bypassAgoraVideoCall, leaveAgoraVideoCall } from '../store/actions/videoActions';
import { withRouter } from 'react-router-dom';
import Button from '../ui/Button/Button';
import requireOneTab from './requireOneTab';
import { isLocalHost } from '../utils/webPageUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithLobby extends Component {
    componentWillMount() {
      const {joinLobby,  match, auth: { me } } = this.props

      const matchId = match.params.id;
      const doJoinLobby = async () => {   
        try {
          await joinLobby({lobbyId: matchId, userId: me?.id});
            } catch(error) {
          console.log(error)
        }
      }

      doJoinLobby()
    }

    componentWillUnmount() {
      this.withLobbyCleaup()
    }

    withLobbyCleaup() {
      const { auth: { me }, leaveLobby, leaveAgoraVideoCall, lobby: { lobby } } = this.props

      leaveAgoraVideoCall()
      leaveLobby({lobbyId: lobby.id, userId: me?.id})
    }

    render() {
      const { lobby: { isLoading, isJoining, lobby }, video: { bypass, isConnectingToVideoCall }, bypassAgoraVideoCall } = this.props;
      if(isLoading) {
        return <Loader text="Loading Lobby..."/>
      }
    
      if(isJoining || !lobby.id) {
        return <Loader text="Joining Lobby..."/>
      }

      return <AgoraVideoCall
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
    auth: state.auth,
    lobby: state.lobby,
    video: state.video,
    // cobrowsing: state.cobrowsing
  });

  return compose(
    requireOneTab,
    withRouter, 
    connect(mapStateToProps, { joinLobby, leaveLobby, leaveAgoraVideoCall, bypassAgoraVideoCall })
  )(WithLobby)
};
