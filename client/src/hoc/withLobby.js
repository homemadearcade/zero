import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { joinLobby, leaveLobby } from '../store/actions/lobbyActions';
import Loader from '../app/ui/Loader/Loader';
import AgoraVideoCall from '../app/agora/AgoraVideoCall/AgoraVideoCall';
import { leaveAgoraVideoCall } from '../store/actions/videoActions';
import { withRouter } from 'react-router-dom';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithLobby extends Component {
    componentDidMount() {
      const {joinLobby,  match, auth: { me } } = this.props

      const matchId = match.params.id;
      const doJoinLobby = async () => {   
        try {
          await joinLobby({lobbyId: matchId, userId: me?.id});
    
          window.addEventListener('beforeunload', this.askBeforeClosing);
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
      window.removeEventListener('beforeunload', this.askBeforeClosing)
    }

    askBeforeClosing = (e) => {
      e.preventDefault();
      if(window.location.host.indexOf('localhost') === -1) e.returnValue = '';
      this.withLobbyCleaup()
    }

    render() {
      const { lobby: { isLoading, isJoining } } = this.props;

      if(isLoading) {
        return <Loader text="Loading Lobby..."/>
      }
    
      if(isJoining) {
        return <Loader text="Joining Lobby..."/>
      }

      return <AgoraVideoCall
        render={(props) => <ChildComponent {...props} />}
      />
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.auth,
    lobby: state.lobby,
  });

  return compose(
    withRouter, 
    connect(mapStateToProps, { joinLobby, leaveLobby, leaveAgoraVideoCall })
  )(WithLobby)
};
