import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addGameRoom, editGameRoom, endGameRoom } from '../store/actions/gameRoomActions';
import Loader from '../ui/Loader/Loader';

class LocalGameRoomContext extends Component {
  componentWillMount() {
    const { room, editGameRoom } = this.props
    editGameRoom(null, room)
  }

  componentWillUnmount() {
    const { endGameRoom } = this.props
    endGameRoom()
  }

  render() {
    const { children, gameRoom: { isLoading, isJoining }} = this.props;
  
    if(isJoining || isLoading) {
      return <Loader text="Starting Game Session..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }
}

const mapStateToProps = (state) => ({
  gameRoom: state.gameRoom
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { editGameRoom,  addGameRoom, endGameRoom })
)(LocalGameRoomContext)
