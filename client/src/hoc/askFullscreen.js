import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../ui/Button/Button';
import Typography from '../ui/Typography/Typography';
import { inIframe, isLocalHost, requestFullscreen } from '../utils/webPageUtils';

// eslint-disable-next-line import/no-anonymous-default-export
class AskFullscreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fullscreenDecision: inIframe() || isLocalHost() || (document.fullscreenElement ? 'fullscreen' : null)
    }
  }

  componentDidMount() {
    this.clearTimeout = setInterval(() => {
      if(this.state.fullscreenDecision === 'fullscreen' && !document.fullscreenElement) {
        this.setState({
          fullscreenDecision: null
        })
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearTimeout(this.clearTimeout)
  }

  render() {
    const { children} = this.props

    if(!this.state.fullscreenDecision) {
      return <div>
        <Typography variant="h4">Please set your browser window to fullscreen using the button below</Typography>
        <Button variant='contained' onClick={() => {
          this.setState({
            fullscreenDecision: 'fullscreen'
          })
          requestFullscreen()
        }}>Go Fullscreen</Button>
        <Button onClick={() => {
            this.setState({
            fullscreenDecision: 'skip'
          })
        }}>No, thank you</Button>
      </div>
    } else {
      return <>{children instanceof Function ? children(this.props) : children}</>
    }
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps, { })(AskFullscreen);
