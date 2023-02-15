import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GameSessionErrorStates from '../lobby/GameSessionErrorStates/GameSessionErrorStates';
import { addGameSession, endGameSession, joinGameSession, leaveGameSession } from '../store/actions/gameSessionActions';
import Loader from '../ui/Loader/Loader';

class MultiplayerGameSessionContext extends Component {
  componentWillMount() {
    const { gameSessionId } = this.props

    this.joinMultiplayerGameSession(gameSessionId)
  }

  joinMultiplayerGameSession(gameSessionId) {
    const {joinGameSession, auth: { me }} = this.props
    
    const doJoinMultiPlayerGameSession = async () => {   
      try {
        await joinGameSession({gameSessionId, userId: me?.id});
      } catch(error) {
        console.log(error)
      }
    }

    doJoinMultiPlayerGameSession()
  }

  componentWillUnmount() {
    this.leaveMultiplayerGameSession()
  }

  leaveMultiplayerGameSession() {
    const { auth: { me }, leaveGameSession, gameSession: { gameSession }} = this.props

    leaveGameSession({gameSessionId: gameSession.id, userId: me?.id})
  }

  renderBody() {
    const { children, gameSession: { isLoading, isJoining }, gameSession} = this.props;
    
    if(isLoading) {
      return <Loader text="Loading Game Session..."/>
    }
  
    if(isJoining && gameSession.id) {
      return <Loader text="Joining Game Session..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }

  render() {
    return <>
      <GameSessionErrorStates/>
      {this.renderBody()}
    </>
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  gameSession: state.gameSession
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { joinGameSession, leaveGameSession, addGameSession, endGameSession })
)(MultiplayerGameSessionContext)
