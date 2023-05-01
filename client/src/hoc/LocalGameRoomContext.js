import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addGameRoom, editGameRoom, endGameRoom } from '../store/actions/game/gameRoomInstanceActions';
import { initializeUnlockableInterfaceIds } from '../store/actions/game/unlockedInterfaceActions';
import { getUserByMongoId } from '../store/actions/user/userActions';
import LinearIndeterminateLoader from '../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';
import Loader from '../ui/Loader/Loader';

class LocalGameRoomContext extends Component {
  state = {
    isUnlockableInterfaceIdsInitialized: false
  }

  componentWillMount() {
    const { room, editGameRoom } = this.props
    editGameRoom(null, room)

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
    const { children, gameRoomInstance: { isLoading, isJoining }} = this.props;
  
    if(isJoining || isLoading) {
      return <LinearIndeterminateLoader/>
      // return <Loader text="Starting Game Session..."/>
    }

    if(!this.state.isUnlockableInterfaceIdsInitialized) {
      return <LinearIndeterminateLoader/>
    }

    return children instanceof Function ? children(this.props) : children
  }
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
