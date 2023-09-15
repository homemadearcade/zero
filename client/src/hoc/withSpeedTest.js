import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLobbyMember } from '../store/actions/experience/lobbyInstanceActions';
import { addUserSpeedTest } from '../store/actions/user/userActions';
import Loader from '../ui/Loader/Loader';
import { inIframe, isLocalHost } from '../utils/webPageUtils';
import SpeedTestTable from '../ui/SpeedTestTable/SpeedTestTable';
import Button from '../ui/Button/Button';
import Alert from '../ui/Alert/Alert';
import LinearIndeterminateLoader from '../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';
import { Card, DialogActions, DialogTitle, Paper } from '@mui/material';
import Dialog from '../ui/Dialog/Dialog';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        // byPassTest: isLocalHost(),
        testResults: null
      }
    }

    async runSpeedTest() {
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

    }

    async componentDidMount() {
      // if(isLocalHost()) return 
      
      this.runSpeedTest()
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
      const { lobbyInstance: { lobbyInstance } } = this.props

      if(this.state.byPassTest) {
        return <ChildComponent {...this.props} />;
      }

      if(!this.state.testResults && !inIframe()) {
        return <LinearIndeterminateLoader/>
      }

      if(this.state.testResults) {
        const warnings = []

        if(lobbyInstance?.id) {
          if(this.state.testResults.uploadSpeed && this.state.testResults.uploadSpeed < 100) {//3) {
            warnings.push(<Alert severity="warning">Your internet's upload speed is too slow for this experience</Alert>)
          }

          if(this.state.testResults.downloadSpeed && this.state.testResults.downloadSpeed < 10) {
            warnings.push(<Alert severity="warning">Your internet's download speed is too slow for this experience</Alert>)
          }

          if(warnings.length > 0) {
            return <Dialog open>
              <DialogTitle>Internet Speed Test Results</DialogTitle>
              {warnings}
              <SpeedTestTable mini key={0} rows={[this.state.testResults]}/>
              <>
                <Button onClick={() => {
                  this.setState({
                    testResults: null
                  })
                  this.runSpeedTest()
                }}>I'm going to retry</Button>
                <Button onClick={() => {
                  this.setState({
                    byPassTest: true
                  })
                }}>Id like to continue with the slow internet version</Button>
              </>
            </Dialog>
          }
        } else {  
            if(this.state.testResults.uploadSpeed && this.state.testResults.uploadSpeed < 100) {//3) {
              warnings.push(<Alert severity="warning">Your internet's upload speed is too slow</Alert>)
            }

            if(this.state.testResults.downloadSpeed && this.state.testResults.downloadSpeed < 10) {
              warnings.push(<Alert severity="warning">Your internet's download speed is too slow</Alert>)
            }

            return <Dialog open>
            <DialogTitle>Internet Speed Test Results</DialogTitle>
              {warnings}
              {warnings.length && <Alert severity="info">Your internet connection isn’t fast enough. Please find a better internet connection before your experience begins</Alert>}
              {!warnings.length && <Alert severity="success">The internet you are using right now, works great! We recommend using this connection during your experience</Alert>}
              <SpeedTestTable mini key={0} rows={[this.state.testResults]}/>
              <>
                <Button onClick={() => {
                  this.setState({
                    testResults: null
                  })
                  this.runSpeedTest()
                }}>I'd like to test again</Button>
              </>
            </Dialog>
        }
      }

      return <ChildComponent {...this.props} />;
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
