import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addGameSession, editGameSession, endGameSession } from '../store/actions/gameSessionActions';
import Loader from '../ui/Loader/Loader';

class LocalGameSessionContext extends Component {
  componentWillMount() {
    const { session, editGameSession } = this.props
    editGameSession(null, session)
  }

  componentWillUnmount() {
    const { endGameSession } = this.props
    endGameSession()
  }

  render() {
    const { children, gameSession: { isLoading, isJoining }} = this.props;
  
    if(isJoining || isLoading) {
      return <Loader text="Starting Game Session..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }
}

const mapStateToProps = (state) => ({
  gameSession: state.gameSession
  // cobrowsing: state.cobrowsing
});

export default compose( 
  connect(mapStateToProps, { editGameSession,  addGameSession, endGameSession })
)(LocalGameSessionContext)
