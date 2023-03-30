import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../ui/Loader/Loader';
import store from '../store';
import { loadArcadeGameByMongoId, unloadArcadeGame } from '../store/actions/game/arcadeGameActions';
import { getSpritesheetData } from '../store/actions/game/gameModelActions';
import { clearCutscenes } from '../store/actions/game/playerInterfaceActions';
import { closeContextMenu } from '../store/actions/game/contextMenuActions';
import { getLibrary } from '../store/actions/library/libraryActions';

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
      if(oldProps.arcadeGameMongoId !== newProps.arcadeGameMongoId) {
        await this.unloadGame()
        setTimeout(() => {
          this.loadGame(newProps.arcadeGameMongoId)
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
      const { 
        gameModel,
        entityClassLibrary,
        relationLibrary,
        relationTagLibrary,
        effectLibrary,
        eventLibrary,
        interfacePresetLibrary,
        library
       } = this.props

      if(library.isLoading ||
        !entityClassLibrary.entityClassLibrary
        || !relationLibrary.relationLibrary
        || !relationTagLibrary.relationTagLibrary
        || !effectLibrary.effectLibrary
        || !eventLibrary.eventLibrary
        || !interfacePresetLibrary.interfacePresetLibrary
      ) {
        return <Loader text="Loading Library..."/>
      }

      if(!gameModel.isSpriteSheetDataLoaded) {
        return <Loader text="Loading Sprites..."/>
      }

      return <ChildComponent {...this.props} />
    }
  }

  const mapStateToProps = (state) => ({
    gameModel: state.gameModel,
    entityClassLibrary: state.entityClassLibrary,
    relationLibrary: state.relationLibrary,
    relationTagLibrary: state.relationTagLibrary,
    effectLibrary: state.effectLibrary,
    eventLibrary: state.eventLibrary,
    interfacePresetLibrary: state.interfacePresetLibrary,
    library: state.library,
  });

  return connect(mapStateToProps, { closeContextMenu, loadArcadeGameByMongoId, unloadArcadeGame, getSpritesheetData, clearCutscenes, getLibrary })(WithGame)
};
