import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../scenes/PreloaderScene';

import './GameView.scss';
import { PRELOADER_SCENE } from '../../constants';


import WaterBodyPlugin from 'phaser-plugin-water-body';

new Phaser.Game({

});

const config= {
  type: Phaser.CANVAS,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'PhaserGame',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 1000
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: {
    'physics': 'matter',
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

const GameView = ({gameModel, leftColumn, rightColumn}) => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    game.scene.add(PRELOADER_SCENE, new PreloaderScene({gameModel}), true);
  }, []);

  return (<div className="GameView">
      <div className="GameView__left-column">{leftColumn}</div>
      <div id="PhaserGame"/>
      <div className="GameView__right-column">{rightColumn}</div>
    </div>);
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(GameView);