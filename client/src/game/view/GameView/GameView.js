/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../../scenes/PreloaderScene';

import './GameView.scss';
import { noPhaserUpdateDelta, PRELOADER_SCENE } from '../../constants';
import { DEFAULT_THEME_COLOR, PHASER_ERROR } from '../../../constants';

import { getCurrentGameScene } from '../../../utils/editorUtils';
import { setGameInstance } from '../../../store/actions/webPageActions';

import Cutscene from '../../cutscene/Cutscene/Cutscene';
import StateScreen from '../../gameRoomInstance/GameStateScreen/GameStateScreen';
import store from '../../../store';
import ControlsPopup from '../ControlsPopup/ControlsPopup';
import { changeErrorState, clearErrorState } from '../../../store/actions/errorsActions';
import GameViewEmpty from '../GameViewEmpty/GameViewEmpty';
import { updateTheme } from '../../../store/actions/themeActions';
import { getGameModelSize } from '../../../utils';

const config= {
  type: Phaser.WEBGL,
  pixelArt: true,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'PhaserGame',
    autoCenter: Phaser.Scale.CENTER_BOTH,
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

  const gameRoomInstance = props.gameRoomInstance.gameRoomInstance

  if(gameRoomInstance.isOnlineMultiplayer === true) {
    if(!gameRoomInstance.id) {
      return <GameViewEmpty/>
    }

    const gameInstanceId = gameRoomInstance.gameInstanceIds[gameRoomInstance.arcadeGameMongoId]

    if(!gameInstanceId) {
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
  gameModel: { gameModel }
}) => {
  // const [gameInstance, setComponentGameInstance] = useState()

  useEffect(() => {
    const { width, height } = getGameModelSize(gameModel)
    config.scale.width = width
    config.scale.height = height
    const gameInstance = new Phaser.Game(config);
    gameInstance.scene.add(PRELOADER_SCENE, new PreloaderScene(gameRoomInstance), true);
    setGameInstance(gameInstance)
    return () => {
      const scene = getCurrentGameScene(gameInstance)
      if(scene.setPlayerGameLoaded) scene.setPlayerGameLoaded(null)
      gameInstance.scene?.scenes?.forEach(scene => {
        scene.unload()
      })

      gameInstance.loop.destroy()
      gameInstance.renderer.destroy()

      // theres a bad bug for some reason where theres a recursive issue here. 
      // its definitely the game instance destroy line
      // gameInstance.destroy(true);    

      setTimeout(() => {
        setGameInstance(null, null)
      });
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