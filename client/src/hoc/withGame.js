import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../app/ui/Loader/Loader';
import { loadGame, unloadGame } from '../store/actions/gameActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithGame extends Component {

    componentDidMount() {
      const { match, gameId, loadGame } = this.props

      if(gameId) {
        loadGame(gameId)
      } else if(match?.params?.gameId) {
        const matchId = match.params.gameId;
        loadGame(matchId);
      }
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
      const { unloadGame } = this.props

      unloadGame()
    }

    render() {
      const { game } = this.props

      if(!game.gameModel) {
        return <Loader text="Loading Game Data..."/>
      }

      if(!game.isSpriteSheetDataLoaded) {
        return <Loader text="Loading Sprites..."/>
      }

      return <ChildComponent {...this.props} />
    }
  }

  const mapStateToProps = (state) => ({
    game: state.game
  });

  return connect(mapStateToProps, { loadGame, unloadGame })(WithGame)
};
