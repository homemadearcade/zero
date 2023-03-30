import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { publishCobrowsing, unpublishCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing } from '../store/actions/game/cobrowsingActions';
import CobrowsingErrorStates from '../experience/cobrowsing/CobrowsingErrorStates/CobrowsingErrorStates';

// eslint-disable-next-line import/no-anonymous-default-export
class CobrowsingSession extends Component {
  componentDidMount() {
    const { match } = this.props
    const cobrowsingUserId = this.props.userMongoId ? this.props.userMongoId : match.params.cobrowsingUserId;
    this.startCobrowsing(cobrowsingUserId)
  }

  componentDidUpdate(oldProps) {
    this.switchCobrowsing(oldProps, this.props)
  }

  componentWillUnmount() {
    this.stopCobrowsing()
  }

  async switchCobrowsing(oldProps, newProps) {
    if(oldProps.match.params.cobrowsingUserId !== newProps.match.params.cobrowsingUserId) {
      await this.stopCobrowsing()
      await this.startCobrowsing(newProps.match.params.cobrowsingUserId)
    } 
  }

  async startCobrowsing(userMongoId) {     
    const { auth: { me }, lobbyInstance: { lobbyInstance }, publishCobrowsing, subscribeCobrowsing } = this.props
    
    if(userMongoId === me.id) {
      await publishCobrowsing({lobbyInstanceMongoId: lobbyInstance.id})
    } else {
      await subscribeCobrowsing({lobbyInstanceMongoId: lobbyInstance.id, userMongoId: userMongoId})
    }
  }

  async stopCobrowsing() {
    const { cobrowsing: { isSubscribedCobrowsing, cobrowsingUser }, lobbyInstance: { lobbyInstance }, unsubscribeCobrowsing, unpublishCobrowsing } = this.props

    if(isSubscribedCobrowsing) {
      await unsubscribeCobrowsing({lobbyInstanceMongoId: lobbyInstance.id, userMongoId: cobrowsingUser.id})
    } else {
      await unpublishCobrowsing({lobbyInstanceMongoId: lobbyInstance.id})
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
  lobbyInstance: state.lobbyInstance,
  auth: state.auth
});

export default compose(
  withRouter, 
  connect(mapStateToProps, { publishCobrowsing, unpublishCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing })
)(CobrowsingSession)
