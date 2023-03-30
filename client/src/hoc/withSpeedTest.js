import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLobbyMember } from '../store/actions/experience/lobbyInstanceActions';
import { addUserSpeedTest } from '../store/actions/user/userActions';
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
      if(isLocalHost()) return 
      
      const { lobbyInstance: { lobbyInstance }, auth: { me }, updateLobbyMember, addUserSpeedTest} = this.props
      const speedTest = await addUserSpeedTest()
    
      if(lobbyInstance?.id) {
        updateLobbyMember({
          lobbyInstanceMongoId: lobbyInstance?.id,
          userMongoId: me.id, 
          member: {
            internetSpeedTestResults: speedTest
          }
        })
      }
      
      this.setState( {
        testResults: speedTest
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
      lobbyInstance: state.lobbyInstance
    }
  }

  return connect(mapStateToProps, { updateLobbyMember, addUserSpeedTest })(ComposedComponent);
};
