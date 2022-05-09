import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../scenes/PreloaderScene';

import './GameView.scss';
import { PRELOADER_SCENE } from '../../constants';

import { editGameModel } from '../../store/actions/gameActions';
import { openContextMenu, closeContextMenu } from '../../store/actions/interfaceActions';

import WaterBodyPlugin from 'phaser-plugin-water-body';

const config= {
  type: Phaser.WEBGL,
  pixelArt: true,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'PhaserGame',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 1000
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0
      },
      debug: {
        showBody: true,
        showStaticBody: true
      }
    }
  },
  plugins: {
    global: [
      {
        key: 'WaterBodyPlugin',
        plugin: WaterBodyPlugin,
        start: true,
      }
    ]
  }
};

const GameView = ({gameModel, lobbyId, isHost, isNetworked, openContextMenu, closeContextMenu, editGameModel}) => {
  const [loadedGame, setLoadedGame] = useState()

  useEffect(() => {
    const game = new Phaser.Game(config);
    game.scene.add(PRELOADER_SCENE, new PreloaderScene({ lobbyId, isHost, isNetworked, gameModel, openContextMenu, closeContextMenu, editGameModel }), true);
    setLoadedGame(game)

    return () => {
      game.destroy()
    }
  }, []);

  // useEffect(() => {
  //   if(game) {
  //     game.scene?.scenes[0]?.reloadGameModel(gameModel) 
  //   }
  // }, [game])

  return (
    <div className="GameView">
      <div id="PhaserGame"/>
    </div>
    );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { openContextMenu, closeContextMenu, editGameModel })(GameView);