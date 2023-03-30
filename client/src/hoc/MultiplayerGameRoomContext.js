import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GameRoomErrorStates from '../game/gameRoomInstance/GameRoomErrorStates/GameRoomErrorStates';
import { addGameRoom, endGameRoom, joinGameRoom, leaveGameRoom } from '../store/actions/game/gameRoomInstanceActions';
import Loader from '../ui/Loader/Loader';

class MultiplayerGameRoomContext extends Component {
  componentWillMount() {
    const { gameRoomInstanceId } = this.props
    this.joinMultiplayerGameRoom(gameRoomInstanceId)
  }

  joinMultiplayerGameRoom(gameRoomInstanceId) {
    const {joinGameRoom, auth: { me }} = this.props
    
    const doJoinMultiPlayerGameRoom = async () => {   
      try {
        await joinGameRoom({gameRoomInstanceId, userId: me?.id});
      } catch(error) {
        console.log(error)
      }
    }

    doJoinMultiPlayerGameRoom()
  }

  componentWillUnmount() {
    this.leaveMultiplayerGameRoom()
  }

  leaveMultiplayerGameRoom() {
    const { auth: { me }, leaveGameRoom, gameRoomInstance: { gameRoomInstance }} = this.props

    if(gameRoomInstance.id) {
      leaveGameRoom({gameRoomInstanceId: gameRoomInstance.id, userId: me?.id})
    }
  }

  renderBody() {
    const { children, gameRoomInstance: { isLoading, isJoining }, gameRoomInstance} = this.props;
    
    if(isLoading) {
      return <Loader text="Loading Game Session..."/>
    }
  
    if(isJoining && gameRoomInstance.id) {
      return <Loader text="Joining Game Session..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }

  render() {
    return <>
      <GameRoomErrorStates/>
      {this.renderBody()}
    </>
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  gameRoomInstance: state.gameRoomInstance
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { joinGameRoom, leaveGameRoom, addGameRoom, endGameRoom })
)(MultiplayerGameRoomContext)
