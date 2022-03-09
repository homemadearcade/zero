import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../scenes/PreloaderScene';

import './GameView.scss';
import { PRELOADER_SCENE } from '../../constants';

const config= {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight * 0.9,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'PhaserGame',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 1000
  },
};

const GameView = ({gameModel, leftColumn, rightColumn}) => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    game.scene.add(PRELOADER_SCENE, new PreloaderScene({gameModel}), true);
  }, []);

  return (<div className="GameView">
      <div>{leftColumn}</div>
      <div id="PhaserGame"/>
      <div>{rightColumn}</div>
    </div>);
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(GameView);