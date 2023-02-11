import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addGameSession, joinGameSession, leaveGameSession } from '../store/actions/gameSessionActions';
import Loader from '../ui/Loader/Loader';

// eslint-disable-next-line import/no-anonymous-default-export
class GameSessionContext extends Component {
  componentWillMount() {
    const { lobby: { lobby } } = this.props

    if(lobby.id) {
      this.joinGameSession(lobby.gameSession.id)
    } else {
      // async function createGameSession() {
      //   const gameSession = await addGameSession({
      //     hostId: me.id,
      //     isNetworked: false,
      //     isSaveDisabled: false,
      //     gameId
      //   })
      //   this.joinGameSession(gameSession.id)
      // }
      // createGameSession()
    }
  }

  joinGameSession(gameSessionId) {
    const {joinGameSession, auth: { me }} = this.props
    
    const doJoinGameSession = async () => {   
      try {
        await joinGameSession({gameSessionId, userId: me?.id});
      } catch(error) {
        console.log(error)
      }
    }

    doJoinGameSession()
  }

  componentWillUnmount() {
    this.cleanup()
  }

  cleanup() {
    const { auth: { me }, leaveGameSession, gameSession: { gameSession } } = this.props

    leaveGameSession({gameSessionId: gameSession.id, userId: me?.id})
  }

  render() {
    const { children, gameSession: { isLoading, isJoining, gameSession }} = this.props;
    
    if(isLoading) {
      return <Loader text="Loading Game Session..."/>
    }
  
    if(isJoining || !gameSession.id) {
      return <Loader text="Joining Game Session..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  gameSession: state.gameSession
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { joinGameSession, leaveGameSession, addGameSession })
)(GameSessionContext)
