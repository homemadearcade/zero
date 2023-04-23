/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../../scenes/PreloaderScene';

import './GameView.scss';
import { gameHeight, gameWidth, GAME_INSTANCE_DID, noPhaserUpdateDelta, PRELOADER_SCENE } from '../../constants';
import { DEFAULT_THEME_COLOR, PHASER_ERROR } from '../../../constants';

import { getCurrentGameScene } from '../../../utils/editorUtils';
import { setGameInstance } from '../../../store/actions/webPageActions';

import Cutscene from '../../cutscene/Cutscene/Cutscene';
import StateScreen from '../../gameRoomInstance/GameStateScreen/GameStateScreen';
import store from '../../../store';
import ControlsPopup from '../ControlsPopup/ControlsPopup';
import { changeErrorState, clearErrorState } from '../../../store/actions/errorsActions';
import { generateUniqueId } from '../../../utils/webPageUtils';
import GameViewEmpty from '../GameViewEmpty/GameViewEmpty';
import { updateTheme } from '../../../store/actions/themeActions';

const config= {
  type: Phaser.WEBGL,
  pixelArt: true,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'PhaserGame',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameWidth,
    height: gameHeight
  },
  physics: {
    default: 'arcade',
    // matter: {
    //   debug: {
    //     showBody: true,
    //     showStaticBody: true
    //   },
    //   plugins: {
    //     wrap: true
    //   },
    // },
    arcade: {
      // debug: true,
      // debugShowBody: true,
      // debugShowStaticBody: true,
      // debugShowVelocity: true,
    }
  },
  plugins: {
    // global: [
    //   {
    //     key: 'WaterBodyPlugin',
    //     plugin: WaterBodyPlugin,
    //     start: true,
    //   }
    // ],
    // scene: [
    //   {
    //     plugin: PhaserMatterCollisionPlugin, // The plugin class
    //     key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
    //     mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
    //   }
    // ]
  }
}

const GameView = (props) => {
  useEffect(() => {
    return () => {
      props.updateTheme({
        primaryColor: DEFAULT_THEME_COLOR
      })
    }
  }, [])

  if(!props.gameModel.gameModel) {
    return <GameViewEmpty></GameViewEmpty>
  }

  if(props.gameRoomInstance.gameRoomInstance.isOnlineMultiplayer === true) {
    if(!props.gameRoomInstance.gameRoomInstance.id) {
      console.log('game room instance id is null', props.gameRoomInstance)
      return <GameViewEmpty/>
    }
  }

  return <PhaserGame {...props}></PhaserGame>
}

const PhaserGame = ({
  setGameInstance, 
  changeErrorState, 
  clearErrorState,
  children,
  gameRoomInstance: { gameRoomInstance },
}) => {
  // const [gameInstance, setComponentGameInstance] = useState()

  useEffect(() => {
    const gameInstance = new Phaser.Game(config);
    const gameInstanceId =  GAME_INSTANCE_DID + generateUniqueId()
    gameInstance.scene.add(PRELOADER_SCENE, new PreloaderScene({...gameRoomInstance, gameInstanceId}), true);
    setGameInstance(gameInstance, gameInstanceId)
    console.log('setting game instance id', gameInstanceId)
    return () => {
      console.log('destroyed game', gameInstanceId, gameInstance)

      gameInstance.destroy(true);      
      const scene = getCurrentGameScene(gameInstance)
      scene.setPlayerGameLoaded(null)
      gameInstance.scene.scenes.forEach(scene => {
        console.log('destroying scene', scene)
        scene.unload()
      })

      setGameInstance(null, null)
    }
  }, []);

  useEffect(() => {
    const connectionInterval = setInterval(() => {
      const scene = getCurrentGameScene(store.getState().webPage.gameInstance)
      const lastUpdate = scene.lastUpdate
      if(lastUpdate) {
        if(lastUpdate + noPhaserUpdateDelta < Date.now()) {
          changeErrorState(PHASER_ERROR, {})
          scene.lastUpdate = null
        } else if(store.getState().errors.errorStates[PHASER_ERROR].on){
          clearErrorState(PHASER_ERROR)
        }
      }

    }, 1000)

    return () => {
      clearInterval(connectionInterval)
    }
  }, [])

  return (
    <div className="GameView">
      {children}
      <Cutscene/>
      <StateScreen/>
      <ControlsPopup/>
      <div id="PhaserGame"/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  gameRoomInstance: state.gameRoomInstance,
});

export default connect(mapStateToProps, { setGameInstance, changeErrorState, clearErrorState, updateTheme })(GameView);