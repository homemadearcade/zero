import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../ui/Loader/Loader';
import store from '../store';
import { loadArcadeGameByMongoId, unloadArcadeGame } from '../store/actions/game/arcadeGameActions';
import { getSpritesheetData } from '../store/actions/game/gameModelActions';
import { clearCutscenes } from '../store/actions/game/playerInterfaceActions';
import { closeContextMenu } from '../store/actions/game/contextMenuActions';
import { getLibrary } from '../store/actions/library/libraryActions';
import ArcadeGameLoader from '../game/ui/ArcadeGameLoader/ArcadeGameLoader';
import { Fade } from '@mui/material';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class WithGame extends Component {
    state = {}

    componentDidMount() {
      this.loadGame()
      window.addEventListener('beforeunload', this.askBeforeClosing); 
    }

    componentDidUpdate(oldProps) {
      this.switchGame(oldProps, this.props)
    }

    async loadGame() {
      const { 
        match,
        arcadeGameMongoId,
        loadArcadeGameByMongoId,
        gameModel,
        getSpritesheetData,
        getLibrary,
      } = this.props

      await getLibrary()

      if(arcadeGameMongoId) {
        await loadArcadeGameByMongoId(arcadeGameMongoId)
      } else if(match?.params?.arcadeGameMongoId) {
        const matchId = match.params.arcadeGameMongoId;
        await loadArcadeGameByMongoId(matchId);
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
      this.checkIfGameIsLoaded(newProps)
      if(oldProps.arcadeGameMongoId !== newProps.arcadeGameMongoId) {
        await this.unloadGame()

        setTimeout(() => {
          this.loadGame(newProps.arcadeGameMongoId)
        }, 100)
      }
    }

    checkIfGameIsLoaded(newProps) {
      const { 
        gameModel,
        entityModelLibrary,
        relationLibrary,
        relationTagLibrary,
        effectLibrary,
        eventLibrary,
        interfacePresetLibrary,
        library
       } = this.props

      const isLibraryLoading = (library.isLoading ||
        !entityModelLibrary.entityModelLibrary
        || !relationLibrary.relationLibrary
        || !relationTagLibrary.relationTagLibrary
        || !effectLibrary.effectLibrary
        || !eventLibrary.eventLibrary
        || !interfacePresetLibrary.interfacePresetLibrary)

      const isSpriteSheetsLoading = !gameModel.isSpriteSheetDataLoaded

      const isGameModelLoading = !gameModel.gameModel

      const isLoaded = !isLibraryLoading && !isSpriteSheetsLoading && !isGameModelLoading

      if(isLoaded && !this.state.isLoaded) {
        this.setState({
          isLoaded: true,
        })
        setTimeout(() => {
          this.setState({
            isShowingGame: true,
          })
        }, 10)
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
      return <>
        {this.state.isLoaded && <ChildComponent {...this.props} />}
        <Fade in={!this.state.isShowingGame}>
          <div><ArcadeGameLoader text="Loading..."/></div>
        </Fade>
      </>
    }
  }

  const mapStateToProps = (state) => ({
    gameModel: state.gameModel,
    entityModelLibrary: state.entityModelLibrary,
    relationLibrary: state.relationLibrary,
    relationTagLibrary: state.relationTagLibrary,
    effectLibrary: state.effectLibrary,
    eventLibrary: state.eventLibrary,
    interfacePresetLibrary: state.interfacePresetLibrary,
    library: state.library,
  });

  return connect(mapStateToProps, { closeContextMenu, loadArcadeGameByMongoId, unloadArcadeGame, getSpritesheetData, clearCutscenes, getLibrary })(WithGame)
};
