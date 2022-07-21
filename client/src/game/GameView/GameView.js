import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../scenes/PreloaderScene';

import './GameView.scss';
import { PRELOADER_SCENE } from '../../constants';

import WaterBodyPlugin from 'phaser-plugin-water-body';
import Loader from '../../app/ui/Loader/Loader';
import { gameSize } from '../../defaultData/general';

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
    default: 'matter',
    matter: {
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

const GameView = ({isHost, isNetworked, isSpriteSheetDataLoading}) => {
  useEffect(() => {
    const game = new Phaser.Game(config);
    game.scene.add(PRELOADER_SCENE, new PreloaderScene({ isHost, isNetworked}), true);

    return () => {
      game.scene.scenes[0]?.unload()
      game.destroy()
    }
  }, []);

  if(isSpriteSheetDataLoading) {
    return <Loader text="Loading Sprites..."/>
  }

  return (
    <div className="GameView">
      <div id="PhaserGame"/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isSpriteSheetDataLoading: state.game.isSpriteSheetDataLoading
});

export default connect(mapStateToProps, { })(GameView);