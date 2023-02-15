import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { publishCobrowsing, unpublishCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing } from '../store/actions/cobrowsingActions';
import CobrowsingErrorStates from '../game/cobrowsing/CobrowsingErrorStates/CobrowsingErrorStates';

// eslint-disable-next-line import/no-anonymous-default-export
class WithCobrowsing extends Component {
  componentDidMount() {
    const { match } = this.props
    const cobrowsingUserId = this.props.userId ? this.props.userId : match.params.cobrowsingUserId;
    if(cobrowsingUserId === this.props.cobrowsing.cobrowsingUser.id) {
      // 'already cobrowsing this user :)
      window.preventCobrowsingUnmount = true
      return 
    } 

    this.startCobrowsing(cobrowsingUserId)
  }

  componentDidUpdate(oldProps) {
    this.switchCobrowsing(oldProps, this.props)
  }

  componentWillUnmount() {
    setTimeout(() => {
      if(window.preventCobrowsingUnmount) return 
      // we just unmounted this component!
      this.stopCobrowsing()
    }, 1000)
  }

  async switchCobrowsing(oldProps, newProps) {
    if(oldProps.match.params.cobrowsingUserId !== newProps.match.params.cobrowsingUserId) {
      await this.stopCobrowsing()
      await this.startCobrowsing(newProps.match.params.cobrowsingUserId)
    } 
  }

  async startCobrowsing(userId) {     
    const { auth: { me }, lobby: { lobby }, publishCobrowsing, subscribeCobrowsing } = this.props
    
    if(userId === me.id) {
      await publishCobrowsing({lobbyId: lobby.id})
    } else {
      await subscribeCobrowsing({lobbyId: lobby.id, userId: userId})
    }
  }

  async stopCobrowsing() {
    const { cobrowsing: { isSubscribedCobrowsing, cobrowsingUser }, lobby: { lobby }, unsubscribeCobrowsing, unpublishCobrowsing } = this.props

    if(isSubscribedCobrowsing) {
      await unsubscribeCobrowsing({lobbyId: lobby.id, userId: cobrowsingUser.id})
    } else {
      await unpublishCobrowsing({lobbyId: lobby.id})
    }
  }

  renderBody() {
    const { cobrowsing: { cobrowsingUser }, children} = this.props

    if(cobrowsingUser) {
      return <>
        {children instanceof Function ? children(this.props) : children}
      </>
    }

    return <Loader text="Joining User..."/>
  }

  render() {
    return <>
      <CobrowsingErrorStates></CobrowsingErrorStates>
      {this.renderBody()}
    </>
  }
}

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
  lobby: state.lobby,
  auth: state.auth
});

export default compose(
  withRouter, 
  connect(mapStateToProps, { publishCobrowsing, unpublishCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing })
)(WithCobrowsing)
