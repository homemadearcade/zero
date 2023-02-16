import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GameRoomErrorStates from '../game/gameRoom/GameRoomErrorStates/GameRoomErrorStates';
import { addGameRoom, endGameRoom, joinGameRoom, leaveGameRoom } from '../store/actions/gameRoomActions';
import Loader from '../ui/Loader/Loader';

class MultiplayerGameRoomContext extends Component {
  componentWillMount() {
    const { gameRoomId } = this.props

    if(gameRoomId === this.props.gameRoom.gameRoom.id) {
      // 'already cobrowsing this user :)
      window.preventGameRoomUnmount = true
      return 
    } 


    this.joinMultiplayerGameRoom(gameRoomId)
  }

  joinMultiplayerGameRoom(gameRoomId) {
    const {joinGameRoom, auth: { me }} = this.props
    
    const doJoinMultiPlayerGameRoom = async () => {   
      try {
        await joinGameRoom({gameRoomId, userId: me?.id});
      } catch(error) {
        console.log(error)
      }
    }

    doJoinMultiPlayerGameRoom()
  }

  componentWillUnmount() {
    setTimeout(() => {
      if(window.preventGameRoomUnmount) {
        return 
      }
      this.leaveMultiplayerGameRoom()
    }, 1000)
  }

  leaveMultiplayerGameRoom() {
    const { auth: { me }, leaveGameRoom, gameRoom: { gameRoom }} = this.props

    if(gameRoom.id) {
      leaveGameRoom({gameRoomId: gameRoom.id, userId: me?.id})
    }
  }

  renderBody() {
    const { children, gameRoom: { isLoading, isJoining }, gameRoom} = this.props;
    
    if(isLoading) {
      return <Loader text="Loading Game Session..."/>
    }
  
    if(isJoining && gameRoom.id) {
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
  gameRoom: state.gameRoom
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { joinGameRoom, leaveGameRoom, addGameRoom, endGameRoom })
)(MultiplayerGameRoomContext)
