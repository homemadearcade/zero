import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { GAME_INSTANCE_DID } from '../game/constants';
import GameRoomErrorStates from '../game/gameRoomInstance/GameRoomErrorStates/GameRoomErrorStates';
import { addGameRoom, editGameRoom, endGameRoom, joinGameRoom, leaveGameRoom } from '../store/actions/game/gameRoomInstanceActions';
import { initializeUnlockableInterfaceIds } from '../store/actions/game/unlockedInterfaceActions';
import { getUserByMongoId } from '../store/actions/user/userActions';
import LinearIndeterminateLoader from '../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';
import { generateUniqueId } from '../utils';

class MultiplayerGameRoomContext extends Component {
  componentWillMount() {
    const { gameRoomInstanceMongoId } = this.props
    this.joinMultiplayerGameRoom(gameRoomInstanceMongoId)
  }

  joinMultiplayerGameRoom(gameRoomInstanceMongoId) {
    const {joinGameRoom, getUserByMongoId, editGameRoom, auth: { me }, experienceModel : { experienceModel }, initializeUnlockableInterfaceIds} = this.props
    
    const doJoinMultiPlayerGameRoom = async () => {   
      try {
        const response = await joinGameRoom({gameRoomInstanceMongoId, userMongoId: me?.id});

        const gameRoomInstance = response.data.gameRoomInstance
        const gameInstanceId = gameRoomInstance.gameInstanceIds[gameRoomInstance.arcadeGameMongoId]
        if(!gameInstanceId && gameRoomInstance.hostUserMongoId === me.id) {
          const gameInstanceId =  GAME_INSTANCE_DID + generateUniqueId()
          editGameRoom(gameRoomInstanceMongoId, {
            gameInstanceIds: {
              [gameRoomInstance.arcadeGameMongoId]: gameInstanceId
            }
          })
        } else {
          console.error('not setting game instance id yet: ', gameInstanceId)
        }

        if(experienceModel?.id) {
          const response = await getUserByMongoId(me.id)
          const unlockedInterfaceIds = response.data.user.unlockedInterfaceIds[experienceModel.id]
          initializeUnlockableInterfaceIds(unlockedInterfaceIds ? unlockedInterfaceIds: { })
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
    const { children, gameRoomInstance: { isLoading, isJoining, gameRoomInstance}} = this.props;
    
    if(isLoading) {
      return <LinearIndeterminateLoader/>
      // return <Loader text="Loading Game Session..."/>
    }
  
    if(isJoining && !gameRoomInstance.id) {
      return <LinearIndeterminateLoader/>
      // return <Loader text="Joining Game Session..."/>
    }

    const gameInstanceId = gameRoomInstance.gameInstanceIds[gameRoomInstance.arcadeGameMongoId]
    if(!gameInstanceId) {
      return <LinearIndeterminateLoader/>
      // return <Loader text="Creating Game Instance..."/>
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
  connect(mapStateToProps, { joinGameRoom, editGameRoom, leaveGameRoom, addGameRoom, endGameRoom, initializeUnlockableInterfaceIds, getUserByMongoId })
)(MultiplayerGameRoomContext)
