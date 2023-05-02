import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { GAME_INSTANCE_DID } from '../game/constants';
import GameRoomErrorStates from '../game/gameRoomInstance/GameRoomErrorStates/GameRoomErrorStates';
import { addGameRoom, editGameRoom, endGameRoom, joinGameRoom, leaveGameRoom } from '../store/actions/game/gameRoomInstanceActions';
import { initializeUnlockableInterfaceIds } from '../store/actions/game/unlockedInterfaceActions';
import { getUserByMongoId } from '../store/actions/user/userActions';
import LinearIndeterminateLoader from '../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';
import Loader from '../ui/Loader/Loader';
import { generateUniqueId } from '../utils';
import GameContext from './GameContext';

class MultiplayerGameRoomContext extends Component {
  state = {
    isUnlockableInterfaceIdsInitialized: false
  }

  componentWillMount() {
    const { gameRoomInstanceMongoId } = this.props
    this.joinMultiplayerGameRoom(gameRoomInstanceMongoId)
  }

  joinMultiplayerGameRoom(gameRoomInstanceMongoId) {
    const {joinGameRoom, getUserByMongoId, appSettings: { appSettings }, editGameRoom, auth: { me }, experienceModel : { experienceModel }, initializeUnlockableInterfaceIds} = this.props
    
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

        const userResponse = await getUserByMongoId(me.id)
        const user = userResponse.data.user
        const editorExperienceModelMongoId = user.editorExperienceModelMongoId || appSettings.editorExperienceModelMongoId
        const unlockedInterfaceIds = user.unlockedInterfaceIds[experienceModel?.id] || user.unlockedInterfaceIds[editorExperienceModelMongoId]
        console.log('unlockedInterfaceIds: ', unlockedInterfaceIds, editorExperienceModelMongoId)
        initializeUnlockableInterfaceIds(unlockedInterfaceIds ? unlockedInterfaceIds: {})

        this.setState({
          isUnlockableInterfaceIdsInitialized: true
        })

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
  
  renderChildren() {
    const { children } = this.props;
    return children instanceof Function ? children(this.props) : children
  }

  renderBody() {
    const {  gameRoomInstance: { isLoading, isJoining, gameRoomInstance }} = this.props;
    


    if(isLoading) {
            // return <Loader text="Loading Game Session..."/>

      return <LinearIndeterminateLoader/>
    }
  
    if(isJoining && !gameRoomInstance.id) {
            // return <Loader text="Joining Game Session..."/>

      return <LinearIndeterminateLoader/>
    }

    if(!this.state.isUnlockableInterfaceIdsInitialized) {
      return <LinearIndeterminateLoader/>
    }

    const gameInstanceId = gameRoomInstance.gameInstanceIds[gameRoomInstance.arcadeGameMongoId]
    if(!gameInstanceId) {
            // return <Loader text="Creating Game Instance..."/>

      return <LinearIndeterminateLoader/>
    }

    return <GameContext arcadeGameMongoId={gameRoomInstance.arcadeGameMongoId} gameInstanceId={gameInstanceId}>
      {this.renderChildren()}
    </GameContext>
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
  appSettings: state.appSettings,
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { joinGameRoom, editGameRoom, leaveGameRoom, addGameRoom, endGameRoom, initializeUnlockableInterfaceIds, getUserByMongoId })
)(MultiplayerGameRoomContext)
