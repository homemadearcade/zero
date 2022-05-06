import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../scenes/PreloaderScene';

import './GameView.scss';
import { PRELOADER_SCENE } from '../../constants';

import { addGame } from '../../store/actions/gameActions';

import WaterBodyPlugin from 'phaser-plugin-water-body';
import SaveGameButton from '../SaveGameButton/SaveGameButton';

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
      enableSleeping: true,
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

const GameView = ({model, leftColumn, rightColumn, children, overlay}) => {
  const [game, setGame] = useState()

  useEffect(() => {
    const game = new Phaser.Game(config);
    game.scene.add(PRELOADER_SCENE, new PreloaderScene({model}), true);
    setGame(game)
  }, []);

  useEffect(() => {
    if(game) game.scene?.scenes[0]?.reloadModel(model)
  }, [model])

  return (
  <div className="GameView">
    <div className="GameView__left-column">
      {leftColumn}
      <SaveGameButton/>
    </div>
    <div id="PhaserGame" onContextMenu={(e) => {
      e.preventDefault()
    }}/>
    <div className="GameView__right-column">{rightColumn}</div>
    {children}
    <div className="GameView__overlay">
      {overlay}
    </div>
  </div>);
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { addGame })(GameView);