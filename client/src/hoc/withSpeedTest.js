import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLobbyUser } from '../store/actions/lobbyActions';
import { addUserSpeedTest } from '../store/actions/userActions';
import Loader from '../ui/Loader/Loader';
import { inIframe, isLocalHost } from '../utils/webPageUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        testResults: isLocalHost() ? {
          downloadSpeed: 1000,
          uploadSpeed: 100,
        } : null
        // testResults: null
      }
    }

    async componentDidMount() {
      const { lobby: { lobby }, auth: { me }, updateLobbyUser, addUserSpeedTest} = this.props
      const {downloadSpeed, uploadSpeed} = await addUserSpeedTest()
    
      if(lobby?.id) {
        updateLobbyUser({
          lobbyId: lobby?.id,
          userId: me.id, 
          user: {
            internetSpeedTestResults: {
              downloadSpeed,
              uploadSpeed
            }
          }
        })
      }

      this.setState( {
        testResults: {
          downloadSpeed,
          uploadSpeed
        }
      })

      // this.clearTimeout = setInterval(() => {
      //   if(this.state.fullscreenDecision === 'fullscreen' && !document.fullscreenElement) {
      //     this.setState({
      //       fullscreenDecision: null
      //     })
      //   }
      // }, 1000)
    }

    componentWillUnmount() {
      // clearTimeout(this.clearTimeout)
    }

    render() {
      
       if(!this.state.testResults && !inIframe()) {
        return <Loader text="Checking internet speed..."></Loader>
      } else {
        return <ChildComponent {...this.props} />;
      }
    }
  }

  function mapStateToProps(state) {
    return {
      auth: state.auth,
      lobby: state.lobby
    }
  }

  return connect(mapStateToProps, { updateLobbyUser, addUserSpeedTest })(ComposedComponent);
};
