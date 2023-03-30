import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { joinLobbyByMongoId, leaveLobbyByMongoId } from '../store/actions/experience/lobbyInstanceActions';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { leaveAgoraVideoCall } from '../store/actions/experience/videoActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithLobby extends Component {
    componentWillMount() {
      const {joinLobbyByMongoId,  match, auth: { me } } = this.props

      const matchId = match.params.lobbyInstanceMongoId;
      const doJoinLobby = async () => {   
        try {
          await joinLobbyByMongoId({lobbyInstanceMongoId: matchId, userMongoId: me?.id});
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
      const { auth: { me }, leaveLobbyByMongoId, lobbyInstance: { lobbyInstance }, leaveAgoraVideoCall } = this.props

      leaveAgoraVideoCall()
      leaveLobbyByMongoId({lobbyInstanceMongoId: lobbyInstance.id, userMongoId: me?.id})
    }

    render() {
      const { lobbyInstance: { isLoading, isJoining, lobbyInstance } } = this.props;
      if(isLoading) {
        return <Loader text="Loading Lobby..."/>
      }
    
      if(isJoining || !lobbyInstance.id) {
        return <Loader text="Joining Lobby..."/>
      }

      return <ChildComponent {...this.props} />
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.auth,
    lobbyInstance: state.lobbyInstance,
    // cobrowsing: state.cobrowsing
  });

  return compose(
    withRouter, 
    connect(mapStateToProps, { joinLobbyByMongoId, leaveLobbyByMongoId, leaveAgoraVideoCall })
  )(WithLobby)
};
