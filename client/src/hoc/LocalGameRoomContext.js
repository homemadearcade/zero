import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addGameRoom, editGameRoom, endGameRoom } from '../store/actions/game/gameRoomInstanceActions';
import { initializeUnlockableInterfaceIds } from '../store/actions/game/unlockableInterfaceActions';
import { getUserByMongoId } from '../store/actions/user/userActions';
import Loader from '../ui/Loader/Loader';

class LocalGameRoomContext extends Component {
  componentWillMount() {
    const { room, editGameRoom } = this.props
    editGameRoom(null, room)

    this.joinGameRoom()
  }

  async joinGameRoom() {
    const { getUserByMongoId, experienceModel : { experienceModel }, auth : { me }, initializeUnlockableInterfaceIds } = this.props

    if(experienceModel?.id) {
      const interfaceIds = await getUserByMongoId(me.id).unlockableInterfaceIds[experienceModel.id]
      initializeUnlockableInterfaceIds(interfaceIds ? interfaceIds: {})
    } else {
      initializeUnlockableInterfaceIds({all: true})
    }
  }

  componentWillUnmount() {
    const { endGameRoom } = this.props
    endGameRoom()
  }


  render() {
    const { children, gameRoomInstance: { isLoading, isJoining }} = this.props;
  
    if(isJoining || isLoading) {
      return <Loader text="Starting Game Session..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }
}

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance,
  experienceModel: state.experienceModel,
  auth: state.auth,
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { editGameRoom,  addGameRoom, endGameRoom, initializeUnlockableInterfaceIds, getUserByMongoId })
)(LocalGameRoomContext)
