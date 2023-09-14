import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { loadArcadeGameByMongoId, unloadArcadeGame } from '../store/actions/game/arcadeGameActions';
import { getSpritesheetData } from '../store/actions/game/gameModelActions';
import { changePlayerEntity, clearCutscenes } from '../store/actions/game/playerInterfaceActions';
import { closeContextMenu } from '../store/actions/game/contextMenuActions';
import ArcadeGameLoader from '../game/ui/ArcadeGameLoader/ArcadeGameLoader';
import { Fade } from '@mui/material';
import Loader from '../ui/Loader/Loader';
import LinearIndeterminateLoader from '../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';

// eslint-disable-next-line import/no-anonymous-default-export
class GameContext extends Component {
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
    } = this.props

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
        this.setState({
          isLoaded: false,
          isShowingGame: false,
          hideFadeout: false
      })

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
      // setTimeout(() => {
      //   this.setState({
      //     isShowingGame: true,
      //   })
      // }, 800)
      // setTimeout(() => {
      //   this.setState({
      //     hideFadeout: true,
      //   })
      // }, 1000)
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

  renderChildren() {
    const { children } = this.props;
    return children instanceof Function ? children(this.props) : children
  }

      //   {!this.state.hideFadeout && <Fade in={!this.state.isShowingGame}>
      //   <div><ArcadeGameLoader text="Loading..."/></div>
      // </Fade>}

  render() {
    const { gameModel: { isLoading, isSpriteSheetDataLoaded, gameModel } } = this.props

    // console.log(gameRoomInstance) 

    if(!isSpriteSheetDataLoaded) {
      return <LinearIndeterminateLoader/>
    }

    if(isLoading || !gameModel?.id) {
      return <LinearIndeterminateLoader/>
    }

    return this.renderChildren()
  }
}

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  // gameRoomInstance: state.gameRoomInstance,
  entityModelLibrary: state.entityModelLibrary,
  relationLibrary: state.relationLibrary,
  relationTagLibrary: state.relationTagLibrary,
  effectLibrary: state.effectLibrary,
  eventLibrary: state.eventLibrary,
  interfacePresetLibrary: state.interfacePresetLibrary,
  library: state.library,
});

export default connect(mapStateToProps, { closeContextMenu, loadArcadeGameByMongoId, unloadArcadeGame, getSpritesheetData, clearCutscenes})(GameContext)
