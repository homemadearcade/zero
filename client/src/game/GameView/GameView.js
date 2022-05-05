import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../scenes/PreloaderScene';

import './GameView.scss';
import { PRELOADER_SCENE } from '../../constants';

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

const GameView = ({gameModel, leftColumn, rightColumn, children, overlay}) => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    game.scene.add(PRELOADER_SCENE, new PreloaderScene({gameModel}), true);
  }, []);

  return (<div className="GameView">
      <div className="GameView__left-column">{leftColumn}</div>
      <div id="PhaserGame"/>
      <div className="GameView__right-column">{rightColumn}</div>
      {children}
      <div className="GameView__overlay">
        {overlay}
      </div>
    </div>);
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(GameView);