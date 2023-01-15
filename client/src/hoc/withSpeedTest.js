import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLobbyUser } from '../store/actions/lobbyActions';
import Button from '../ui/Button/Button';
import Loader from '../ui/Loader/Loader';
import Typography from '../ui/Typography/Typography';
import { testInternetSpeed } from '../utils/networkUtils';
import { isLocalHost, requestFullscreen } from '../utils/webPageUtils';

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
      }
    }

    async componentDidMount() {
      const { lobby: { lobby }, auth: { me }, updateLobbyUser} = this.props
      const [downloadSpeed, uploadSpeed] = await testInternetSpeed()
    
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
      
       if(!this.state.testResults) {
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

  return connect(mapStateToProps, { updateLobbyUser })(ComposedComponent);
};
