import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { joinLobby, leaveLobby } from '../store/actions/lobbyActions';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { leaveAgoraVideoCall } from '../store/actions/videoActions';

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
      const { auth: { me }, leaveLobby, lobby: { lobby }, leaveAgoraVideoCall } = this.props

      leaveAgoraVideoCall()
      leaveLobby({lobbyId: lobby.id, userId: me?.id})
    }

    render() {
      const { lobby: { isLoading, isJoining, lobby } } = this.props;
      if(isLoading) {
        return <Loader text="Loading Lobby..."/>
      }
    
      if(isJoining || !lobby.id) {
        return <Loader text="Joining Lobby..."/>
      }

      return <ChildComponent {...this.props} />
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.auth,
    lobby: state.lobby,
    // cobrowsing: state.cobrowsing
  });

  return compose(
    withRouter, 
    connect(mapStateToProps, { joinLobby, leaveLobby, leaveAgoraVideoCall })
  )(WithLobby)
};
