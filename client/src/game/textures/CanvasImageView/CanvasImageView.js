import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';

import './CanvasImageView.scss';
import { newTextureSize, POPUP_SCENE } from '../../constants';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { CodrawingScene } from '../../scenes/CodrawingScene';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { setCanvasImageDialogGameInstance } from '../../../store/actions/webPageActions';

const CanvasImageView = ({
  textureTint,
  setCanvasImageDialogGameInstance,
  initialTextureId,
  textureId
 }) => {
  useEffect(() => {
    let game;

    setTimeout(() => {
      const config= {
        type: Phaser.WEBGL,
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
          parent: 'PhaserPopupGame',
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: newTextureSize,
          height: newTextureSize
        },
      }
      
      game = new Phaser.Game(config);
      game.scene.add(POPUP_SCENE, new CodrawingScene({ initialTextureId, textureId, textureTint, key: POPUP_SCENE, size: newTextureSize }), true);
      setCanvasImageDialogGameInstance(game)
    }, 100)

    console.log('load sprite edit ')
    return () => {
      if(!game) return
      console.log('unload sprite edit ')
      getCurrentGameScene(game).unload()
      game.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div id="PhaserPopupGame" className='CanvasImageView'/>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {

});

export default connect(mapStateToProps, { setCanvasImageDialogGameInstance })(CanvasImageView);