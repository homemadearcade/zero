/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../../scenes/PreloaderScene';

import './GameView.scss';
import { GAME_INSTANCE_ID_PREFIX, noPhaserUpdateDelta, PRELOADER_SCENE } from '../../constants';
import { DEFAULT_THEME_COLOR, PHASER_ERROR } from '../../../constants';

import { gameSize } from '../../constants';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { setGameInstance } from '../../../store/actions/webPageActions';

import Cutscene from '../../cutscene/Cutscene/Cutscene';
import StateScreen from '../../gameRoom/GameStateScreen/GameStateScreen';
import store from '../../../store';
import ControlsPopup from '../ControlsPopup/ControlsPopup';
import Icon from '../../../ui/Icon/Icon';
import { changeErrorState, clearErrorState } from '../../../store/actions/errorsActions';
import { generateUniqueId } from '../../../utils/webPageUtils';
import GameViewEmpty from '../GameViewEmpty/GameViewEmpty';
import { updateTheme } from '../../../store/actions/themeActions';
import { editGameRoom } from '../../../store/actions/gameRoomActions';

const config= {
  type: Phaser.WEBGL,
  pixelArt: true,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'PhaserGame',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameSize,
    height: gameSize
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

  return <PhaserGame {...props}></PhaserGame>
}

const PhaserGame = ({
  setGameInstance, 
  changeErrorState, 
  clearErrorState,
  children,
  gameRoom: { gameRoom },
}) => {
  useEffect(() => {
    const game = new Phaser.Game(config);
    const gameInstanceId =  GAME_INSTANCE_ID_PREFIX + generateUniqueId()
    game.scene.add(PRELOADER_SCENE, new PreloaderScene({...gameRoom, gameInstanceId}), true);
    setGameInstance(game, gameInstanceId)
    return () => {
      getCurrentGameScene(game)?.unload()
      setGameInstance(null, null)
      game.destroy()
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
  gameRoom: state.gameRoom,
});

export default connect(mapStateToProps, { setGameInstance, changeErrorState, clearErrorState, updateTheme })(GameView);