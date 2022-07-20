import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../app/ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { startCobrowsing, endCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing } from '../store/actions/cobrowsingActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithCobrowsing extends Component {
    componentDidMount() {
      const { match, auth: { me }, lobby: { lobby }, startCobrowsing, subscribeCobrowsing } = this.props
      const cobrowsingUserId = match.params.cobrowsingUserId;

      if(cobrowsingUserId === me.id) {
        startCobrowsing({lobbyId: lobby.id})
      } else {
        subscribeCobrowsing({lobbyId: lobby.id, userId: cobrowsingUserId})
      }
    }

    componentWillUnmount() {
      const { cobrowsing: { isSubscribedCobrowsing, cobrowsingUser }, lobby: {lobby}, unsubscribeCobrowsing, endCobrowsing } = this.props
      if(isSubscribedCobrowsing) {
        unsubscribeCobrowsing({lobbyId: lobby.id, userId: cobrowsingUser.id})
      } else {
        endCobrowsing({lobbyId: lobby.id})
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
    connect(mapStateToProps, { startCobrowsing, endCobrowsing, subscribeCobrowsing, unsubscribeCobrowsing })
  )(WithCobrowsing)
};
