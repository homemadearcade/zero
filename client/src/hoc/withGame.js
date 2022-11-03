import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../ui/Loader/Loader';
import store from '../store';
import { saveAllCurrentCanvases } from '../store/actions/codrawingActions';
import { loadGame, unloadGame } from '../store/actions/gameActions';
import { getCurrentGameScene } from '../utils/editorUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithGame extends Component {

    componentDidMount() {
      const { match, gameId, loadGame } = this.props


      const doLoadGame = async () => {
        if(gameId) {
          await loadGame(gameId)
        } else if(match?.params?.gameId) {
          const matchId = match.params.gameId;
          await loadGame(matchId);
        }
  
        window.addEventListener('beforeunload', this.askBeforeClosing);    
      }

      doLoadGame()
    }

    askBeforeClosing = (e) => {
      const gameInstance = store.getState().webPage.gameInstance
      if(gameInstance) {
        const scene = getCurrentGameScene(gameInstance)

        if(scene.backgroundLayer.unsavedChanges ||
          scene.playgroundLayer.unsavedChanges ||
          scene.foregroundLayer.unsavedChanges
        ) {
          setTimeout(() => {
            saveAllCurrentCanvases()
          })
          e.returnValue = ''
          return
        }
      }
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
      const { unloadGame } = this.props

      unloadGame()
      window.removeEventListener('beforeunload', this.askBeforeClosing)
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
