import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { GAME_ROOM_INSTANCE_DID } from '../constants';
import { addGameRoom, editGameRoom, endGameRoom } from '../store/actions/game/gameRoomInstanceActions';
import { initializeUnlockableInterfaceIds } from '../store/actions/game/unlockedInterfaceActions';
import { getUserByMongoId } from '../store/actions/user/userActions';
import LinearIndeterminateLoader from '../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';
import Loader from '../ui/Loader/Loader';
import { generateUniqueId } from '../utils';
import GameContext from './GameContext';

class LocalGameRoomContext extends Component {
  state = {
    isUnlockableInterfaceIdsInitialized: false
  }

  componentWillMount() {
    const { room, editGameRoom, arcadeGameMongoId } = this.props
    const gameRoomInstanceId = GAME_ROOM_INSTANCE_DID + generateUniqueId()
    
    editGameRoom(null, {
      ...room,
      gameInstanceIds: {
        [arcadeGameMongoId]: gameRoomInstanceId
      },
    })

    this.joinGameRoom()
  }

  async joinGameRoom() {
    const { getUserByMongoId, appSettings: { appSettings }, experienceModel : { experienceModel }, auth : { me }, initializeUnlockableInterfaceIds } = this.props

    const response = await getUserByMongoId(me.id)
    const user = response.data.user
    const editorExperienceModelMongoId = user.editorExperienceModelMongoId || appSettings.editorExperienceModelMongoId
    const unlockedInterfaceIds = user.unlockedInterfaceIds[experienceModel?.id] || user.unlockedInterfaceIds[editorExperienceModelMongoId]
    initializeUnlockableInterfaceIds(unlockedInterfaceIds ? unlockedInterfaceIds: {})

    this.setState({
      isUnlockableInterfaceIdsInitialized: true
    })
  }

  componentWillUnmount() {
    const { endGameRoom } = this.props
    endGameRoom()
  }

  render() {
    const { children, gameRoomInstance: { gameRoomInstance, isLoading, isJoining }} = this.props;
  
    function renderChildren() {
      return children instanceof Function ? children(this.props) : children
    }

    if(isJoining || isLoading) {
      return <LinearIndeterminateLoader/>
      // return <Loader text="Starting Game Session..."/>
    }

    if(!this.state.isUnlockableInterfaceIdsInitialized) {
            // return <Loader text="Initializing Interface Ids.."/>
      return <LinearIndeterminateLoader/>
    }

    

    const gameInstanceId = gameRoomInstance.gameInstanceIds[gameRoomInstance.arcadeGameMongoId]
    return <GameContext arcadeGameMongoId={gameRoomInstance.arcadeGameMongoId} gameInstanceId={gameInstanceId}>
      {renderChildren()}
    </GameContext>  }
}

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance,
  experienceModel: state.experienceModel,
  auth: state.auth,
  appSettings: state.appSettings,
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { editGameRoom,  addGameRoom, endGameRoom, initializeUnlockableInterfaceIds, getUserByMongoId })
)(LocalGameRoomContext)
