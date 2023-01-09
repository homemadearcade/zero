import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { publishCobrowsing, unpublishCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing } from '../store/actions/cobrowsingActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithCobrowsing extends Component {
    componentDidMount() {
      const { match } = this.props
      const cobrowsingUserId = match.params.cobrowsingUserId;

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

    render() {
      const { cobrowsing: { cobrowsingUser }} = this.props

      if(cobrowsingUser) {
        return <ChildComponent {...this.props} />
      }

      return <Loader text="Joining User..."/>
    }
  }

  const mapStateToProps = (state) => ({
    cobrowsing: state.cobrowsing,
    lobby: state.lobby,
    auth: state.auth
  });

  return compose(
    withRouter, 
    connect(mapStateToProps, { publishCobrowsing, unpublishCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing })
  )(WithCobrowsing)
};
