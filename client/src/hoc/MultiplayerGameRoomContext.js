import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GameRoomErrorStates from '../game/gameRoomInstance/GameRoomErrorStates/GameRoomErrorStates';
import { addGameRoom, endGameRoom, joinGameRoom, leaveGameRoom } from '../store/actions/game/gameRoomInstanceActions';
import { initializeUnlockableInterfaceIds } from '../store/actions/game/unlockableInterfaceActions';
import { getUserByMongoId } from '../store/actions/user/userActions';
import Loader from '../ui/Loader/Loader';

class MultiplayerGameRoomContext extends Component {
  componentWillMount() {
    const { gameRoomInstanceMongoId } = this.props
    this.joinMultiplayerGameRoom(gameRoomInstanceMongoId)
  }

  joinMultiplayerGameRoom(gameRoomInstanceMongoId) {
    const {joinGameRoom, getUserByMongoId,  auth: { me }, experienceModel : { experienceModel }, initializeUnlockableInterfaceIds} = this.props
    
    const doJoinMultiPlayerGameRoom = async () => {   
      try {
        await joinGameRoom({gameRoomInstanceMongoId, userMongoId: me?.id});

        if(experienceModel?.id) {
          const response = await getUserByMongoId(me.id)
          const interfaceIds = response.data.user.interfaceIds[experienceModel.id]
          initializeUnlockableInterfaceIds(interfaceIds ? interfaceIds: { all: true })
        } else {
          initializeUnlockableInterfaceIds({all: true})
        }

      } catch(error) {
        console.log(error)
      }
    }

    doJoinMultiPlayerGameRoom()
  }

  componentWillUnmount() {
    this.leaveMultiplayerGameRoom()
  }

  componentDidUpdate(oldProps) {
    this.switchGameRoom(oldProps, this.props)
  }

  async switchGameRoom(oldProps, newProps) {
    if(oldProps.gameRoomInstanceMongoId !== newProps.gameRoomInstanceMongoId) {
      await this.leaveMultiplayerGameRoom()

      setTimeout(() => {
        this.joinMultiplayerGameRoom(newProps.gameRoomInstanceMongoId)
      }, 100)
    }
  }

  async leaveMultiplayerGameRoom() {
    const { auth: { me }, leaveGameRoom, gameRoomInstance: { gameRoomInstance }} = this.props

    if(gameRoomInstance.id) {
      await leaveGameRoom({gameRoomInstanceMongoId: gameRoomInstance.id, userMongoId: me?.id})
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
  gameRoomInstance: state.gameRoomInstance,
  experienceModel: state.experienceModel,
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { joinGameRoom, leaveGameRoom, addGameRoom, endGameRoom, initializeUnlockableInterfaceIds, getUserByMongoId })
)(MultiplayerGameRoomContext)
