import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { PreloaderScene } from '../../scenes/PreloaderScene';

const config= {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight * 0.9,
  parent: 'game',
};

const GameView = props => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    game.scene.add('preloader', new PreloaderScene(), true);
  });

  return (
    <div id="game" />
  );
};

export default GameView;