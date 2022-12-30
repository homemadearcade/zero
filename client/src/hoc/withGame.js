import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../ui/Loader/Loader';
import store from '../store';
import { saveAllCurrentCanvases } from '../store/actions/codrawingActions';
import { loadArcadeGame, unloadArcadeGame } from '../store/actions/arcadeGameActions';
import { getCurrentGameScene } from '../utils/editorUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithGame extends Component {

    componentDidMount() {
      const { match, gameId, loadArcadeGame } = this.props


      const doLoadGame = async () => {
        if(gameId) {
          await loadArcadeGame(gameId)
        } else if(match?.params?.gameId) {
          const matchId = match.params.gameId;
          await loadArcadeGame(matchId);
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
      const { unloadArcadeGame } = this.props

      unloadArcadeGame()
      window.removeEventListener('beforeunload', this.askBeforeClosing)
    }

    render() {
      const { gameModel } = this.props

      if(!gameModel.gameModel) {
        return <Loader text="Loading Game Data..."/>
      }

      if(!gameModel.isSpriteSheetDataLoaded) {
        return <Loader text="Loading Sprites..."/>
      }

      return <ChildComponent {...this.props} />
    }
  }

  const mapStateToProps = (state) => ({
    gameModel: state.gameModel
  });

  return connect(mapStateToProps, { loadArcadeGame, unloadArcadeGame })(WithGame)
};
