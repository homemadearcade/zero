import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../ui/Loader/Loader';
import store from '../store';
import { loadArcadeGame, unloadArcadeGame } from '../store/actions/game/arcadeGameActions';
import { getSpritesheetData } from '../store/actions/game/gameModelActions';
import { clearCutscenes } from '../store/actions/game/playerInterfaceActions';
import { closeContextMenu } from '../store/actions/game/contextMenuActions';
import { getEntityClassLibrary } from '../store/actions/library/entityClassLibraryActions';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithGame extends Component {

    componentDidMount() {
      this.loadGame()
      window.addEventListener('beforeunload', this.askBeforeClosing); 
    }

    componentDidUpdate(oldProps) {
      this.switchGame(oldProps, this.props)
    }

    async loadGame() {
      const { match, gameId, loadArcadeGame, gameModel, getSpritesheetData, getEntityClassLibrary } = this.props

      await getEntityClassLibrary()

      if(gameId) {
        await loadArcadeGame(gameId)
      } else if(match?.params?.gameId) {
        const matchId = match.params.gameId;
        await loadArcadeGame(matchId);
      }

      if(!gameModel.spritesByDescriptor) {
        getSpritesheetData()
      }

    }

    async unloadGame() {
      const { unloadArcadeGame, clearCutscenes, closeContextMenu } = this.props
     
      unloadArcadeGame()
      clearCutscenes()
      closeContextMenu()
    }

    async switchGame(oldProps, newProps) {
      if(oldProps.gameId !== newProps.gameId) {
        await this.unloadGame()
        setTimeout(() => {
          this.loadGame(newProps.gameId)
        }, 100)
      }
    }

    askBeforeClosing = (e) => {
      const gameInstance = store.getState().webPage.gameInstance
      if(gameInstance) {
        // const scene = getCurrentGameScene(gameInstance)
        


        //     e.returnValue = ''
        //     return


      }
    }

    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.askBeforeClosing)
      this.unloadGame()
    }

    render() {
      const { gameModel, entityClassLibrary } = this.props

      // if(!gameModel.gameModel) {
      //   return <Loader text="Loading Game Data..."/>
      // }
      if(entityClassLibrary.isLoading || !entityClassLibrary.entityClassLibrary) {
        return <Loader text="Loading Entity Library..."/>
      }

      if(!gameModel.isSpriteSheetDataLoaded) {
        return <Loader text="Loading Sprites..."/>
      }

      return <ChildComponent {...this.props} />
    }
  }

  const mapStateToProps = (state) => ({
    gameModel: state.gameModel,
    entityClassLibrary: state.entityClassLibrary
  });

  return connect(mapStateToProps, { closeContextMenu, loadArcadeGame, unloadArcadeGame, getSpritesheetData, clearCutscenes, getEntityClassLibrary })(WithGame)
};
